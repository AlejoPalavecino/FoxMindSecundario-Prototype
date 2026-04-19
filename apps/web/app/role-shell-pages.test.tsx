import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AlumnoShellPage from "./alumno/page";
import DocenteShellPage from "./docente/page";

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
});
