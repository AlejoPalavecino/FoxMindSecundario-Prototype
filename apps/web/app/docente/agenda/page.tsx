import React from "react";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";
import { ShellUiStates } from "../../../components/shared/shell-ui-states";

export default function DocenteAgendaPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Agenda"
        subtitle="Visualizá clases, eventos y recordatorios clave del ciclo lectivo."
        actions={<StatusBadge status="warning" />}
      />
      <ShellUiStates
        basePath="/docente/agenda"
        loadingDescription="Cargando agenda de clases y eventos."
        errorDescription="No pudimos actualizar la agenda docente."
        successDescription="Agenda disponible para gestionar el calendario académico."
        emptyDescription="La vista de Agenda quedó preparada para incorporar calendario y planificación docente."
      />
    </section>
  );
}
