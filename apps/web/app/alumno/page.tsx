import React from "react";
import { PageHeader } from "../../components/shared/page-header";
import { StatusBadge } from "../../components/shared/status-badge";
import { ShellUiStates } from "../../components/shared/shell-ui-states";

export default function AlumnoShellPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Dashboard Alumno"
        subtitle="Vista inicial del shell para preparar aulas, EstudIA y progreso."
        actions={<StatusBadge status="warning" />}
      />
      <ShellUiStates
        basePath="/alumno"
        loadingDescription="Cargando resumen de cursada y próximos objetivos."
        errorDescription="No pudimos recuperar la vista principal del alumno."
        successDescription="Panel alumno operativo para seguimiento diario."
        emptyDescription="Esta base queda preparada para sumar modulos del alumno en el siguiente batch."
      />
    </section>
  );
}
