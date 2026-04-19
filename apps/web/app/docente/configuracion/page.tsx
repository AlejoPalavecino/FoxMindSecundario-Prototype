import React from "react";
import { EmptyState } from "../../../components/shared/empty-state";
import { PageHeader } from "../../../components/shared/page-header";
import { StatusBadge } from "../../../components/shared/status-badge";

export default function DocenteConfiguracionPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Configuración"
        subtitle="Ajustá preferencias de cuenta, notificaciones y parámetros de trabajo docente."
        actions={<StatusBadge status="ok" />}
      />
      <EmptyState
        title="Sin contenido disponible"
        description="La sección de Configuración quedó preparada para incorporar opciones personalizadas por docente."
        action={{ href: "/docente/configuracion", label: "Abrir configuración" }}
      />
    </section>
  );
}
