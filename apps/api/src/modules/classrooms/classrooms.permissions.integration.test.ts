import { ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { describe, expect, it, vi } from "vitest";
import { RolesGuard } from "../auth/guards/roles.guard";
import type { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import { ClassroomsController } from "./classrooms.controller";
import { SubmissionsController } from "./submissions.controller";
import { StudentClassroomsController } from "./student-classrooms.controller";

type MockExecutionContextInput = {
  user?: JwtPayload;
  method?: string;
  url?: string;
  handler: (...args: any[]) => unknown;
  controllerClass: unknown;
};

function createExecutionContext(input: MockExecutionContextInput) {
  const request = {
    method: input.method ?? "POST",
    url: input.url ?? "/api/classrooms",
    user: input.user
  };

  return {
    getHandler: () => input.handler,
    getClass: () => input.controllerClass,
    switchToHttp: () => ({
      getRequest: () => request
    })
  } as never;
}

describe("Classrooms permissions integration", () => {
  const authLogger = {
    warn: vi.fn()
  };

  const docenteUser: JwtPayload = {
    sub: "teacher-1",
    email: "docente@foxmind.app",
    role: "DOCENTE",
    tenantId: "tenant-1"
  };

  const alumnoUser: JwtPayload = {
    sub: "student-1",
    email: "alumno@foxmind.app",
    role: "ALUMNO",
    tenantId: "tenant-1"
  };

  it("allows DOCENTE in classroom endpoints", () => {
    const guard = new RolesGuard(new Reflector(), authLogger as never);
    const context = createExecutionContext({
      user: docenteUser,
      handler: ClassroomsController.prototype.createClassroom,
      controllerClass: ClassroomsController
    });

    const allowed = guard.canActivate(context);

    expect(allowed).toBe(true);
  });

  it("rejects ALUMNO with 403 in classroom endpoints", () => {
    const guard = new RolesGuard(new Reflector(), authLogger as never);
    const context = createExecutionContext({
      user: alumnoUser,
      handler: ClassroomsController.prototype.createEnrollment,
      url: "/api/classrooms/classroom-1/enrollments",
      controllerClass: ClassroomsController
    });

    let thrownError: unknown;
    try {
      guard.canActivate(context);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(ForbiddenException);
    expect((thrownError as ForbiddenException).getStatus()).toBe(403);
    expect(authLogger.warn).toHaveBeenCalledWith(
      "auth.guard.role.rejected",
      expect.objectContaining({
        tenantId: alumnoUser.tenantId,
        actorUserId: alumnoUser.sub,
        role: alumnoUser.role,
        resourceId: "/api/classrooms/classroom-1/enrollments"
      })
    );
  });

  it("allows ALUMNO in student classrooms endpoint", () => {
    const guard = new RolesGuard(new Reflector(), authLogger as never);
    const context = createExecutionContext({
      user: alumnoUser,
      method: "GET",
      url: "/api/student/classrooms",
      handler: StudentClassroomsController.prototype.getStudentClassrooms,
      controllerClass: StudentClassroomsController
    });

    const allowed = guard.canActivate(context);

    expect(allowed).toBe(true);
  });

  it("rejects DOCENTE with 403 in student classrooms endpoint", () => {
    const guard = new RolesGuard(new Reflector(), authLogger as never);
    const context = createExecutionContext({
      user: docenteUser,
      method: "GET",
      url: "/api/student/classrooms",
      handler: StudentClassroomsController.prototype.getStudentClassrooms,
      controllerClass: StudentClassroomsController
    });

    let thrownError: unknown;
    try {
      guard.canActivate(context);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(ForbiddenException);
    expect((thrownError as ForbiddenException).getStatus()).toBe(403);
    expect(authLogger.warn).toHaveBeenCalledWith(
      "auth.guard.role.rejected",
      expect.objectContaining({
        tenantId: docenteUser.tenantId,
        actorUserId: docenteUser.sub,
        role: docenteUser.role,
        resourceId: "/api/student/classrooms"
      })
    );
  });

  it("rejects ALUMNO with 403 when creating classroom activity", () => {
    const guard = new RolesGuard(new Reflector(), authLogger as never);
    const context = createExecutionContext({
      user: alumnoUser,
      method: "POST",
      url: "/api/classrooms/classroom-1/activities",
      handler: ClassroomsController.prototype.createClassroomActivity,
      controllerClass: ClassroomsController
    });

    let thrownError: unknown;
    try {
      guard.canActivate(context);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(ForbiddenException);
    expect((thrownError as ForbiddenException).getStatus()).toBe(403);
    expect(authLogger.warn).toHaveBeenCalledWith(
      "auth.guard.role.rejected",
      expect.objectContaining({
        tenantId: alumnoUser.tenantId,
        actorUserId: alumnoUser.sub,
        role: alumnoUser.role,
        resourceId: "/api/classrooms/classroom-1/activities"
      })
    );
  });

  it("allows ALUMNO to list classroom activities", () => {
    const guard = new RolesGuard(new Reflector(), authLogger as never);
    const context = createExecutionContext({
      user: alumnoUser,
      method: "GET",
      url: "/api/classrooms/classroom-1/activities",
      handler: ClassroomsController.prototype.getClassroomActivities,
      controllerClass: ClassroomsController
    });

    const allowed = guard.canActivate(context);

    expect(allowed).toBe(true);
  });

  it("allows ALUMNO to submit activity", () => {
    const guard = new RolesGuard(new Reflector(), authLogger as never);
    const context = createExecutionContext({
      user: alumnoUser,
      method: "POST",
      url: "/api/activities/activity-1/submissions",
      handler: SubmissionsController.prototype.submitActivity,
      controllerClass: SubmissionsController
    });

    const allowed = guard.canActivate(context);

    expect(allowed).toBe(true);
  });

  it("rejects DOCENTE with 403 when submitting as alumno", () => {
    const guard = new RolesGuard(new Reflector(), authLogger as never);
    const context = createExecutionContext({
      user: docenteUser,
      method: "POST",
      url: "/api/activities/activity-1/submissions",
      handler: SubmissionsController.prototype.submitActivity,
      controllerClass: SubmissionsController
    });

    let thrownError: unknown;
    try {
      guard.canActivate(context);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(ForbiddenException);
    expect((thrownError as ForbiddenException).getStatus()).toBe(403);
    expect(authLogger.warn).toHaveBeenCalledWith(
      "auth.guard.role.rejected",
      expect.objectContaining({
        tenantId: docenteUser.tenantId,
        actorUserId: docenteUser.sub,
        role: docenteUser.role,
        resourceId: "/api/activities/activity-1/submissions"
      })
    );
  });

  it("allows DOCENTE to grade submission", () => {
    const guard = new RolesGuard(new Reflector(), authLogger as never);
    const context = createExecutionContext({
      user: docenteUser,
      method: "PATCH",
      url: "/api/submissions/submission-1/grade",
      handler: SubmissionsController.prototype.gradeSubmission,
      controllerClass: SubmissionsController
    });

    const allowed = guard.canActivate(context);

    expect(allowed).toBe(true);
  });

  it("rejects ALUMNO with 403 when grading submission", () => {
    const guard = new RolesGuard(new Reflector(), authLogger as never);
    const context = createExecutionContext({
      user: alumnoUser,
      method: "PATCH",
      url: "/api/submissions/submission-1/grade",
      handler: SubmissionsController.prototype.gradeSubmission,
      controllerClass: SubmissionsController
    });

    let thrownError: unknown;
    try {
      guard.canActivate(context);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(ForbiddenException);
    expect((thrownError as ForbiddenException).getStatus()).toBe(403);
    expect(authLogger.warn).toHaveBeenCalledWith(
      "auth.guard.role.rejected",
      expect.objectContaining({
        tenantId: alumnoUser.tenantId,
        actorUserId: alumnoUser.sub,
        role: alumnoUser.role,
        resourceId: "/api/submissions/submission-1/grade"
      })
    );
  });
});
