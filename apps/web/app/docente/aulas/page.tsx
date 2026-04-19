import React from "react";
import { EmptyState } from "../../../components/shared/empty-state";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";

export default function DocenteAulasPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Aulas"
        subtitle="Organizá cursos, divisiones y recursos en un solo espacio docente."
        actions={<StatusBadge status="ok" />}
      />
      <EmptyState
        title="Sin contenido disponible"
        description="El shell de Aulas ya está listo para conectar listado de cursos y accesos rápidos en el próximo batch."
        action={{ href: "/docente/aulas", label: "Actualizar aulas" }}
      />
    </section>
  );
}
