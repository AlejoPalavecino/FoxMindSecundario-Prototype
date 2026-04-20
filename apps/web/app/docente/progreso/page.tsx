import React from "react";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";
import { ShellUiStates } from "../../../components/shared/shell-ui-states";

export default function DocenteProgresoPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Progreso"
        subtitle="Seguí avances de estudiantes y cohortes con foco en métricas clave."
        actions={<StatusBadge status="ok" />}
      />
      <ShellUiStates
        basePath="/docente/progreso"
        loadingSkeleton="docente-progreso"
        loadingDescription="Cargando métricas de avance por aula."
        errorDescription="No pudimos recuperar los indicadores de progreso."
        successDescription="Indicadores de progreso listos para análisis docente."
        emptyDescription="El shell de Progreso está listo para integrar indicadores y evolución por aula."
      />
    </section>
  );
}
