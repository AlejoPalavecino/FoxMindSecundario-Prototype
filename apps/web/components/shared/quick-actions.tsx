import React from "react";
import type { RoleNavigationItem } from "../../lib/role-navigation";

interface QuickActionsProps {
  title?: string;
  items: RoleNavigationItem[];
}

export function QuickActions({ title = "Atajos rápidos", items }: QuickActionsProps) {
  return (
    <section className="quick-actions" aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.key}>
            <a href={item.href}>{`Ir a ${item.label}`}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
