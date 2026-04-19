import React from "react";
import type { ReactNode } from "react";
import type { UserRole } from "@foxmind/shared";
import { getRoleShellMeta } from "../../lib/role-navigation";
import { RoleSidebarNav } from "./role-sidebar-nav";

interface RoleLayoutShellProps {
  role: UserRole;
  currentPath?: string;
  children: ReactNode;
}

export function RoleLayoutShell({ role, currentPath, children }: RoleLayoutShellProps) {
  const meta = getRoleShellMeta(role);

  return (
    <div className={`role-layout role-layout-${meta.accent}`}>
      <aside>
        <div className="role-branding">
          <strong>FoxMind</strong>
          <p>{meta.title}</p>
        </div>
        <RoleSidebarNav role={role} currentPath={currentPath} />
      </aside>
      <div className="role-content">
        <p className="role-subtitle">{meta.subtitle}</p>
        {children}
      </div>
    </div>
  );
}
