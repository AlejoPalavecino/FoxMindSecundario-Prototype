import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AlumnoAulasPage from "./alumno/aulas/page";
import AlumnoConfiguracionPage from "./alumno/configuracion/page";
import AlumnoEstudiaPage from "./alumno/estudia/page";
import AlumnoShellPage from "./alumno/page";
import AlumnoProgresoPage from "./alumno/progreso/page";
import DocenteAgendaPage from "./docente/agenda/page";
import DocenteAulasPage from "./docente/aulas/page";
import DocenteConfiguracionPage from "./docente/configuracion/page";
import DocenteCopilotoPage from "./docente/copiloto/page";
import DocenteShellPage from "./docente/page";
import DocenteProgresoPage from "./docente/progreso/page";

function expectStatesContract(html: string) {
  expect(html).toContain("Estado: Cargando");
  expect(html).toContain("Estado: Error");
  expect(html).toContain("Estado: Operativo");
  expect(html).toContain("Sin contenido disponible");
}

describe("role shell pages", () => {
  it("renders docente shell with shared base components", () => {
    const html = renderToStaticMarkup(<DocenteShellPage />);

    expect(html).toContain("Dashboard Docente");
    expectStatesContract(html);
  });

  it("renders alumno shell with shared base components", () => {
    const html = renderToStaticMarkup(<AlumnoShellPage />);

    expect(html).toContain("Dashboard Alumno");
    expectStatesContract(html);
  });

  it("renders docente aulas shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteAulasPage />);

    expect(html).toContain("Aulas");
    expectStatesContract(html);
  });

  it("renders docente agenda shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteAgendaPage />);

    expect(html).toContain("Agenda");
    expectStatesContract(html);
  });

  it("renders docente progreso shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteProgresoPage />);

    expect(html).toContain("Progreso");
    expectStatesContract(html);
  });

  it("renders docente copiloto shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteCopilotoPage />);

    expect(html).toContain("Copiloto IA");
    expectStatesContract(html);
  });

  it("renders docente configuracion shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteConfiguracionPage />);

    expect(html).toContain("Configuración");
    expectStatesContract(html);
  });

  it("renders alumno aulas shell page with shared components", () => {
    const html = renderToStaticMarkup(<AlumnoAulasPage />);

    expect(html).toContain("Aulas");
    expectStatesContract(html);
  });

  it("renders alumno EstudIA shell page with shared components", () => {
    const html = renderToStaticMarkup(<AlumnoEstudiaPage />);

    expect(html).toContain("EstudIA");
    expectStatesContract(html);
  });

  it("renders alumno progreso shell page with shared components", () => {
    const html = renderToStaticMarkup(<AlumnoProgresoPage />);

    expect(html).toContain("Mi Progreso");
    expectStatesContract(html);
  });

  it("renders alumno configuracion shell page with shared components", () => {
    const html = renderToStaticMarkup(<AlumnoConfiguracionPage />);

    expect(html).toContain("Configuración");
    expectStatesContract(html);
  });
});
