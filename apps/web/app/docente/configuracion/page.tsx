import React from "react";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";
import { ShellUiStates } from "../../../components/shared/shell-ui-states";

export default function DocenteConfiguracionPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Configuración"
        subtitle="Ajustá preferencias de cuenta, notificaciones y parámetros de trabajo docente."
        actions={<StatusBadge status="ok" />}
      />
      <ShellUiStates
        basePath="/docente/configuracion"
        loadingDescription="Cargando preferencias y parámetros docentes."
        errorDescription="No pudimos cargar la configuración docente."
        successDescription="Configuración disponible para personalizar tu entorno docente."
        emptyDescription="La sección de Configuración quedó preparada para incorporar opciones personalizadas por docente."
      />
    </section>
  );
}
