"use client";

import React, { useEffect, useState } from "react";
import { fetchStudentClassrooms, type StudentClassroom } from "../../lib/classrooms-api";
import { EmptyState } from "../shared/empty-state";
import { PageHeader } from "../shared/page-header";
import { StatusBadge } from "../shared/status-badge";

type FeedbackTone = "danger";

type AlumnoAulasFeedback = {
  tone: FeedbackTone;
  message: string;
};

export type AlumnoAulasStatus = "loading" | "error" | "empty" | "success";

export type AlumnoAulasUiState = {
  uiState: AlumnoAulasStatus;
  classrooms: StudentClassroom[];
  feedback: AlumnoAulasFeedback | null;
};

interface AlumnoAulasWorkspaceProps {
  runInitialFetch?: boolean;
  initialState?: AlumnoAulasUiState;
}

export function resolveAlumnoAulasUiState(input: {
  isLoading: boolean;
  hasError: boolean;
  classroomsCount: number;
}): AlumnoAulasStatus {
  if (input.isLoading) {
    return "loading";
  }

  if (input.hasError) {
    return "error";
  }

  if (input.classroomsCount === 0) {
    return "empty";
  }

  return "success";
}

export function AlumnoAulasWorkspace({ runInitialFetch = true, initialState }: AlumnoAulasWorkspaceProps) {
  const [uiState, setUiState] = useState<AlumnoAulasStatus>(initialState?.uiState ?? "loading");
  const [classrooms, setClassrooms] = useState<StudentClassroom[]>(initialState?.classrooms ?? []);
  const [feedback, setFeedback] = useState<AlumnoAulasFeedback | null>(initialState?.feedback ?? null);

  useEffect(() => {
    if (!runInitialFetch) {
      return;
    }

    let isCancelled = false;
    const run = async () => {
      setUiState("loading");
      setFeedback(null);
      try {
        const assignedClassrooms = await fetchStudentClassrooms();
        if (isCancelled) {
          return;
        }
        setClassrooms(assignedClassrooms);
        setUiState(
          resolveAlumnoAulasUiState({
            isLoading: false,
            hasError: false,
            classroomsCount: assignedClassrooms.length
          })
        );
      } catch (error) {
        if (isCancelled) {
          return;
        }
        setUiState("error");
        setFeedback({
          tone: "danger",
          message: error instanceof Error ? error.message : "No pudimos cargar tus aulas en este momento."
        });
      }
    };

    void run();
    return () => {
      isCancelled = true;
    };
  }, [runInitialFetch]);

  const badge = uiState === "error" ? "blocked" : "ok";
  const stateDescription = resolveStateDescription(uiState);

  return (
    <section className="role-shell-content">
      <PageHeader
        title="Aulas"
        subtitle="Accedé a tus materias, materiales y actividades en curso."
        actions={<StatusBadge status={badge} />}
      />

      <section className="docente-aulas-state" aria-live="polite">
        <h2>Estados</h2>
        <p aria-label={`Estado: ${stateDescription.label}`}>Estado: {stateDescription.label}</p>
        <p>{stateDescription.description}</p>
      </section>

      {feedback ? <p className="docente-aulas-feedback docente-aulas-feedback-danger">{feedback.message}</p> : null}

      {uiState === "error" ? (
        <EmptyState
          title="No pudimos sincronizar tus aulas"
          description="Reintentá en unos segundos para recuperar las materias asignadas."
          action={{ href: "/alumno/aulas", label: "Reintentar" }}
        />
      ) : null}

      {uiState === "empty" ? <p>No tenés aulas asignadas todavía.</p> : null}

      {classrooms.length > 0 ? (
        <section aria-label="Aulas asignadas">
          <h2>Aulas asignadas</h2>
          <div className="docente-aulas-grid">
            {classrooms.map((classroom) => (
              <article key={classroom.id} className="docente-aulas-card">
                <h3>{classroom.name}</h3>
                <p>{classroom.subject}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}

function resolveStateDescription(uiState: AlumnoAulasStatus) {
  switch (uiState) {
    case "loading":
      return {
        label: "Cargando",
        description: "Cargando aulas y contenidos disponibles."
      };
    case "error":
      return {
        label: "Error",
        description: "No pudimos cargar tus aulas en este momento."
      };
    case "empty":
      return {
        label: "Sin aulas",
        description: "Todavía no tenés aulas asignadas."
      };
    default:
      return {
        label: "Operativo",
        description: "Aulas del alumno disponibles para continuar la cursada."
      };
  }
}
