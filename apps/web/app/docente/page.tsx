import React from "react";
import { EmptyState } from "../../components/shared/empty-state";
import { PageHeader } from "../../components/shared/page-header";
import { StatusBadge } from "../../components/shared/status-badge";

export default function DocenteShellPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Dashboard Docente"
        subtitle="Vista inicial del shell para preparar modulos del Sprint 1."
        actions={<StatusBadge status="ok" />}
      />
      <EmptyState
        title="Sin contenido disponible"
        description="Este espacio quedo listo para incorporar aulas, agenda y progreso en el siguiente batch."
        action={{ href: "/docente", label: "Recargar shell" }}
      />
    </section>
  );
}
