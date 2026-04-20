import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { UserRole } from "@foxmind/shared";
import { ROLES_KEY } from "../auth.constants";
import { AuthLogger } from "../auth.logger";
import type { JwtPayload } from "../interfaces/jwt-payload.interface";

type RequestWithUser = { method?: string; url?: string; user?: JwtPayload };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authLogger: AuthLogger
  ) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userRole = request.user?.role;
    if (!userRole || !requiredRoles.includes(userRole)) {
      this.authLogger.warn("auth.guard.role.rejected", {
        tenantId: request.user?.tenantId ?? "unknown",
        actorUserId: request.user?.sub ?? "anonymous",
        role: request.user?.role ?? "unknown",
        resourceId: request.url ?? "unknown",
        timestamp: new Date().toISOString(),
        method: request.method,
        path: request.url,
        userRole,
        requiredRoles
      });
      throw new ForbiddenException("No tenés permisos para acceder");
    }
    return true;
  }
}
