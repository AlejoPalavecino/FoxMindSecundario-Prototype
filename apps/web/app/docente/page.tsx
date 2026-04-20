import React from "react";
import { DataTable } from "../../components/shared/data-table";
import { PageHeader } from "../../components/shared/page-header";
import { QuickActions } from "../../components/shared/quick-actions";
import { StatusBadge } from "../../components/shared/status-badge";
import { StatCard } from "../../components/shared/stat-card";
import { ShellUiStates } from "../../components/shared/shell-ui-states";
import { getDashboardQuickActions } from "../../lib/role-navigation";

export default function DocenteShellPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Dashboard Docente"
        subtitle="Vista inicial del shell para preparar modulos del Sprint 1."
        actions={<StatusBadge status="ok" />}
      />
      <section className="stats-grid" aria-label="Resumen rápido docente">
        <StatCard
          title="Asistencia promedio"
          value="94%"
          description="Últimos 7 días"
          tone="success"
        />
        <StatCard
          title="Alertas pedagógicas"
          value="3"
          description="Requieren seguimiento"
          tone="warning"
        />
      </section>
      <QuickActions items={getDashboardQuickActions("DOCENTE")} />
      <DataTable
        caption="Próximos hitos del curso"
        columns={[
          { key: "curso", header: "Curso" },
          { key: "hito", header: "Hito" },
          { key: "fecha", header: "Fecha" }
        ]}
        rows={[
          { id: "d-1", curso: "Matemática 3A", hito: "Entrega TP 4", fecha: "Lun 10:30" },
          { id: "d-2", curso: "Historia 2B", hito: "Repaso parcial", fecha: "Mié 08:00" }
        ]}
      />
      <ShellUiStates
        basePath="/docente"
        loadingSkeleton="docente-dashboard"
        loadingDescription="Cargando resumen del panel docente."
        errorDescription="No pudimos cargar el panel docente en este momento."
        successDescription="Dashboard docente operativo para integrar modulos del sprint."
        emptyDescription="Este espacio quedo listo para incorporar aulas, agenda y progreso en el siguiente batch."
      />
    </section>
  );
}
