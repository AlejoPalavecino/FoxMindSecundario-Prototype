import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service";
import type { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import { ClassroomsLogger } from "./classrooms.logger";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { ImportEnrollmentsCsvDto } from "./dto/import-enrollments-csv.dto";
import { CreateClassroomActivityDto } from "./dto/create-classroom-activity.dto";

type EnrollmentResult = {
  created: boolean;
  enrollmentId: string;
};

type CsvImportError = {
  line: number;
  code: string;
  message: string;
};

type CsvImportResult = {
  processed: number;
  createdUsers: number;
  createdEnrollments: number;
  errors: CsvImportError[];
};

type StudentClassroom = {
  id: string;
  name: string;
  subject: string;
  enrollmentId: string;
};

type TeacherClassroomStudent = {
  studentId: string;
  email: string;
  fullName: string;
  status: "active";
};

type TeacherClassroom = {
  id: string;
  name: string;
  subject: string;
  students: TeacherClassroomStudent[];
};

type ClassroomActivity = {
  id: string;
  classroomId: string;
  title: string;
  description: string;
  status: "published";
  createdAt: Date;
};

const CSV_HEADER = "email,fullName";
const MAX_CSV_ROWS = 200;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable()
export class ClassroomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly classroomsLogger: ClassroomsLogger
  ) {}

  async createClassroom(dto: CreateClassroomDto, actor: JwtPayload) {
    const classroom = await this.prisma.classroom.create({
      data: {
        tenantId: actor.tenantId,
        teacherId: actor.sub,
        name: dto.name,
        subject: dto.subject
      }
    });

    this.classroomsLogger.info("classroom.created", this.buildLogMetadata(actor, classroom.id));

    return classroom;
  }

  async updateClassroom(id: string, dto: UpdateClassroomDto, actor: JwtPayload) {
    const updateResult = await this.prisma.classroom.updateMany({
      where: {
        id,
        tenantId: actor.tenantId
      },
      data: dto
    });

    if (updateResult.count === 0) {
      throw new NotFoundException("Aula no encontrada");
    }

    const classroom = await this.prisma.classroom.findFirst({
      where: {
        id,
        tenantId: actor.tenantId
      }
    });

    if (!classroom) {
      throw new NotFoundException("Aula no encontrada");
    }

    this.classroomsLogger.info("classroom.updated", this.buildLogMetadata(actor, classroom.id));

    return classroom;
  }

  async createEnrollment(
    classroomId: string,
    dto: CreateEnrollmentDto,
    actor: JwtPayload
  ): Promise<EnrollmentResult> {
    await this.ensureClassroomBelongsToTenant(classroomId, actor.tenantId);
    await this.ensureStudentBelongsToTenant(dto.studentId, actor.tenantId);

    try {
      const enrollment = await this.prisma.enrollment.create({
        data: {
          tenantId: actor.tenantId,
          classroomId,
          studentId: dto.studentId
        }
      });

      this.classroomsLogger.info("enrollment.created", this.buildLogMetadata(actor, enrollment.id));

      return {
        created: true,
        enrollmentId: enrollment.id
      };
    } catch (error) {
      if (this.isDuplicateEnrollmentError(error)) {
        const existingEnrollment = await this.prisma.enrollment.findUnique({
          where: {
            classroomId_studentId: {
              classroomId,
              studentId: dto.studentId
            }
          }
        });

        if (!existingEnrollment) {
          throw error;
        }

        return {
          created: false,
          enrollmentId: existingEnrollment.id
        };
      }

      throw error;
    }
  }

  async importEnrollmentsFromCsv(
    classroomId: string,
    dto: ImportEnrollmentsCsvDto,
    actor: JwtPayload
  ): Promise<CsvImportResult> {
    await this.ensureClassroomBelongsToTenant(classroomId, actor.tenantId);

    const rows = this.parseCsvRows(dto.csvContent);
    if (rows.length === 0) {
      return this.rejectedCsvResult(actor, classroomId, {
        line: 1,
        code: "EMPTY_FILE",
        message: "El CSV está vacío"
      });
    }

    if (rows[0] !== CSV_HEADER) {
      return this.rejectedCsvResult(actor, classroomId, {
        line: 1,
        code: "INVALID_HEADER",
        message: "El CSV debe incluir el header exacto: email,fullName"
      });
    }

    const dataRows = rows.slice(1);
    if (dataRows.length > MAX_CSV_ROWS) {
      return this.rejectedCsvResult(actor, classroomId, {
        line: 1,
        code: "MAX_ROWS_EXCEEDED",
        message: `El CSV supera el máximo de ${MAX_CSV_ROWS} filas`
      });
    }

    const result: CsvImportResult = {
      processed: dataRows.length,
      createdUsers: 0,
      createdEnrollments: 0,
      errors: []
    };

    for (let index = 0; index < dataRows.length; index += 1) {
      const line = index + 2;
      const parsed = this.parseCsvLine(dataRows[index] ?? "", line);
      if (!parsed.ok) {
        result.errors.push(parsed.error);
        continue;
      }

      const student = await this.findOrCreateStudent(actor.tenantId, parsed.email, parsed.fullName);
      if (student.created) {
        result.createdUsers += 1;
      }

      try {
        await this.prisma.enrollment.create({
          data: {
            tenantId: actor.tenantId,
            classroomId,
            studentId: student.id
          }
        });
        result.createdEnrollments += 1;
      } catch (error) {
        if (this.isDuplicateEnrollmentError(error)) {
          result.errors.push({
            line,
            code: "DUPLICATE_ENROLLMENT",
            message: "El alumno ya estaba enrolado en esta aula"
          });
          continue;
        }

        throw error;
      }
    }

    this.classroomsLogger.info("enrollment.csv.imported", {
      ...this.buildLogMetadata(actor, classroomId),
      processed: result.processed,
      createdUsers: result.createdUsers,
      createdEnrollments: result.createdEnrollments,
      errorsCount: result.errors.length
    });

    for (const error of result.errors) {
      this.classroomsLogger.warn("enrollment.csv.rejected", {
        ...this.buildLogMetadata(actor, classroomId),
        line: error.line,
        code: error.code,
        message: error.message
      });
    }

    return result;
  }

  async getTeacherClassrooms(actor: JwtPayload): Promise<TeacherClassroom[]> {
    const classrooms = await this.prisma.classroom.findMany({
      where: {
        tenantId: actor.tenantId,
        teacherId: actor.sub
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        name: true,
        subject: true,
        enrollments: {
          orderBy: {
            createdAt: "asc"
          },
          select: {
            student: {
              select: {
                id: true,
                email: true,
                fullName: true
              }
            }
          }
        }
      }
    });

    return classrooms.map((classroom: {
      id: string;
      name: string;
      subject: string;
      enrollments: Array<{
        student: { id: string; email: string; fullName: string };
      }>;
    }) => ({
      id: classroom.id,
      name: classroom.name,
      subject: classroom.subject,
      students: classroom.enrollments.map((enrollment: {
        student: { id: string; email: string; fullName: string };
      }) => ({
        studentId: enrollment.student.id,
        email: enrollment.student.email,
        fullName: enrollment.student.fullName,
        status: "active"
      }))
    }));
  }

  async getStudentClassrooms(actor: JwtPayload): Promise<StudentClassroom[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        tenantId: actor.tenantId,
        studentId: actor.sub
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        classroom: {
          select: {
            id: true,
            name: true,
            subject: true
          }
        }
      }
    });

    return enrollments.map((enrollment: {
      id: string;
      classroom: { id: string; name: string; subject: string };
    }) => ({
      id: enrollment.classroom.id,
      name: enrollment.classroom.name,
      subject: enrollment.classroom.subject,
      enrollmentId: enrollment.id
    }));
  }

  async createClassroomActivity(classroomId: string, dto: CreateClassroomActivityDto, actor: JwtPayload) {
    await this.ensureTeacherOwnsClassroom(classroomId, actor);

    const activity = await this.prisma.activity.create({
      data: {
        tenantId: actor.tenantId,
        classroomId,
        creatorUserId: actor.sub,
        title: dto.title,
        description: dto.description,
        status: "PUBLISHED"
      }
    });

    this.classroomsLogger.info("activity.created", this.buildLogMetadata(actor, activity.id));

    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      status: "published"
    };
  }

  async getClassroomActivities(classroomId: string, actor: JwtPayload): Promise<ClassroomActivity[]> {
    await this.ensureActivityVisibility(classroomId, actor);

    const activities = await this.prisma.activity.findMany({
      where: {
        tenantId: actor.tenantId,
        classroomId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return activities.map((activity: {
      id: string;
      classroomId: string;
      title: string;
      description: string;
      createdAt: Date;
    }) => ({
      id: activity.id,
      classroomId: activity.classroomId,
      title: activity.title,
      description: activity.description,
      status: "published",
      createdAt: activity.createdAt
    }));
  }

  private async ensureClassroomBelongsToTenant(classroomId: string, tenantId: string) {
    const classroom = await this.prisma.classroom.findFirst({
      where: {
        id: classroomId,
        tenantId
      },
      select: { id: true }
    });

    if (!classroom) {
      throw new NotFoundException("Aula no encontrada");
    }
  }

  private async ensureStudentBelongsToTenant(studentId: string, tenantId: string) {
    const student = await this.prisma.user.findFirst({
      where: {
        id: studentId,
        tenantId,
        role: "ALUMNO"
      },
      select: { id: true }
    });

    if (!student) {
      throw new ConflictException("Alumno inválido para esta aula");
    }
  }

  private async ensureTeacherOwnsClassroom(classroomId: string, actor: JwtPayload) {
    const classroom = await this.prisma.classroom.findFirst({
      where: {
        id: classroomId,
        tenantId: actor.tenantId,
        teacherId: actor.sub
      },
      select: { id: true }
    });

    if (!classroom) {
      throw new NotFoundException("Aula no encontrada");
    }
  }

  private async ensureActivityVisibility(classroomId: string, actor: JwtPayload) {
    if (actor.role === "DOCENTE") {
      await this.ensureTeacherOwnsClassroom(classroomId, actor);
      return;
    }

    if (actor.role === "ALUMNO") {
      const enrollment = await this.prisma.enrollment.findFirst({
        where: {
          classroomId,
          tenantId: actor.tenantId,
          studentId: actor.sub
        },
        select: { id: true }
      });

      if (!enrollment) {
        throw new NotFoundException("Aula no encontrada");
      }

      return;
    }

    throw new NotFoundException("Aula no encontrada");
  }

  private buildLogMetadata(actor: JwtPayload, resourceId: string) {
    return {
      tenantId: actor.tenantId,
      actorUserId: actor.sub,
      role: actor.role,
      resourceId,
      timestamp: new Date().toISOString()
    };
  }

  private isDuplicateEnrollmentError(error: unknown) {
    if (typeof error === "object" && error && "code" in error) {
      const candidate = error as { code?: unknown };
      return candidate.code === "P2002";
    }

    return false;
  }

  private parseCsvRows(csvContent: string): string[] {
    return csvContent
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  private parseCsvLine(lineContent: string, line: number):
    | { ok: true; email: string; fullName: string }
    | { ok: false; error: CsvImportError } {
    const values = lineContent.split(",").map((value) => value.trim());
    if (values.length !== 2) {
      return {
        ok: false,
        error: {
          line,
          code: "INVALID_COLUMN_COUNT",
          message: "Cada fila debe incluir email y fullName"
        }
      };
    }

    const rawEmail = values[0] ?? "";
    const rawFullName = values[1] ?? "";
    const email = rawEmail.toLowerCase();
    if (!EMAIL_REGEX.test(email)) {
      return {
        ok: false,
        error: {
          line,
          code: "INVALID_EMAIL",
          message: "El email no es válido"
        }
      };
    }

    const fullName = rawFullName.trim();
    if (fullName.length === 0 || fullName.length > 120) {
      return {
        ok: false,
        error: {
          line,
          code: "INVALID_FULLNAME",
          message: "El fullName debe tener entre 1 y 120 caracteres"
        }
      };
    }

    return {
      ok: true,
      email,
      fullName
    };
  }

  private async findOrCreateStudent(tenantId: string, email: string, fullName: string) {
    const existing = await this.prisma.user.findFirst({
      where: {
        tenantId,
        email,
        role: "ALUMNO"
      },
      select: {
        id: true
      }
    });

    if (existing) {
      return {
        id: existing.id,
        created: false
      };
    }

    const created = await this.prisma.user.create({
      data: {
        tenantId,
        email,
        fullName,
        role: "ALUMNO",
        passwordHash: `csv-import-${randomUUID()}`
      },
      select: {
        id: true
      }
    });

    return {
      id: created.id,
      created: true
    };
  }

  private rejectedCsvResult(actor: JwtPayload, classroomId: string, error: CsvImportError): CsvImportResult {
    this.classroomsLogger.warn("enrollment.csv.rejected", {
      ...this.buildLogMetadata(actor, classroomId),
      line: error.line,
      code: error.code,
      message: error.message
    });

    return {
      processed: 0,
      createdUsers: 0,
      createdEnrollments: 0,
      errors: [error]
    };
  }
}
