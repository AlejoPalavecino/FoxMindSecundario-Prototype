import React from "react";
import { EmptyState } from "../../../components/shared/empty-state";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";

export default function DocenteCopilotoPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Copiloto IA"
        subtitle="Prepará actividades y sugerencias pedagógicas con asistencia inteligente."
        actions={<StatusBadge status="warning" />}
      />
      <EmptyState
        title="Sin contenido disponible"
        description="La base del Copiloto IA está habilitada para sumar prompts y recomendaciones en el próximo batch."
        action={{ href: "/docente/copiloto", label: "Abrir copiloto" }}
      />
    </section>
  );
}
