import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import { ClassroomsLogger } from "./classrooms.logger";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";

type EnrollmentResult = {
  created: boolean;
  enrollmentId: string;
};

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
}
