import React from "react";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";
import { ShellUiStates } from "../../../components/shared/shell-ui-states";

export default function AlumnoProgresoPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Mi Progreso"
        subtitle="Revisá tu avance, logros y objetivos pendientes de la cursada."
        actions={<StatusBadge status="ok" />}
      />
      <ShellUiStates
        basePath="/alumno/progreso"
        loadingSkeleton="alumno-progreso"
        loadingDescription="Cargando métricas de avance individual."
        errorDescription="No pudimos actualizar tu progreso."
        successDescription="Tus métricas están disponibles para seguimiento continuo."
        emptyDescription="La sección de Mi Progreso quedó preparada para mostrar indicadores y evolución por materia."
      />
    </section>
  );
}
