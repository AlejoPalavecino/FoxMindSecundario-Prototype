import React from "react";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";
import { ShellUiStates } from "../../../components/shared/shell-ui-states";

export default function AlumnoEstudiaPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="EstudIA"
        subtitle="Explorá recomendaciones y sesiones guiadas para estudiar mejor."
        actions={<StatusBadge status="warning" />}
      />
      <ShellUiStates
        basePath="/alumno/estudia"
        loadingDescription="Cargando sugerencias de estudio personalizadas."
        errorDescription="No pudimos recuperar las recomendaciones de EstudIA."
        successDescription="EstudIA operativo para ayudarte con tu plan de estudio."
        emptyDescription="El shell de EstudIA está preparado para integrar asistentes y rutas de práctica adaptativas."
      />
    </section>
  );
}
