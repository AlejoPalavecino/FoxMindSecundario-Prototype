"use client";

import React from "react";
import { useState } from "react";
import type { UserRole } from "@foxmind/shared";
import { getRoleNavigation, isRoleNavItemActive } from "../../lib/role-navigation";

interface RoleSidebarNavProps {
  role: UserRole;
  currentPath?: string;
}

export function RoleSidebarNav({ role, currentPath }: RoleSidebarNavProps) {
  const navigation = getRoleNavigation(role);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const resolvedPath = currentPath ?? (typeof window !== "undefined" ? window.location.pathname : undefined);

  return (
    <nav className="role-nav" aria-label={`Navegación ${role.toLowerCase()}`}>
      <button
        type="button"
        className="role-nav-toggle"
        aria-label="Abrir menú de navegación"
        aria-expanded={isMobileOpen}
        aria-controls="role-nav-list"
        onClick={() => setIsMobileOpen((value) => !value)}
      >
        Menú
      </button>
      <ul id="role-nav-list" data-mobile-open={isMobileOpen}>
        {navigation.items.map((item) => {
          const isActive = isRoleNavItemActive(item.href, resolvedPath);

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
