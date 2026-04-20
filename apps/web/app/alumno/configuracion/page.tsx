import React from "react";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";
import { ShellUiStates } from "../../../components/shared/shell-ui-states";

export default function AlumnoConfiguracionPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Configuración"
        subtitle="Gestioná preferencias de estudio, perfil y notificaciones."
        actions={<StatusBadge status="ok" />}
      />
      <ShellUiStates
        basePath="/alumno/configuracion"
        loadingSkeleton="alumno-configuracion"
        loadingDescription="Cargando tus preferencias de cuenta."
        errorDescription="No pudimos abrir la configuración del alumno."
        successDescription="Configuración disponible para personalizar tu experiencia."
        emptyDescription="La vista de Configuración del alumno está lista para conectar preferencias reales en próximos batches."
      />
    </section>
  );
}
