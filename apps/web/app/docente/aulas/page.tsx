import React from "react";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";
import { ShellUiStates } from "../../../components/shared/shell-ui-states";

export default function DocenteAulasPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Aulas"
        subtitle="Organizá cursos, divisiones y recursos en un solo espacio docente."
        actions={<StatusBadge status="ok" />}
      />
      <ShellUiStates
        basePath="/docente/aulas"
        loadingSkeleton="docente-aulas"
        loadingDescription="Cargando aulas y cursos asignados."
        errorDescription="No pudimos obtener la lista de aulas docentes."
        successDescription="Aulas sincronizadas y listas para operar."
        emptyDescription="El shell de Aulas ya está listo para conectar listado de cursos y accesos rápidos en el próximo batch."
      />
    </section>
  );
}
