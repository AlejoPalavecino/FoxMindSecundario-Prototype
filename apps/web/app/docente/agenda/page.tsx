import React from "react";
import { EmptyState } from "../../../components/shared/empty-state";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";

export default function DocenteAgendaPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Agenda"
        subtitle="Visualizá clases, eventos y recordatorios clave del ciclo lectivo."
        actions={<StatusBadge status="warning" />}
      />
      <EmptyState
        title="Sin contenido disponible"
        description="La vista de Agenda quedó preparada para incorporar calendario y planificación docente."
        action={{ href: "/docente/agenda", label: "Actualizar agenda" }}
      />
    </section>
  );
}
