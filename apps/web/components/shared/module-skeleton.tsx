import React from "react";

export type ShellModuleSkeletonKey =
  | "docente-dashboard"
  | "docente-aulas"
  | "docente-agenda"
  | "docente-progreso"
  | "docente-copiloto"
  | "docente-configuracion"
  | "alumno-dashboard"
  | "alumno-aulas"
  | "alumno-estudia"
  | "alumno-progreso"
  | "alumno-configuracion";

interface SkeletonModuleConfig {
  label: string;
  rows: Array<"short" | "medium" | "long">;
}

const MODULE_SKELETONS: Record<ShellModuleSkeletonKey, SkeletonModuleConfig> = {
  "docente-dashboard": { label: "dashboard docente", rows: ["long", "medium", "short"] },
  "docente-aulas": { label: "aulas docente", rows: ["long", "long", "medium"] },
  "docente-agenda": { label: "agenda docente", rows: ["medium", "short", "long"] },
  "docente-progreso": { label: "progreso docente", rows: ["short", "medium", "long"] },
  "docente-copiloto": { label: "copiloto docente", rows: ["medium", "long", "medium"] },
  "docente-configuracion": { label: "configuración docente", rows: ["short", "short", "medium"] },
  "alumno-dashboard": { label: "dashboard alumno", rows: ["long", "medium", "short"] },
  "alumno-aulas": { label: "aulas alumno", rows: ["long", "long", "short"] },
  "alumno-estudia": { label: "EstudIA alumno", rows: ["medium", "long", "medium"] },
  "alumno-progreso": { label: "progreso alumno", rows: ["short", "medium", "long"] },
  "alumno-configuracion": { label: "configuración alumno", rows: ["short", "medium", "short"] }
};

export function ModuleSkeleton({ moduleKey }: { moduleKey: ShellModuleSkeletonKey }) {
  const module = MODULE_SKELETONS[moduleKey];

  return (
    <section className="module-skeleton" aria-label={`Skeleton ${module.label}`}>
      <span className="skeleton-block skeleton-block-title" aria-hidden="true" />
      {module.rows.map((size, index) => (
        <span
          key={`${moduleKey}-${size}-${index}`}
          className={`skeleton-block skeleton-block-row skeleton-block-row-${size}`}
          aria-hidden="true"
        />
      ))}
    </section>
  );
}

export function getAllModuleSkeletonKeys(): ShellModuleSkeletonKey[] {
  return Object.keys(MODULE_SKELETONS) as ShellModuleSkeletonKey[];
}
