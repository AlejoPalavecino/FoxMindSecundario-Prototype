import React from "react";
import { EmptyState } from "../../../components/shared/empty-state";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";

export default function DocenteProgresoPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Progreso"
        subtitle="Seguí avances de estudiantes y cohortes con foco en métricas clave."
        actions={<StatusBadge status="ok" />}
      />
      <EmptyState
        title="Sin contenido disponible"
        description="El shell de Progreso está listo para integrar indicadores y evolución por aula."
        action={{ href: "/docente/progreso", label: "Actualizar progreso" }}
      />
    </section>
  );
}
