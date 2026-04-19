import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RoleLayoutShell } from "./role-layout-shell";
import { RoleSidebarNav } from "./role-sidebar-nav";

describe("role layout shell", () => {
  it("renders enabled and upcoming navigation items by role", () => {
    const html = renderToStaticMarkup(<RoleSidebarNav role="DOCENTE" currentPath="/docente" />);

    expect(html).toContain("Dashboard");
    expect(html).toContain("href=\"/docente\"");
    expect(html).toContain("Aulas");
    expect(html).toContain("Próximamente");
  });

  it("renders role layout shell with provided content", () => {
    const html = renderToStaticMarkup(
      <RoleLayoutShell role="ALUMNO" currentPath="/alumno">
        <div>Contenido alumno</div>
      </RoleLayoutShell>
    );

    expect(html).toContain("Panel Alumno");
    expect(html).toContain("Contenido alumno");
  });
});
