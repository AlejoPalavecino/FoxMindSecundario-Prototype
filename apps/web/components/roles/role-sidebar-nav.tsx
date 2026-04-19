import React from "react";
import type { UserRole } from "@foxmind/shared";
import { getRoleNavigation } from "../../lib/role-navigation";

interface RoleSidebarNavProps {
  role: UserRole;
  currentPath?: string;
}

export function RoleSidebarNav({ role, currentPath }: RoleSidebarNavProps) {
  const navigation = getRoleNavigation(role);

  return (
    <nav className="role-nav" aria-label={`Navegación ${role.toLowerCase()}`}>
      <ul>
        {navigation.items.map((item) => {
          const isActive = item.href === currentPath;

          return (
            <li key={item.key}>
              {item.enabled ? (
                <a className={isActive ? "is-active" : undefined} href={item.href} aria-current={isActive ? "page" : undefined}>
                  {item.label}
                </a>
              ) : (
                <span className="is-disabled" aria-disabled="true">
                  {item.label} <small>Próximamente</small>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
