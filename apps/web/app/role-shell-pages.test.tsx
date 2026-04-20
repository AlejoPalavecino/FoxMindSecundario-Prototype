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

function expectStatesContract(html: string, skeletonLabel: string) {
  expect(html).toContain("Estado: Cargando");
  expect(html).toContain(`Skeleton ${skeletonLabel}`);
  expect(html).toContain("Estado: Error");
  expect(html).toContain("Estado: Operativo");
  expect(html).toContain("Sin contenido disponible");
}

describe("role shell pages", () => {
  it("renders docente shell with shared base components", () => {
    const html = renderToStaticMarkup(<DocenteShellPage />);

    expect(html).toContain("Dashboard Docente");
    expect(html).toContain("Asistencia promedio");
    expect(html).toContain("Próximos hitos del curso");
    expect(html).toContain("Atajos rápidos");
    expect(html).toContain("Ir a Aulas");
    expect(html).toContain("href=\"/docente/aulas\"");
    expect(html).toContain("Ir a Agenda");
    expect(html).toContain("href=\"/docente/agenda\"");
    expect(html).toContain("Ir a Progreso");
    expect(html).toContain("href=\"/docente/progreso\"");
    expectStatesContract(html, "dashboard docente");
  });

  it("renders alumno shell with shared base components", () => {
    const html = renderToStaticMarkup(<AlumnoShellPage />);

    expect(html).toContain("Dashboard Alumno");
    expect(html).toContain("Racha de estudio");
    expect(html).toContain("Próximas actividades");
    expect(html).toContain("Atajos rápidos");
    expect(html).toContain("Ir a Aulas");
    expect(html).toContain("href=\"/alumno/aulas\"");
    expect(html).toContain("Ir a EstudIA");
    expect(html).toContain("href=\"/alumno/estudia\"");
    expect(html).toContain("Ir a Mi Progreso");
    expect(html).toContain("href=\"/alumno/progreso\"");
    expectStatesContract(html, "dashboard alumno");
  });

  it("renders docente aulas shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteAulasPage />);

    expect(html).toContain("Aulas");
    expect(html).toContain("Crear aula");
    expect(html).toContain("Editar aula");
    expect(html).toContain("Alta manual de alumno");
    expect(html).toContain("Seleccioná o creá un aula antes de registrar alumnos.");
    expect(html).toContain("Listado de aulas docente");
    expect(html).toContain("Estado: Cargando");
  });

  it("renders docente agenda shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteAgendaPage />);

    expect(html).toContain("Agenda");
    expectStatesContract(html, "agenda docente");
  });

  it("renders docente progreso shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteProgresoPage />);

    expect(html).toContain("Progreso");
    expectStatesContract(html, "progreso docente");
  });

  it("renders docente copiloto shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteCopilotoPage />);

    expect(html).toContain("Copiloto IA");
    expectStatesContract(html, "copiloto docente");
  });

  it("renders docente configuracion shell page with shared components", () => {
    const html = renderToStaticMarkup(<DocenteConfiguracionPage />);

    expect(html).toContain("Configuración");
    expectStatesContract(html, "configuración docente");
  });

  it("renders alumno aulas shell page with shared components", () => {
    const html = renderToStaticMarkup(<AlumnoAulasPage />);

    expect(html).toContain("Aulas");
    expect(html).toContain("Estado: Cargando");
    expect(html).toContain("Cargando aulas y contenidos disponibles.");
  });

  it("renders alumno EstudIA shell page with shared components", () => {
    const html = renderToStaticMarkup(<AlumnoEstudiaPage />);

    expect(html).toContain("EstudIA");
    expectStatesContract(html, "EstudIA alumno");
  });

  it("renders alumno progreso shell page with shared components", () => {
    const html = renderToStaticMarkup(<AlumnoProgresoPage />);

    expect(html).toContain("Mi Progreso");
    expectStatesContract(html, "progreso alumno");
  });

  it("renders alumno configuracion shell page with shared components", () => {
    const html = renderToStaticMarkup(<AlumnoConfiguracionPage />);

    expect(html).toContain("Configuración");
    expectStatesContract(html, "configuración alumno");
  });
});
