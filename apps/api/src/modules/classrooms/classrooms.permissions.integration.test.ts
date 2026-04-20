import { ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { describe, expect, it, vi } from "vitest";
import { RolesGuard } from "../auth/guards/roles.guard";
import type { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import { ClassroomsController } from "./classrooms.controller";

type MockExecutionContextInput = {
  user?: JwtPayload;
  method?: string;
  url?: string;
  handler: (...args: any[]) => unknown;
};

function createExecutionContext(input: MockExecutionContextInput) {
  const request = {
    method: input.method ?? "POST",
    url: input.url ?? "/api/classrooms",
    user: input.user
  };

  return {
    getHandler: () => input.handler,
    getClass: () => ClassroomsController,
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
      handler: ClassroomsController.prototype.createClassroom
    });

    const allowed = guard.canActivate(context);

    expect(allowed).toBe(true);
  });

  it("rejects ALUMNO with 403 in classroom endpoints", () => {
    const guard = new RolesGuard(new Reflector(), authLogger as never);
    const context = createExecutionContext({
      user: alumnoUser,
      handler: ClassroomsController.prototype.createEnrollment,
      url: "/api/classrooms/classroom-1/enrollments"
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
});
