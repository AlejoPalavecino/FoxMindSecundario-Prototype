import type { UserRole } from "@foxmind/shared";

export type RoleNavigationKey =
  | "dashboard"
  | "aulas"
  | "agenda"
  | "progreso"
  | "copiloto"
  | "configuracion"
  | "estudia"
  | "mi-progreso";

export interface RoleNavigationItem {
  key: RoleNavigationKey;
  label: string;
  href: string;
  enabled: boolean;
}

export interface RoleNavigation {
  role: UserRole;
  items: RoleNavigationItem[];
}

export interface RoleShellMeta {
  role: UserRole;
  title: string;
  subtitle: string;
  accent: "docente" | "alumno";
}

const DOCENTE_ITEMS: RoleNavigationItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/docente", enabled: true },
  { key: "aulas", label: "Aulas", href: "/docente/aulas", enabled: true },
  { key: "agenda", label: "Agenda", href: "/docente/agenda", enabled: true },
  { key: "progreso", label: "Progreso", href: "/docente/progreso", enabled: true },
  { key: "copiloto", label: "Copiloto IA", href: "/docente/copiloto", enabled: true },
  { key: "configuracion", label: "Configuración", href: "/docente/configuracion", enabled: true }
];

const ALUMNO_ITEMS: RoleNavigationItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/alumno", enabled: true },
  { key: "aulas", label: "Aulas", href: "/alumno/aulas", enabled: false },
  { key: "estudia", label: "EstudIA", href: "/alumno/estudia", enabled: false },
  { key: "mi-progreso", label: "Mi Progreso", href: "/alumno/progreso", enabled: false },
  { key: "configuracion", label: "Configuración", href: "/alumno/configuracion", enabled: false }
];

const ROLE_META: Record<UserRole, RoleShellMeta> = {
  DOCENTE: {
    role: "DOCENTE",
    title: "Panel Docente",
    subtitle: "Gestioná aulas, agenda y progreso desde un solo lugar.",
    accent: "docente"
  },
  ALUMNO: {
    role: "ALUMNO",
    title: "Panel Alumno",
    subtitle: "Seguí tus aulas, estudiá y revisá tu avance.",
    accent: "alumno"
  }
};

export function getRoleNavigation(role: UserRole): RoleNavigation {
  return {
    role,
    items: role === "DOCENTE" ? DOCENTE_ITEMS : ALUMNO_ITEMS
  };
}

export function getRoleShellMeta(role: UserRole): RoleShellMeta {
  return ROLE_META[role];
}

export function getDefaultPathByRole(role: UserRole) {
  return role === "DOCENTE" ? "/docente" : "/alumno";
}
