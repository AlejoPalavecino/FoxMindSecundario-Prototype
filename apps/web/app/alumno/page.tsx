import React from "react";
import { EmptyState } from "../../components/shared/empty-state";
import { PageHeader } from "../../components/shared/page-header";
import { StatusBadge } from "../../components/shared/status-badge";

export default function AlumnoShellPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Dashboard Alumno"
        subtitle="Vista inicial del shell para preparar aulas, EstudIA y progreso."
        actions={<StatusBadge status="warning" />}
      />
      <EmptyState
        title="Sin contenido disponible"
        description="Esta base queda preparada para sumar modulos del alumno en el siguiente batch."
        action={{ href: "/alumno", label: "Recargar shell" }}
      />
    </section>
  );
}
