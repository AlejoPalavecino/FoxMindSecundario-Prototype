export type UserRole = "DOCENTE" | "ALUMNO";

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  tenantId: string;
}
