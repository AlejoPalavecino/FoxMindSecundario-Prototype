export type UserRole = "DOCENTE" | "ALUMNO";

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthSession {
  user: SessionUser;
  tokens: AuthTokens;
}
