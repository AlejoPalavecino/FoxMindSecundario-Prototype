import React from "react";
import { DataTable } from "../../../components/shared/data-table";
import { EmptyState } from "../../../components/shared/empty-state";
import { getAllModuleSkeletonKeys, ModuleSkeleton } from "../../../components/shared/module-skeleton";
import { PageHeader } from "../../../components/shared/page-header";
import { StatCard } from "../../../components/shared/stat-card";
import { StatusBadge } from "../../../components/shared/status-badge";

export default function InternalComponentsShowcasePage() {
  const skeletonKeys = getAllModuleSkeletonKeys();

  return (
    <section className="internal-showcase" aria-label="Showcase interno de componentes base">
      <PageHeader
        title="Showcase interno de componentes"
        subtitle="Referencia visual liviana para validar contrato base de shells Docente y Alumno."
        actions={<StatusBadge status="ok" />}
      />

      <section className="internal-showcase-grid" aria-label="Componentes base">
        <article className="internal-showcase-item">
          <h2>PageHeader</h2>
          <PageHeader title="Encabezado de ejemplo" subtitle="Subtítulo para shell" />
        </article>

        <article className="internal-showcase-item">
          <h2>EmptyState</h2>
          <EmptyState
            title="Sin recursos cargados"
            description="Este estado se usa para módulos sin datos iniciales."
            action={{ href: "/interno/componentes", label: "Recargar" }}
          />
        </article>

        <article className="internal-showcase-item">
          <h2>StatusBadge</h2>
          <div className="internal-showcase-badges">
            <StatusBadge status="ok" />
            <StatusBadge status="warning" />
            <StatusBadge status="blocked" />
          </div>
        </article>

        <article className="internal-showcase-item">
          <h2>StatCard</h2>
          <div className="stats-grid">
            <StatCard title="Asistencia" value="94%" description="Promedio semanal" tone="success" />
            <StatCard title="Pendientes" value="2" description="Actividades activas" tone="warning" />
          </div>
        </article>

        <article className="internal-showcase-item">
          <h2>DataTable</h2>
          <DataTable
            caption="Tabla base"
            columns={[
              { key: "modulo", header: "Módulo" },
              { key: "estado", header: "Estado" }
            ]}
            rows={[
              { id: "m-1", modulo: "Dashboard", estado: "Operativo" },
              { id: "m-2", modulo: "Aulas", estado: "En progreso" }
            ]}
          />
        </article>

        <article className="internal-showcase-item">
          <h2>Skeletons por módulo</h2>
          <div className="internal-showcase-skeletons">
            {skeletonKeys.map((moduleKey) => (
              <ModuleSkeleton key={moduleKey} moduleKey={moduleKey} />
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
