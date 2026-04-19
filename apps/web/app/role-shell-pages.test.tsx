import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AlumnoShellPage from "./alumno/page";
import DocenteAgendaPage from "./docente/agenda/page";
import DocenteAulasPage from "./docente/aulas/page";
import DocenteConfiguracionPage from "./docente/configuracion/page";
import DocenteCopilotoPage from "./docente/copiloto/page";
import DocenteShellPage from "./docente/page";
import DocenteProgresoPage from "./docente/progreso/page";

describe("role shell pages", () => {
  it("renders docente shell with shared base components", () => {
    const html = renderToStaticMarkup(<DocenteShellPage />);

    expect(html).toContain("Dashboard Docente");
    expect(html).toContain("Operativo");
    expect(html).toContain("Sin contenido disponible");
  });

  it("renders alumno shell with shared base components", () => {
    const html = renderToStaticMarkup(<AlumnoShellPage />);

    expect(html).toContain("Dashboard Alumno");
    expect(html).toContain("Atención");
    expect(html).toContain("Sin contenido disponible");
  });

  it("renders docente aulas shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteAulasPage />);

    expect(html).toContain("Aulas");
    expect(html).toContain("Estado:");
    expect(html).toContain("Sin contenido disponible");
  });

  it("renders docente agenda shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteAgendaPage />);

    expect(html).toContain("Agenda");
    expect(html).toContain("Estado:");
    expect(html).toContain("Sin contenido disponible");
  });

  it("renders docente progreso shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteProgresoPage />);

    expect(html).toContain("Progreso");
    expect(html).toContain("Estado:");
    expect(html).toContain("Sin contenido disponible");
  });

  it("renders docente copiloto shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteCopilotoPage />);

    expect(html).toContain("Copiloto IA");
    expect(html).toContain("Estado:");
    expect(html).toContain("Sin contenido disponible");
  });

  it("renders docente configuracion shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteConfiguracionPage />);

    expect(html).toContain("Configuración");
    expect(html).toContain("Estado:");
    expect(html).toContain("Sin contenido disponible");
  });
});
