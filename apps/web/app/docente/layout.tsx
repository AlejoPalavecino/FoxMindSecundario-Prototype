import React from "react";
import type { ReactNode } from "react";
import { RoleLayoutShell } from "../../components/roles/role-layout-shell";

export default function DocenteLayout({ children }: { children: ReactNode }) {
  return (
    <RoleLayoutShell role="DOCENTE" currentPath="/docente">
      {children}
    </RoleLayoutShell>
  );
}
