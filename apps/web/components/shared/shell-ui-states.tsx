import React from "react";
import { EmptyState } from "./empty-state";
import type { ShellModuleSkeletonKey } from "./module-skeleton";
import { ModuleSkeleton } from "./module-skeleton";
import { StatusBadge } from "./status-badge";

interface ShellUiStatesProps {
  basePath: string;
  loadingSkeleton: ShellModuleSkeletonKey;
  loadingDescription: string;
  errorDescription: string;
  successDescription: string;
  emptyDescription: string;
  retryLabel?: string;
}

export function ShellUiStates({
  basePath,
  loadingSkeleton,
  loadingDescription,
  errorDescription,
  successDescription,
  emptyDescription,
  retryLabel = "Reintentar"
}: ShellUiStatesProps) {
  return (
    <div className="shell-ui-states" aria-label="Estados UI shell">
      <section className="shell-ui-state shell-ui-state-loading">
        <h2>Cargando</h2>
        <p aria-label="Estado: Cargando">Estado: Cargando</p>
        <ModuleSkeleton moduleKey={loadingSkeleton} />
        <p>{loadingDescription}</p>
      </section>

      <section className="shell-ui-state shell-ui-state-error">
        <h2>Error</h2>
        <p aria-label="Estado: Error">Estado: Error</p>
        <p>{errorDescription}</p>
        <a href={basePath}>{retryLabel}</a>
      </section>

      <section className="shell-ui-state shell-ui-state-success">
        <h2>Success</h2>
        <StatusBadge status="ok" />
        <p>{successDescription}</p>
      </section>

      <EmptyState
        title="Sin contenido disponible"
        description={emptyDescription}
        action={{ href: basePath, label: "Recargar shell" }}
      />
    </div>
  );
}
