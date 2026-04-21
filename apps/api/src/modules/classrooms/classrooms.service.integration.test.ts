import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import { ClassroomsService } from "./classrooms.service";

const DOCENTE_USER: JwtPayload = {
  sub: "teacher-1",
  email: "docente@foxmind.app",
  role: "DOCENTE",
  tenantId: "tenant-1"
};

const ALUMNO_USER: JwtPayload = {
  sub: "student-1",
  email: "alumno@foxmind.app",
  role: "ALUMNO",
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
    activity: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn()
    },
    submission: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn()
    },
    user: {
      findFirst: vi.fn(),
      create: vi.fn()
    },
    enrollment: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
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

  it("creates published activity for classroom teacher", async () => {
    prisma.classroom.findFirst.mockResolvedValue({
      id: "classroom-1",
      tenantId: DOCENTE_USER.tenantId,
      teacherId: DOCENTE_USER.sub
    });
    prisma.activity.create.mockResolvedValue({
      id: "activity-1",
      title: "TP 1",
      description: "Resolver ejercicios 1 al 5",
      status: "published"
    });

    const result = await service.createClassroomActivity(
      "classroom-1",
      {
        title: "TP 1",
        description: "Resolver ejercicios 1 al 5"
      },
      DOCENTE_USER
    );

    expect(result).toEqual({
      id: "activity-1",
      title: "TP 1",
      description: "Resolver ejercicios 1 al 5",
      status: "published"
    });
    expect(prisma.activity.create).toHaveBeenCalledWith({
      data: {
        tenantId: DOCENTE_USER.tenantId,
        classroomId: "classroom-1",
        creatorUserId: DOCENTE_USER.sub,
        title: "TP 1",
        description: "Resolver ejercicios 1 al 5",
        status: "PUBLISHED"
      }
    });
    expect(classroomLogger.info).toHaveBeenCalledWith(
      "activity.created",
      expect.objectContaining({
        tenantId: DOCENTE_USER.tenantId,
        actorUserId: DOCENTE_USER.sub,
        role: DOCENTE_USER.role,
        resourceId: "activity-1"
      })
    );
  });

  it("lists activities for DOCENTE in own classroom", async () => {
    prisma.classroom.findFirst.mockResolvedValue({
      id: "classroom-1",
      teacherId: DOCENTE_USER.sub,
      tenantId: DOCENTE_USER.tenantId
    });
    prisma.activity.findMany.mockResolvedValue([
      {
        id: "activity-1",
        classroomId: "classroom-1",
        title: "TP 1",
        description: "Resolver ejercicios 1 al 5",
        status: "published",
        createdAt: new Date("2026-05-12T10:00:00.000Z")
      }
    ]);

    const result = await service.getClassroomActivities("classroom-1", DOCENTE_USER);

    expect(result).toHaveLength(1);
    expect(prisma.activity.findMany).toHaveBeenCalledWith({
      where: {
        tenantId: DOCENTE_USER.tenantId,
        classroomId: "classroom-1"
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  });

  it("lists activities for ALUMNO only when assigned to classroom", async () => {
    prisma.enrollment.findFirst.mockResolvedValue({
      id: "enrollment-1",
      classroomId: "classroom-1",
      studentId: ALUMNO_USER.sub,
      tenantId: ALUMNO_USER.tenantId
    });
    prisma.activity.findMany.mockResolvedValue([
      {
        id: "activity-1",
        classroomId: "classroom-1",
        title: "TP 1",
        description: "Resolver ejercicios 1 al 5",
        status: "published",
        createdAt: new Date("2026-05-12T10:00:00.000Z")
      }
    ]);

    const result = await service.getClassroomActivities("classroom-1", ALUMNO_USER);

    expect(result).toHaveLength(1);
    expect(prisma.activity.findMany).toHaveBeenCalledWith({
      where: {
        tenantId: ALUMNO_USER.tenantId,
        classroomId: "classroom-1"
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  });

  it("rejects activity list for ALUMNO not assigned to classroom", async () => {
    prisma.enrollment.findFirst.mockResolvedValue(null);

    await expect(service.getClassroomActivities("classroom-1", ALUMNO_USER)).rejects.toBeInstanceOf(
      NotFoundException
    );
    expect(prisma.activity.findMany).not.toHaveBeenCalled();
  });

  it("creates submission for ALUMNO assigned to classroom", async () => {
    prisma.activity.findFirst.mockResolvedValue({
      id: "activity-1",
      classroomId: "classroom-1",
      tenantId: ALUMNO_USER.tenantId
    });
    prisma.enrollment.findFirst.mockResolvedValue({
      id: "enrollment-1",
      classroomId: "classroom-1",
      studentId: ALUMNO_USER.sub,
      tenantId: ALUMNO_USER.tenantId
    });
    prisma.submission.create.mockResolvedValue({
      id: "submission-1",
      activityId: "activity-1",
      studentId: ALUMNO_USER.sub,
      content: "Respuesta final de la actividad",
      status: "SUBMITTED",
      createdAt: new Date("2026-05-12T11:00:00.000Z")
    });

    const result = await service.submitActivity(
      "activity-1",
      { content: "Respuesta final de la actividad" },
      ALUMNO_USER
    );

    expect(result).toEqual({
      id: "submission-1",
      activityId: "activity-1",
      studentId: ALUMNO_USER.sub,
      content: "Respuesta final de la actividad",
      status: "submitted",
      createdAt: new Date("2026-05-12T11:00:00.000Z")
    });
    expect(prisma.submission.create).toHaveBeenCalledWith({
      data: {
        tenantId: ALUMNO_USER.tenantId,
        activityId: "activity-1",
        studentId: ALUMNO_USER.sub,
        content: "Respuesta final de la actividad",
        status: "SUBMITTED"
      }
    });
    expect(classroomLogger.info).toHaveBeenCalledWith(
      "submission.created",
      expect.objectContaining({
        tenantId: ALUMNO_USER.tenantId,
        actorUserId: ALUMNO_USER.sub,
        role: ALUMNO_USER.role,
        resourceId: "submission-1"
      })
    );
  });

  it("rejects submission when ALUMNO is not enrolled in activity classroom", async () => {
    prisma.activity.findFirst.mockResolvedValue({
      id: "activity-1",
      classroomId: "classroom-1",
      tenantId: ALUMNO_USER.tenantId
    });
    prisma.enrollment.findFirst.mockResolvedValue(null);

    await expect(
      service.submitActivity("activity-1", { content: "Respuesta final de la actividad" }, ALUMNO_USER)
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.submission.create).not.toHaveBeenCalled();
  });

  it("rejects submission when content is empty or shorter than minimum", async () => {
    prisma.activity.findFirst.mockResolvedValue({
      id: "activity-1",
      classroomId: "classroom-1",
      tenantId: ALUMNO_USER.tenantId
    });
    prisma.enrollment.findFirst.mockResolvedValue({
      id: "enrollment-1",
      classroomId: "classroom-1",
      studentId: ALUMNO_USER.sub,
      tenantId: ALUMNO_USER.tenantId
    });

    await expect(service.submitActivity("activity-1", { content: "        " }, ALUMNO_USER)).rejects.toBeInstanceOf(
      BadRequestException
    );
    await expect(service.submitActivity("activity-1", { content: "corto" }, ALUMNO_USER)).rejects.toBeInstanceOf(
      BadRequestException
    );
    expect(prisma.submission.create).not.toHaveBeenCalled();
  });

  it("grades submission for DOCENTE that owns classroom", async () => {
    prisma.submission.findFirst.mockResolvedValue({
      id: "submission-1",
      tenantId: DOCENTE_USER.tenantId,
      status: "SUBMITTED",
      activity: {
        classroomId: "classroom-1"
      }
    });
    prisma.classroom.findFirst.mockResolvedValue({
      id: "classroom-1",
      tenantId: DOCENTE_USER.tenantId,
      teacherId: DOCENTE_USER.sub
    });
    prisma.submission.update.mockResolvedValue({
      id: "submission-1",
      activityId: "activity-1",
      studentId: ALUMNO_USER.sub,
      content: "Respuesta final de la actividad",
      status: "GRADED",
      score: 8,
      feedback: "Buen trabajo, faltó justificar el último paso.",
      gradedAt: new Date("2026-05-12T12:00:00.000Z"),
      gradedByUserId: DOCENTE_USER.sub
    });

    const result = await service.gradeSubmission(
      "submission-1",
      {
        score: 8,
        feedback: "Buen trabajo, faltó justificar el último paso."
      },
      DOCENTE_USER
    );

    expect(result).toEqual({
      id: "submission-1",
      activityId: "activity-1",
      studentId: ALUMNO_USER.sub,
      content: "Respuesta final de la actividad",
      status: "graded",
      score: 8,
      feedback: "Buen trabajo, faltó justificar el último paso.",
      gradedAt: new Date("2026-05-12T12:00:00.000Z"),
      gradedByUserId: DOCENTE_USER.sub
    });
    expect(prisma.submission.update).toHaveBeenCalledWith({
      where: { id: "submission-1" },
      data: expect.objectContaining({
        status: "GRADED",
        score: 8,
        feedback: "Buen trabajo, faltó justificar el último paso.",
        gradedByUserId: DOCENTE_USER.sub
      })
    });
    expect(classroomLogger.info).toHaveBeenCalledWith(
      "submission.graded",
      expect.objectContaining({
        tenantId: DOCENTE_USER.tenantId,
        actorUserId: DOCENTE_USER.sub,
        role: DOCENTE_USER.role,
        resourceId: "submission-1"
      })
    );
  });

  it("rejects grading when DOCENTE does not own classroom", async () => {
    prisma.submission.findFirst.mockResolvedValue({
      id: "submission-1",
      tenantId: DOCENTE_USER.tenantId,
      status: "SUBMITTED",
      activity: {
        classroomId: "classroom-1"
      }
    });
    prisma.classroom.findFirst.mockResolvedValue(null);

    await expect(
      service.gradeSubmission(
        "submission-1",
        {
          score: 8,
          feedback: "Buen trabajo general"
        },
        DOCENTE_USER
      )
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.submission.update).not.toHaveBeenCalled();
  });

  it("rejects grading when score or feedback is invalid", async () => {
    prisma.submission.findFirst.mockResolvedValue({
      id: "submission-1",
      tenantId: DOCENTE_USER.tenantId,
      status: "SUBMITTED",
      activity: {
        classroomId: "classroom-1"
      }
    });
    prisma.classroom.findFirst.mockResolvedValue({
      id: "classroom-1",
      tenantId: DOCENTE_USER.tenantId,
      teacherId: DOCENTE_USER.sub
    });

    await expect(
      service.gradeSubmission(
        "submission-1",
        {
          score: 0,
          feedback: "Feedback correcto"
        },
        DOCENTE_USER
      )
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.gradeSubmission(
        "submission-1",
        {
          score: 7,
          feedback: "   "
        },
        DOCENTE_USER
      )
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.submission.update).not.toHaveBeenCalled();
  });

  it("rejects grading when submission was already graded", async () => {
    prisma.submission.findFirst.mockResolvedValue({
      id: "submission-1",
      tenantId: DOCENTE_USER.tenantId,
      status: "GRADED",
      activity: {
        classroomId: "classroom-1"
      }
    });
    prisma.classroom.findFirst.mockResolvedValue({
      id: "classroom-1",
      tenantId: DOCENTE_USER.tenantId,
      teacherId: DOCENTE_USER.sub
    });

    await expect(
      service.gradeSubmission(
        "submission-1",
        {
          score: 9,
          feedback: "Seguí así"
        },
        DOCENTE_USER
      )
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.submission.update).not.toHaveBeenCalled();
  });
});
