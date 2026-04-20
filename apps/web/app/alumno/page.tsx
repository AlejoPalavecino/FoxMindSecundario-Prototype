import React from "react";
import { DataTable } from "../../components/shared/data-table";
import { PageHeader } from "../../components/shared/page-header";
import { QuickActions } from "../../components/shared/quick-actions";
import { StatusBadge } from "../../components/shared/status-badge";
import { StatCard } from "../../components/shared/stat-card";
import { ShellUiStates } from "../../components/shared/shell-ui-states";
import { getDashboardQuickActions } from "../../lib/role-navigation";

export default function AlumnoShellPage() {
  return (
    <section className="role-shell-content">
      <PageHeader
        title="Dashboard Alumno"
        subtitle="Vista inicial del shell para preparar aulas, EstudIA y progreso."
        actions={<StatusBadge status="warning" />}
      />
      <section className="stats-grid" aria-label="Resumen rápido alumno">
        <StatCard
          title="Racha de estudio"
          value="5 días"
          description="Constancia semanal"
          tone="success"
        />
        <StatCard
          title="Pendientes"
          value="2"
          description="Actividades por entregar"
          tone="warning"
        />
      </section>
      <QuickActions items={getDashboardQuickActions("ALUMNO")} />
      <DataTable
        caption="Próximas actividades"
        columns={[
          { key: "materia", header: "Materia" },
          { key: "actividad", header: "Actividad" },
          { key: "vence", header: "Vence" }
        ]}
        rows={[
          { id: "a-1", materia: "Lengua", actividad: "Foro argumentativo", vence: "Mar 18:00" },
          { id: "a-2", materia: "Biología", actividad: "Cuestionario células", vence: "Jue 21:00" }
        ]}
      />
      <ShellUiStates
        basePath="/alumno"
        loadingSkeleton="alumno-dashboard"
        loadingDescription="Cargando resumen de cursada y próximos objetivos."
        errorDescription="No pudimos recuperar la vista principal del alumno."
        successDescription="Panel alumno operativo para seguimiento diario."
        emptyDescription="Esta base queda preparada para sumar modulos del alumno en el siguiente batch."
      />
    </section>
  );
}
