import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./empty-state";
import { DataTable } from "./data-table";
import { ModuleSkeleton } from "./module-skeleton";
import { PageHeader } from "./page-header";
import { ShellUiStates } from "./shell-ui-states";
import { StatCard } from "./stat-card";
import { StatusBadge, resolveStatusBadge } from "./status-badge";

describe("shared shell ui", () => {
  it("renders page header with title, subtitle and actions", () => {
    const html = renderToStaticMarkup(
      <PageHeader
        title="Dashboard"
        subtitle="Resumen general"
        actions={<a href="/docente">Actualizar</a>}
      />
    );

    expect(html).toContain("Dashboard");
    expect(html).toContain("Resumen general");
    expect(html).toContain("Actualizar");
  });

  it("renders empty state with optional action", () => {
    const html = renderToStaticMarkup(
      <EmptyState
        title="Sin datos"
        description="Todavía no hay datos para mostrar"
        action={{ href: "/docente", label: "Reintentar" }}
      />
    );

    expect(html).toContain("Sin datos");
    expect(html).toContain("Todavía no hay datos para mostrar");
    expect(html).toContain("Reintentar");
  });

  it("maps status tokens to human labels", () => {
    expect(resolveStatusBadge("ok")).toEqual({ label: "Operativo", tone: "success" });
    expect(resolveStatusBadge("warning")).toEqual({ label: "Atención", tone: "warning" });
    expect(resolveStatusBadge("blocked")).toEqual({ label: "Bloqueado", tone: "danger" });
  });

  it("renders status badge with aria label", () => {
    const html = renderToStaticMarkup(<StatusBadge status="warning" />);

    expect(html).toContain("Atención");
    expect(html).toContain("Estado: Atención");
  });

  it("renders reusable ui states contract", () => {
    const html = renderToStaticMarkup(
      <ShellUiStates
        basePath="/docente"
        loadingSkeleton="docente-dashboard"
        loadingDescription="Cargando datos"
        errorDescription="No pudimos recuperar la información"
        successDescription="Todo listo"
        emptyDescription="No hay datos"
      />
    );

    expect(html).toContain("Estado: Cargando");
    expect(html).toContain("aria-label=\"Skeleton dashboard docente\"");
    expect(html).toContain("Estado: Error");
    expect(html).toContain("Estado: Operativo");
    expect(html).toContain("Sin contenido disponible");
  });

  it("renders module skeleton variants with stable contract", () => {
    const html = renderToStaticMarkup(<ModuleSkeleton moduleKey="alumno-estudia" />);

    expect(html).toContain("aria-label=\"Skeleton EstudIA alumno\"");
    expect(html).toContain("skeleton-block");
    expect(html).toContain("skeleton-block-title");
    expect(html).toContain("skeleton-block-row");
  });

  it("renders stat card with value and helper description", () => {
    const html = renderToStaticMarkup(
      <StatCard
        title="Asistencia promedio"
        value="94%"
        description="Promedio semanal"
        tone="success"
      />
    );

    expect(html).toContain("Asistencia promedio");
    expect(html).toContain("94%");
    expect(html).toContain("Promedio semanal");
    expect(html).toContain("aria-label=\"Métrica: Asistencia promedio\"");
  });

  it("renders stat card without optional description", () => {
    const html = renderToStaticMarkup(<StatCard title="Pendientes" value="2" />);

    expect(html).toContain("Pendientes");
    expect(html).toContain("2");
    expect(html).not.toContain("stat-card-description");
  });

  it("renders data table with headers and rows", () => {
    const html = renderToStaticMarkup(
      <DataTable
        caption="Próximas entregas"
        columns={[
          { key: "curso", header: "Curso" },
          { key: "fecha", header: "Fecha" }
        ]}
        rows={[
          { id: "1", curso: "Matemática 3A", fecha: "Lunes" },
          { id: "2", curso: "Historia 2B", fecha: "Miércoles" }
        ]}
      />
    );

    expect(html).toContain("Próximas entregas");
    expect(html).toContain("Curso");
    expect(html).toContain("Fecha");
    expect(html).toContain("Matemática 3A");
    expect(html).toContain("Historia 2B");
  });

  it("renders data table empty fallback when there are no rows", () => {
    const html = renderToStaticMarkup(
      <DataTable
        caption="Próximas entregas"
        columns={[
          { key: "curso", header: "Curso" },
          { key: "fecha", header: "Fecha" }
        ]}
        rows={[]}
        emptyMessage="Sin pendientes"
      />
    );

    expect(html).toContain("Sin pendientes");
    expect(html).toContain("aria-live=\"polite\"");
  });
});
