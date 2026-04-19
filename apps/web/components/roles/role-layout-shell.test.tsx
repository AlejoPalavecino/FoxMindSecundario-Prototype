import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RoleLayoutShell } from "./role-layout-shell";
import { RoleSidebarNav } from "./role-sidebar-nav";

describe("role layout shell", () => {
  it("renders docente navigation with all required section routes enabled", () => {
    const html = renderToStaticMarkup(<RoleSidebarNav role="DOCENTE" currentPath="/docente" />);

    expect(html).toContain("Dashboard");
    expect(html).toContain("href=\"/docente\"");
    expect(html).toContain("Aulas");
    expect(html).toContain("href=\"/docente/aulas\"");
    expect(html).toContain("href=\"/docente/agenda\"");
    expect(html).toContain("href=\"/docente/progreso\"");
    expect(html).toContain("href=\"/docente/copiloto\"");
    expect(html).toContain("href=\"/docente/configuracion\"");
    expect(html).not.toContain("Próximamente");
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
