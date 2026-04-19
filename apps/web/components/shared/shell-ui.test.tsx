import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./empty-state";
import { PageHeader } from "./page-header";
import { ShellUiStates } from "./shell-ui-states";
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
        loadingDescription="Cargando datos"
        errorDescription="No pudimos recuperar la información"
        successDescription="Todo listo"
        emptyDescription="No hay datos"
      />
    );

    expect(html).toContain("Estado: Cargando");
    expect(html).toContain("Estado: Error");
    expect(html).toContain("Estado: Operativo");
    expect(html).toContain("Sin contenido disponible");
  });
});
