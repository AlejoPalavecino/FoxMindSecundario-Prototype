import React from "react";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";
import { ShellUiStates } from "../../../components/shared/shell-ui-states";

export default function DocenteCopilotoPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Copiloto IA"
        subtitle="Prepará actividades y sugerencias pedagógicas con asistencia inteligente."
        actions={<StatusBadge status="warning" />}
      />
      <ShellUiStates
        basePath="/docente/copiloto"
        loadingDescription="Cargando asistencias y sugerencias del copiloto."
        errorDescription="No pudimos conectar con el Copiloto IA."
        successDescription="Copiloto IA operativo para acompañar la planificación."
        emptyDescription="La base del Copiloto IA está habilitada para sumar prompts y recomendaciones en el próximo batch."
      />
    </section>
  );
}
