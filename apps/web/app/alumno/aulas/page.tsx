import React from "react";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";
import { ShellUiStates } from "../../../components/shared/shell-ui-states";

export default function AlumnoAulasPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Aulas"
        subtitle="Accedé a tus materias, materiales y actividades en curso."
        actions={<StatusBadge status="ok" />}
      />
      <ShellUiStates
        basePath="/alumno/aulas"
        loadingSkeleton="alumno-aulas"
        loadingDescription="Cargando aulas y contenidos disponibles."
        errorDescription="No pudimos cargar tus aulas en este momento."
        successDescription="Aulas del alumno disponibles para continuar la cursada."
        emptyDescription="La vista de Aulas del alumno queda lista para integrar materias y recursos en los siguientes batches."
      />
    </section>
  );
}
