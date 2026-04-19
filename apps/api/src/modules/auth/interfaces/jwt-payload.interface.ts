import type { UserRole } from "@foxmind/shared";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  tenantId: string;
}
