import { ConflictException, NotFoundException } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import { ClassroomsService } from "./classrooms.service";

const DOCENTE_USER: JwtPayload = {
  sub: "teacher-1",
  email: "docente@foxmind.app",
  role: "DOCENTE",
  tenantId: "tenant-1"
};

const STUDENT_ID = "student-1";
const STUDENT_EMAIL = "Student1@FoxMind.app";

const DUPLICATE_ENROLLMENT_ERROR = Object.assign(new Error("Duplicate enrollment"), {
  code: "P2002"
});

describe("ClassroomsService integration", () => {
  const classroomLogger = {
    info: vi.fn(),
    warn: vi.fn()
  };

  const prisma = {
    classroom: {
      create: vi.fn(),
      updateMany: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn()
    },
    user: {
      findFirst: vi.fn(),
      create: vi.fn()
    },
    enrollment: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn()
    }
  };

  let service: ClassroomsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ClassroomsService(prisma as never, classroomLogger as never);
  });

  it("creates classroom for docente tenant", async () => {
    prisma.classroom.create.mockResolvedValue({
      id: "classroom-1",
      tenantId: DOCENTE_USER.tenantId,
      teacherId: DOCENTE_USER.sub,
      name: "1A Ciencias",
      subject: "Ciencias"
    });

    const result = await service.createClassroom(
      {
        name: "1A Ciencias",
        subject: "Ciencias"
      },
      DOCENTE_USER
    );

    expect(result.id).toBe("classroom-1");
    expect(prisma.classroom.create).toHaveBeenCalledWith({
      data: {
        tenantId: DOCENTE_USER.tenantId,
        teacherId: DOCENTE_USER.sub,
        name: "1A Ciencias",
        subject: "Ciencias"
      }
    });
    expect(classroomLogger.info).toHaveBeenCalledWith(
      "classroom.created",
      expect.objectContaining({
        tenantId: DOCENTE_USER.tenantId,
        actorUserId: DOCENTE_USER.sub,
        role: DOCENTE_USER.role,
        resourceId: "classroom-1"
      })
    );
  });

  it("updates classroom only inside same tenant", async () => {
    prisma.classroom.updateMany.mockResolvedValue({ count: 1 });
    prisma.classroom.findFirst.mockResolvedValue({
      id: "classroom-1",
      tenantId: DOCENTE_USER.tenantId,
      name: "1A Ciencias B",
      subject: "Ciencias"
    });

    const result = await service.updateClassroom(
      "classroom-1",
      {
        name: "1A Ciencias B"
      },
      DOCENTE_USER
    );

    expect(result.name).toBe("1A Ciencias B");
    expect(prisma.classroom.updateMany).toHaveBeenCalledWith({
      where: {
        id: "classroom-1",
        tenantId: DOCENTE_USER.tenantId
      },
      data: {
        name: "1A Ciencias B"
      }
    });
  });

  it("rejects update when classroom is outside tenant", async () => {
    prisma.classroom.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.updateClassroom(
        "classroom-unknown",
        {
          name: "Nope"
        },
        DOCENTE_USER
      )
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("creates enrollment once and returns duplicate state on retry", async () => {
    prisma.classroom.findFirst.mockResolvedValue({
      id: "classroom-1",
      tenantId: DOCENTE_USER.tenantId
    });
    prisma.user.findFirst.mockResolvedValue({
      id: STUDENT_ID,
      tenantId: DOCENTE_USER.tenantId,
      role: "ALUMNO"
    });
    prisma.enrollment.create
      .mockResolvedValueOnce({
        id: "enrollment-1",
        classroomId: "classroom-1",
        studentId: STUDENT_ID
      })
      .mockRejectedValueOnce(DUPLICATE_ENROLLMENT_ERROR);
    prisma.enrollment.findUnique.mockResolvedValue({
      id: "enrollment-1",
      classroomId: "classroom-1",
      studentId: STUDENT_ID
    });

    const first = await service.createEnrollment("classroom-1", { studentId: STUDENT_ID }, DOCENTE_USER);
    const second = await service.createEnrollment("classroom-1", { studentId: STUDENT_ID }, DOCENTE_USER);

    expect(first.created).toBe(true);
    expect(second).toEqual({
      created: false,
      enrollmentId: "enrollment-1"
    });
    expect(prisma.enrollment.create).toHaveBeenCalledTimes(2);
    expect(classroomLogger.info).toHaveBeenCalledWith(
      "enrollment.created",
      expect.objectContaining({
        tenantId: DOCENTE_USER.tenantId,
        actorUserId: DOCENTE_USER.sub,
        role: DOCENTE_USER.role,
        resourceId: "enrollment-1"
      })
    );
  });

  it("fails enrollment when student does not belong to tenant", async () => {
    prisma.classroom.findFirst.mockResolvedValue({
      id: "classroom-1",
      tenantId: DOCENTE_USER.tenantId
    });
    prisma.user.findFirst.mockResolvedValue(null);

    await expect(
      service.createEnrollment("classroom-1", { studentId: STUDENT_ID }, DOCENTE_USER)
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("imports csv enrollment rows and reports duplicate rows as errors", async () => {
    prisma.classroom.findFirst.mockResolvedValue({
      id: "classroom-1",
      tenantId: DOCENTE_USER.tenantId
    });
    prisma.user.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: STUDENT_ID,
        tenantId: DOCENTE_USER.tenantId,
        email: "student1@foxmind.app",
        role: "ALUMNO"
      });
    prisma.user.create.mockResolvedValue({
      id: STUDENT_ID,
      tenantId: DOCENTE_USER.tenantId,
      email: "student1@foxmind.app",
      role: "ALUMNO"
    });
    prisma.enrollment.create
      .mockResolvedValueOnce({
        id: "enrollment-1",
        classroomId: "classroom-1",
        studentId: STUDENT_ID
      })
      .mockRejectedValueOnce(DUPLICATE_ENROLLMENT_ERROR);

    const result = await service.importEnrollmentsFromCsv(
      "classroom-1",
      {
        csvContent: `email,fullName\n${STUDENT_EMAIL},Alumno Uno\n${STUDENT_EMAIL},Alumno Uno`
      },
      DOCENTE_USER
    );

    expect(result).toEqual({
      processed: 2,
      createdUsers: 1,
      createdEnrollments: 1,
      errors: [
        {
          line: 3,
          code: "DUPLICATE_ENROLLMENT",
          message: "El alumno ya estaba enrolado en esta aula"
        }
      ]
    });
    expect(classroomLogger.info).toHaveBeenCalledWith(
      "enrollment.csv.imported",
      expect.objectContaining({
        tenantId: DOCENTE_USER.tenantId,
        actorUserId: DOCENTE_USER.sub,
        role: DOCENTE_USER.role,
        resourceId: "classroom-1"
      })
    );
    expect(classroomLogger.warn).toHaveBeenCalledWith(
      "enrollment.csv.rejected",
      expect.objectContaining({
        tenantId: DOCENTE_USER.tenantId,
        actorUserId: DOCENTE_USER.sub,
        role: DOCENTE_USER.role,
        resourceId: "classroom-1",
        line: 3,
        code: "DUPLICATE_ENROLLMENT"
      })
    );
  });

  it("rejects csv import when header is invalid", async () => {
    prisma.classroom.findFirst.mockResolvedValue({
      id: "classroom-1",
      tenantId: DOCENTE_USER.tenantId
    });

    const result = await service.importEnrollmentsFromCsv(
      "classroom-1",
      {
        csvContent: "studentEmail,fullName\nstudent1@foxmind.app,Alumno Uno"
      },
      DOCENTE_USER
    );

    expect(result.processed).toBe(0);
    expect(result.createdUsers).toBe(0);
    expect(result.createdEnrollments).toBe(0);
    expect(result.errors).toEqual([
      {
        line: 1,
        code: "INVALID_HEADER",
        message: "El CSV debe incluir el header exacto: email,fullName"
      }
    ]);
    expect(classroomLogger.warn).toHaveBeenCalledWith(
      "enrollment.csv.rejected",
      expect.objectContaining({
        line: 1,
        code: "INVALID_HEADER"
      })
    );
  });

  it("returns only assigned classrooms for ALUMNO", async () => {
    prisma.enrollment.findMany.mockResolvedValue([
      {
        id: "enrollment-1",
        classroom: {
          id: "classroom-1",
          name: "2A",
          subject: "Matemática"
        }
      }
    ]);

    const result = await service.getStudentClassrooms({
      sub: "student-1",
      email: "alumno@foxmind.app",
      role: "ALUMNO",
      tenantId: "tenant-1"
    });

    expect(result).toEqual([
      {
        id: "classroom-1",
        name: "2A",
        subject: "Matemática",
        enrollmentId: "enrollment-1"
      }
    ]);
    expect(prisma.enrollment.findMany).toHaveBeenCalledWith({
      where: {
        tenantId: "tenant-1",
        studentId: "student-1"
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
  });

  it("returns teacher classrooms with enrolled students roster", async () => {
    prisma.classroom.findMany.mockResolvedValue([
      {
        id: "classroom-1",
        name: "2A",
        subject: "Matemática",
        enrollments: [
          {
            student: {
              id: "student-1",
              email: "alumno1@foxmind.app",
              fullName: "Alumno Uno"
            }
          }
        ]
      }
    ]);

    const result = await service.getTeacherClassrooms(DOCENTE_USER);

    expect(result).toEqual([
      {
        id: "classroom-1",
        name: "2A",
        subject: "Matemática",
        students: [
          {
            studentId: "student-1",
            email: "alumno1@foxmind.app",
            fullName: "Alumno Uno",
            status: "active"
          }
        ]
      }
    ]);
    expect(prisma.classroom.findMany).toHaveBeenCalledWith({
      where: {
        tenantId: DOCENTE_USER.tenantId,
        teacherId: DOCENTE_USER.sub
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
  });
});
