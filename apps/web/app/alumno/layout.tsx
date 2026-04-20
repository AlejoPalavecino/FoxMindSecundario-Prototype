import React from "react";
import type { ReactNode } from "react";
import { RoleLayoutShell } from "../../components/roles/role-layout-shell";

export default function AlumnoLayout({ children }: { children: ReactNode }) {
  return <RoleLayoutShell role="ALUMNO">{children}</RoleLayoutShell>;
}
