import React from "react";
import { PageHeader } from "../../components/shared/page-header";
import { StatusBadge } from "../../components/shared/status-badge";
import { ShellUiStates } from "../../components/shared/shell-ui-states";

export default function DocenteShellPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Dashboard Docente"
        subtitle="Vista inicial del shell para preparar modulos del Sprint 1."
        actions={<StatusBadge status="ok" />}
      />
      <ShellUiStates
        basePath="/docente"
        loadingDescription="Cargando resumen del panel docente."
        errorDescription="No pudimos cargar el panel docente en este momento."
        successDescription="Dashboard docente operativo para integrar modulos del sprint."
        emptyDescription="Este espacio quedo listo para incorporar aulas, agenda y progreso en el siguiente batch."
      />
    </section>
  );
}
