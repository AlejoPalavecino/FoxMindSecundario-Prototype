"use client";

import React, { useEffect, useState } from "react";
import {
  createActivitySubmission,
  fetchClassroomActivities,
  fetchStudentClassrooms,
  type ActivitySubmission,
  type ClassroomActivity,
  type StudentClassroom
} from "../../lib/classrooms-api";
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
  selectedClassroomId?: string | null;
  selectedActivityId?: string | null;
  submitForm?: {
    content: string;
  };
  submissionsByActivityId?: Record<string, ActivitySubmission>;
  activitiesByClassroomId?: Record<string, ClassroomActivity[]>;
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
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(
    initialState?.selectedClassroomId ?? null
  );
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(initialState?.selectedActivityId ?? null);
  const [submitForm, setSubmitForm] = useState<{ content: string }>(initialState?.submitForm ?? { content: "" });
  const [activitiesByClassroomId, setActivitiesByClassroomId] = useState<Record<string, ClassroomActivity[]>>(
    initialState?.activitiesByClassroomId ?? {}
  );
  const [submissionsByActivityId, setSubmissionsByActivityId] = useState<Record<string, ActivitySubmission>>(
    initialState?.submissionsByActivityId ?? {}
  );
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [isSubmittingActivity, setIsSubmittingActivity] = useState(false);

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
        setSelectedClassroomId(assignedClassrooms[0]?.id ?? null);
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

  useEffect(() => {
    if (!runInitialFetch || !selectedClassroomId) {
      return;
    }

    let isCancelled = false;
    const run = async () => {
      setIsLoadingActivities(true);
      try {
        const activities = await fetchClassroomActivities(selectedClassroomId);
        if (isCancelled) {
          return;
        }

        setActivitiesByClassroomId((previous) => ({
          ...previous,
          [selectedClassroomId]: activities
        }));
        if (activities.length > 0) {
          const firstActivity = activities[0];
          if (firstActivity) {
            setSelectedActivityId((previous) => previous ?? firstActivity.id);
          }
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setFeedback({
          tone: "danger",
          message: error instanceof Error ? error.message : "No pudimos cargar actividades del aula seleccionada."
        });
      } finally {
        if (!isCancelled) {
          setIsLoadingActivities(false);
        }
      }
    };

    void run();

    return () => {
      isCancelled = true;
    };
  }, [runInitialFetch, selectedClassroomId]);

  const selectedClassroom = classrooms.find((classroom) => classroom.id === selectedClassroomId) ?? null;
  const classroomActivities = selectedClassroom ? activitiesByClassroomId[selectedClassroom.id] ?? [] : [];
  const selectedActivity = classroomActivities.find((activity) => activity.id === selectedActivityId) ?? null;
  const selectedSubmission = selectedActivity ? submissionsByActivityId[selectedActivity.id] : undefined;
  const activityStatus = resolveStudentActivityStatus(selectedSubmission);
  const defaultActivityId = selectedActivityId ?? classroomActivities[0]?.id ?? "";
  const canSubmitActivity = submitForm.content.trim().length >= 10 && !!selectedActivity;

  async function handleSubmissionSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedActivity || !canSubmitActivity) {
      return;
    }

    setIsSubmittingActivity(true);
    setFeedback(null);
    try {
      const submission = await createActivitySubmission(selectedActivity.id, {
        content: submitForm.content.trim()
      });
      setSubmissionsByActivityId((previous) => ({
        ...previous,
        [selectedActivity.id]: submission
      }));
      setSubmitForm({ content: "" });
    } catch (error) {
      setFeedback({
        tone: "danger",
        message: error instanceof Error ? error.message : "No pudimos registrar tu entrega."
      });
    } finally {
      setIsSubmittingActivity(false);
    }
  }

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
          {selectedClassroom ? (
            <label>
              Aula activa
              <select
                value={selectedClassroom.id}
                onChange={(event) => {
                  const classroomId = event.target.value;
                  setSelectedClassroomId(classroomId);
                  const firstActivity = (activitiesByClassroomId[classroomId] ?? [])[0] ?? null;
                  setSelectedActivityId(firstActivity?.id ?? null);
                }}
              >
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name} - {classroom.subject}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
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

      {selectedClassroom ? (
        <section aria-label="Actividades del aula">
          <h2>Actividades</h2>
          {isLoadingActivities ? <p>Cargando actividades...</p> : null}
          {!isLoadingActivities && classroomActivities.length === 0 ? (
            <p>Todavía no hay actividades publicadas para esta aula.</p>
          ) : null}
          {classroomActivities.length > 0 ? (
            <label>
              Actividad activa
              <select
                value={defaultActivityId}
                onChange={(event) => setSelectedActivityId(event.target.value)}
              >
                {classroomActivities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.title}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {selectedActivity ? (
            <article className="docente-aulas-card">
              <h3>{selectedActivity.title}</h3>
              <p>{selectedActivity.description}</p>
              <p>Estado: {activityStatus.label}</p>
              {selectedSubmission?.status === "graded" ? (
                <>
                  <p>Nota: {selectedSubmission.score}/10</p>
                  <p>{selectedSubmission.feedback}</p>
                </>
              ) : null}
            </article>
          ) : null}

          {selectedActivity ? (
            <article className="docente-aulas-card">
              <h3>Entregar actividad</h3>
              <form className="docente-aulas-form" onSubmit={handleSubmissionSubmit}>
                <label>
                  Desarrollo
                  <textarea
                    name="submission-content"
                    value={submitForm.content}
                    rows={5}
                    onChange={(event) => setSubmitForm({ content: event.target.value })}
                    placeholder="Escribí tu entrega (mínimo 10 caracteres)"
                  />
                </label>
                <button type="submit" disabled={isSubmittingActivity || !canSubmitActivity}>
                  {isSubmittingActivity ? "Enviando..." : "Enviar entrega"}
                </button>
              </form>
            </article>
          ) : null}
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

function resolveStudentActivityStatus(submission: ActivitySubmission | undefined) {
  if (!submission) {
    return { key: "pending" as const, label: "Pendiente" };
  }

  if (submission.status === "graded") {
    return { key: "graded" as const, label: "Corregida" };
  }

  return { key: "submitted" as const, label: "Entregada" };
}
