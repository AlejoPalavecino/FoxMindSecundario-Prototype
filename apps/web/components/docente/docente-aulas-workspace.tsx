"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  createClassroomActivity,
  createClassroom,
  createEnrollment,
  exportClassroomRosterCsv,
  fetchClassroomActivities,
  fetchTeacherClassrooms,
  gradeActivitySubmission,
  importEnrollmentsCsv,
  resolveEnrollmentNotice,
  type ActivitySubmission,
  type ClassroomActivity,
  type ClassroomRosterRow,
  type CsvImportError,
  type ImportEnrollmentsCsvResponse,
  updateClassroom
} from "../../lib/classrooms-api";
import { DataTable } from "../shared/data-table";
import { EmptyState } from "../shared/empty-state";
import { PageHeader } from "../shared/page-header";
import { StatusBadge } from "../shared/status-badge";

type FeedbackTone = "success" | "warning" | "danger";

interface DocenteAulasFeedback {
  tone: FeedbackTone;
  message: string;
}

export interface DocenteClassroomRow {
  id: string;
  name: string;
  subject: string;
  students: ClassroomRosterRow[];
}

type FormFields = {
  name: string;
  subject: string;
};

type EnrollmentFormFields = {
  studentId: string;
};

type CsvFormFields = {
  fileName: string;
  csvContent: string;
};

type ActivityFormFields = {
  title: string;
  description: string;
};

type GradeFormFields = {
  submissionId: string;
  score: string;
  feedback: string;
};

export type DocenteAulasStatus = "loading" | "error" | "empty" | "success";

export interface DocenteAulasUiState {
  uiState: DocenteAulasStatus;
  classrooms: DocenteClassroomRow[];
  selectedClassroomId: string | null;
  createForm: FormFields;
  editForm: FormFields;
  enrollmentForm: EnrollmentFormFields;
  studentFilterQuery: string;
  csvForm: CsvFormFields;
  activityForm?: ActivityFormFields;
  gradeForm?: GradeFormFields;
  activitiesByClassroomId?: Record<string, ClassroomActivity[]>;
  submissionsByActivityId?: Record<string, ActivitySubmission>;
  csvReport: ImportEnrollmentsCsvResponse | null;
  feedback: DocenteAulasFeedback | null;
}

interface DocenteAulasWorkspaceProps {
  runInitialFetch?: boolean;
  initialState?: DocenteAulasUiState;
}

const EMPTY_FORM: FormFields = { name: "", subject: "" };
const EMPTY_ENROLLMENT_FORM: EnrollmentFormFields = { studentId: "" };
const EMPTY_CSV_FORM: CsvFormFields = { fileName: "", csvContent: "" };
const EMPTY_ACTIVITY_FORM: ActivityFormFields = { title: "", description: "" };
const EMPTY_GRADE_FORM: GradeFormFields = { submissionId: "", score: "", feedback: "" };

export function resolveUiState(input: {
  isLoading: boolean;
  hasError: boolean;
  classroomsCount: number;
}): DocenteAulasStatus {
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

export function DocenteAulasWorkspace({ runInitialFetch = true, initialState }: DocenteAulasWorkspaceProps) {
  const [uiState, setUiState] = useState<DocenteAulasStatus>(initialState?.uiState ?? "loading");
  const [classrooms, setClassrooms] = useState<DocenteClassroomRow[]>(initialState?.classrooms ?? []);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(
    initialState?.selectedClassroomId ?? null
  );
  const [createForm, setCreateForm] = useState<FormFields>(initialState?.createForm ?? EMPTY_FORM);
  const [editForm, setEditForm] = useState<FormFields>(initialState?.editForm ?? EMPTY_FORM);
  const [enrollmentForm, setEnrollmentForm] = useState<EnrollmentFormFields>(
    initialState?.enrollmentForm ?? EMPTY_ENROLLMENT_FORM
  );
  const [studentFilterQuery, setStudentFilterQuery] = useState(initialState?.studentFilterQuery ?? "");
  const [csvForm, setCsvForm] = useState<CsvFormFields>(initialState?.csvForm ?? EMPTY_CSV_FORM);
  const [activityForm, setActivityForm] = useState<ActivityFormFields>(
    initialState?.activityForm ?? EMPTY_ACTIVITY_FORM
  );
  const [gradeForm, setGradeForm] = useState<GradeFormFields>(initialState?.gradeForm ?? EMPTY_GRADE_FORM);
  const [activitiesByClassroomId, setActivitiesByClassroomId] = useState<Record<string, ClassroomActivity[]>>(
    initialState?.activitiesByClassroomId ?? {}
  );
  const [submissionsByActivityId, setSubmissionsByActivityId] = useState<Record<string, ActivitySubmission>>(
    initialState?.submissionsByActivityId ?? {}
  );
  const [csvReport, setCsvReport] = useState<ImportEnrollmentsCsvResponse | null>(
    initialState?.csvReport ?? null
  );
  const [feedback, setFeedback] = useState<DocenteAulasFeedback | null>(initialState?.feedback ?? null);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isSubmittingEnrollment, setIsSubmittingEnrollment] = useState(false);
  const [isSubmittingCsv, setIsSubmittingCsv] = useState(false);
  const [isSubmittingActivity, setIsSubmittingActivity] = useState(false);
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  const selectedClassroom = useMemo(
    () => classrooms.find((classroom) => classroom.id === selectedClassroomId) ?? null,
    [classrooms, selectedClassroomId]
  );

  useEffect(() => {
    if (!runInitialFetch) {
      return;
    }

    let isCancelled = false;

    const run = async () => {
      setUiState("loading");
      setFeedback(null);

      try {
        const fetched = await fetchTeacherClassrooms();
        if (isCancelled) {
          return;
        }

        const nextClassrooms = fetched;
        const first = nextClassrooms[0] ?? null;

        setClassrooms(nextClassrooms);
        setSelectedClassroomId(first?.id ?? null);
        setEditForm(first ? { name: first.name, subject: first.subject } : EMPTY_FORM);
        setUiState(
          resolveUiState({
            isLoading: false,
            hasError: false,
            classroomsCount: nextClassrooms.length
          })
        );
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setUiState("error");
        setFeedback({
          tone: "danger",
          message: error instanceof Error ? error.message : "No pudimos cargar las aulas docentes."
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
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setFeedback({
          tone: "danger",
          message: error instanceof Error ? error.message : "No se pudieron cargar las actividades del aula."
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

  const badge = resolveBadge(feedback, uiState);
  const stateDescription = resolveStateDescription(uiState);

  const tableRows = classrooms.map((classroom) => ({
    id: classroom.id,
    aula: classroom.name,
    materia: classroom.subject,
    alumnos: classroom.students.length
  }));

  const canSubmitCreate = createForm.name.trim().length > 0 && createForm.subject.trim().length > 0;
  const canSubmitEdit =
    !!selectedClassroom && editForm.name.trim().length > 0 && editForm.subject.trim().length > 0;
  const canSubmitEnrollment = !!selectedClassroom && enrollmentForm.studentId.trim().length > 0;
  const canSubmitCsv = !!selectedClassroom && csvForm.csvContent.trim().length > 0;
  const canSubmitActivity =
    !!selectedClassroom && activityForm.title.trim().length > 0 && activityForm.description.trim().length > 0;
  const canSubmitGrade =
    gradeForm.submissionId.trim().length > 0 &&
    gradeForm.feedback.trim().length >= 5 &&
    Number.isInteger(Number(gradeForm.score)) &&
    Number(gradeForm.score) >= 1 &&
    Number(gradeForm.score) <= 10;

  const rosterRows = useMemo<ClassroomRosterRow[]>(() => {
    if (!selectedClassroom) {
      return [];
    }

    return selectedClassroom.students;
  }, [selectedClassroom]);

  const filteredRosterRows = useMemo(
    () => filterClassroomRosterRows(rosterRows, studentFilterQuery),
    [rosterRows, studentFilterQuery]
  );

  const hasActiveStudentFilter = studentFilterQuery.trim().length > 0;
  const hasRoster = rosterRows.length > 0;
  const hasFilterResults = filteredRosterRows.length > 0;
  const classroomActivities = selectedClassroom ? activitiesByClassroomId[selectedClassroom.id] ?? [] : [];

  async function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmitCreate) {
      return;
    }

    setIsSubmittingCreate(true);
    setFeedback(null);
    try {
      const created = await createClassroom({
        name: createForm.name.trim(),
        subject: createForm.subject.trim()
      });
      const nextClassroom: DocenteClassroomRow = { ...created, students: [] };

      setClassrooms((previous) => [...previous, nextClassroom]);
      setSelectedClassroomId(nextClassroom.id);
      setEditForm({ name: nextClassroom.name, subject: nextClassroom.subject });
      setCreateForm(EMPTY_FORM);
      setUiState("success");
      setFeedback({ tone: "success", message: "Aula creada correctamente." });
    } catch (error) {
      setFeedback({
        tone: "danger",
        message: error instanceof Error ? error.message : "No se pudo crear el aula."
      });
    } finally {
      setIsSubmittingCreate(false);
    }
  }

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClassroom || !canSubmitEdit) {
      return;
    }

    setIsSubmittingEdit(true);
    setFeedback(null);

    try {
      const updated = await updateClassroom(selectedClassroom.id, {
        name: editForm.name.trim(),
        subject: editForm.subject.trim()
      });

      setClassrooms((previous) =>
        previous.map((item) =>
          item.id === selectedClassroom.id ? { ...item, name: updated.name, subject: updated.subject } : item
        )
      );
      setFeedback({ tone: "success", message: "Aula actualizada correctamente." });
    } catch (error) {
      setFeedback({
        tone: "danger",
        message: error instanceof Error ? error.message : "No se pudo actualizar el aula."
      });
    } finally {
      setIsSubmittingEdit(false);
    }
  }

  async function handleEnrollmentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClassroom || !canSubmitEnrollment) {
      return;
    }

    const normalizedStudentId = enrollmentForm.studentId.trim();
    setIsSubmittingEnrollment(true);
    setFeedback(null);

    try {
      const result = await createEnrollment(selectedClassroom.id, {
        studentId: normalizedStudentId
      });
      const enrollmentNotice = resolveEnrollmentNotice(result);

      setClassrooms((previous) =>
        previous.map((item) => {
          if (item.id !== selectedClassroom.id) {
            return item;
          }

           const exists = item.students.some((student) => student.studentId === normalizedStudentId);
           if (exists) {
             return item;
           }

           return {
             ...item,
             students: [
               ...item.students,
               {
                 studentId: normalizedStudentId,
                 email: "",
                 fullName: "",
                 status: "active"
               }
             ]
           };
         })
      );
      setFeedback(enrollmentNotice);
      setEnrollmentForm(EMPTY_ENROLLMENT_FORM);
    } catch (error) {
      setFeedback({
        tone: "danger",
        message: error instanceof Error ? error.message : "No se pudo enrolar al alumno."
      });
    } finally {
      setIsSubmittingEnrollment(false);
    }
  }

  async function handleCsvSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClassroom || !canSubmitCsv) {
      return;
    }

    setIsSubmittingCsv(true);
    setFeedback(null);
    try {
      const report = await importEnrollmentsCsv(selectedClassroom.id, {
        csvContent: csvForm.csvContent
      });
      setCsvReport(report);
      setFeedback({
        tone: report.errors.length > 0 ? "warning" : "success",
        message:
          report.errors.length > 0
            ? "Importación finalizada con observaciones."
            : "Importación CSV completada sin errores."
      });
      setCsvForm((previous) => ({ ...previous, csvContent: "" }));
    } catch (error) {
      setFeedback({
        tone: "danger",
        message: error instanceof Error ? error.message : "No se pudo importar el CSV."
      });
    } finally {
      setIsSubmittingCsv(false);
    }
  }

  async function handleCsvFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const csvContent = await file.text();
    setCsvForm({
      fileName: file.name,
      csvContent
    });
  }

  async function handleActivitySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClassroom || !canSubmitActivity) {
      return;
    }

    setIsSubmittingActivity(true);
    setFeedback(null);
    try {
      const created = await createClassroomActivity(selectedClassroom.id, {
        title: activityForm.title.trim(),
        description: activityForm.description.trim()
      });

      setActivitiesByClassroomId((previous) => ({
        ...previous,
        [selectedClassroom.id]: [created, ...(previous[selectedClassroom.id] ?? [])]
      }));
      setActivityForm(EMPTY_ACTIVITY_FORM);
      setFeedback({ tone: "success", message: "Actividad creada correctamente." });
    } catch (error) {
      setFeedback({
        tone: "danger",
        message: error instanceof Error ? error.message : "No se pudo crear la actividad."
      });
    } finally {
      setIsSubmittingActivity(false);
    }
  }

  async function handleGradeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmitGrade) {
      return;
    }

    setIsSubmittingGrade(true);
    setFeedback(null);

    try {
      const graded = await gradeActivitySubmission(gradeForm.submissionId.trim(), {
        score: Number(gradeForm.score),
        feedback: gradeForm.feedback.trim()
      });

      setSubmissionsByActivityId((previous) => ({
        ...previous,
        [graded.activityId]: graded
      }));
      setGradeForm(EMPTY_GRADE_FORM);
      setFeedback({ tone: "success", message: "Entrega corregida y calificada." });
    } catch (error) {
      setFeedback({
        tone: "danger",
        message: error instanceof Error ? error.message : "No se pudo calificar la entrega."
      });
    } finally {
      setIsSubmittingGrade(false);
    }
  }

  function handleClassroomSelection(classroomId: string) {
    setSelectedClassroomId(classroomId);
    setStudentFilterQuery("");
    const classroom = classrooms.find((item) => item.id === classroomId);
    if (classroom) {
      setEditForm({ name: classroom.name, subject: classroom.subject });
    }
  }

  function handleExportRoster() {
    if (!selectedClassroom) {
      return;
    }

    const exported = exportClassroomRosterCsv({
      classroomName: `${selectedClassroom.name}-${selectedClassroom.subject}`,
      rows: rosterRows,
      onNoData: () => {
        setFeedback({
          tone: "warning",
          message: "No hay alumnos para exportar en esta aula todavía."
        });
      }
    });

    if (!exported) {
      return;
    }

    setFeedback({
      tone: "success",
      message: `Export CSV generado para ${selectedClassroom.name}.`
    });
  }

  return (
    <section className="role-shell-content">
      <PageHeader
        title="Aulas"
        subtitle="Creá, editá y gestioná altas manuales de alumnos desde un único flujo docente."
        actions={<StatusBadge status={badge} />}
      />

      <section className="docente-aulas-state" aria-live="polite">
        <h2>Estados</h2>
        <p aria-label={`Estado: ${stateDescription.label}`}>Estado: {stateDescription.label}</p>
        <p>{stateDescription.description}</p>
      </section>

      {feedback ? (
        <p className={`docente-aulas-feedback docente-aulas-feedback-${feedback.tone}`}>{feedback.message}</p>
      ) : null}

      <section className="docente-aulas-grid" aria-label="Gestión de aulas">
        <article className="docente-aulas-card" aria-label="Formulario crear aula">
          <h2>Crear aula</h2>
          <form className="docente-aulas-form" onSubmit={handleCreateSubmit}>
            <label>
              Nombre del aula
              <input
                name="name"
                value={createForm.name}
                onChange={(event) => setCreateForm((previous) => ({ ...previous, name: event.target.value }))}
                placeholder="Ej: 2A"
              />
            </label>
            <label>
              Materia
              <input
                name="subject"
                value={createForm.subject}
                onChange={(event) => setCreateForm((previous) => ({ ...previous, subject: event.target.value }))}
                placeholder="Ej: Matemática"
              />
            </label>
            <button type="submit" disabled={isSubmittingCreate || !canSubmitCreate}>
              {isSubmittingCreate ? "Creando..." : "Crear aula"}
            </button>
          </form>
        </article>

        <article className="docente-aulas-card" aria-label="Formulario editar aula">
          <h2>Editar aula</h2>
          {classrooms.length > 0 ? (
            <>
              <label className="docente-aulas-selector-label">
                Aula seleccionada
                <select
                  value={selectedClassroomId ?? ""}
                  onChange={(event) => handleClassroomSelection(event.target.value)}
                >
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name} - {classroom.subject}
                    </option>
                  ))}
                </select>
              </label>
              <form className="docente-aulas-form" onSubmit={handleEditSubmit}>
                <label>
                  Nombre del aula
                  <input
                    name="edit-name"
                    value={editForm.name}
                    onChange={(event) =>
                      setEditForm((previous) => ({
                        ...previous,
                        name: event.target.value
                      }))
                    }
                  />
                </label>
                <label>
                  Materia
                  <input
                    name="edit-subject"
                    value={editForm.subject}
                    onChange={(event) =>
                      setEditForm((previous) => ({
                        ...previous,
                        subject: event.target.value
                      }))
                    }
                  />
                </label>
                <button type="submit" disabled={isSubmittingEdit || !canSubmitEdit}>
                  {isSubmittingEdit ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            </>
          ) : (
            <p>Creá la primera aula para habilitar edición.</p>
          )}
        </article>

        <article className="docente-aulas-card" aria-label="Formulario alta manual de alumno">
          <h2>Alta manual de alumno</h2>
          {selectedClassroom ? (
            <form className="docente-aulas-form" onSubmit={handleEnrollmentSubmit}>
              <p className="docente-aulas-caption">
                Aula activa: <strong>{selectedClassroom.name}</strong>
              </p>
              <label>
                Student ID
                <input
                  name="studentId"
                  value={enrollmentForm.studentId}
                  onChange={(event) => setEnrollmentForm({ studentId: event.target.value })}
                  placeholder="UUID del alumno"
                />
              </label>
              <button type="submit" disabled={isSubmittingEnrollment || !canSubmitEnrollment}>
                {isSubmittingEnrollment ? "Enrolando..." : "Enrolar alumno"}
              </button>
            </form>
          ) : (
            <p>Seleccioná o creá un aula antes de registrar alumnos.</p>
          )}
        </article>

        <article className="docente-aulas-card" aria-label="Formulario crear actividad">
          <h2>Crear actividad</h2>
          {selectedClassroom ? (
            <form className="docente-aulas-form" onSubmit={handleActivitySubmit}>
              <p className="docente-aulas-caption">
                Aula activa: <strong>{selectedClassroom.name}</strong>
              </p>
              <label>
                Título
                <input
                  name="activity-title"
                  value={activityForm.title}
                  onChange={(event) =>
                    setActivityForm((previous) => ({
                      ...previous,
                      title: event.target.value
                    }))
                  }
                  placeholder="Ej: Trabajo práctico 1"
                />
              </label>
              <label>
                Consigna
                <textarea
                  name="activity-description"
                  rows={4}
                  value={activityForm.description}
                  onChange={(event) =>
                    setActivityForm((previous) => ({
                      ...previous,
                      description: event.target.value
                    }))
                  }
                  placeholder="Describe qué debe entregar el alumno"
                />
              </label>
              <button type="submit" disabled={isSubmittingActivity || !canSubmitActivity}>
                {isSubmittingActivity ? "Creando..." : "Crear actividad"}
              </button>
            </form>
          ) : (
            <p>Seleccioná o creá un aula para publicar actividades.</p>
          )}
        </article>

        <article className="docente-aulas-card" aria-label="Formulario calificar entrega">
          <h2>Calificar entrega</h2>
          <form className="docente-aulas-form" onSubmit={handleGradeSubmit}>
            <label>
              Submission ID
              <input
                name="grade-submission-id"
                value={gradeForm.submissionId}
                onChange={(event) =>
                  setGradeForm((previous) => ({
                    ...previous,
                    submissionId: event.target.value
                  }))
                }
                placeholder="UUID de la entrega"
              />
            </label>
            <label>
              Nota (1 a 10)
              <input
                name="grade-score"
                type="number"
                min={1}
                max={10}
                value={gradeForm.score}
                onChange={(event) =>
                  setGradeForm((previous) => ({
                    ...previous,
                    score: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Devolución
              <textarea
                name="grade-feedback"
                rows={4}
                value={gradeForm.feedback}
                onChange={(event) =>
                  setGradeForm((previous) => ({
                    ...previous,
                    feedback: event.target.value
                  }))
                }
                placeholder="Feedback para el alumno"
              />
            </label>
            <button type="submit" disabled={isSubmittingGrade || !canSubmitGrade}>
              {isSubmittingGrade ? "Calificando..." : "Calificar entrega"}
            </button>
          </form>
        </article>

        <article className="docente-aulas-card" aria-label="Listado de actividades del aula seleccionada">
          <h2>Actividades publicadas</h2>
          {selectedClassroom ? (
            <>
              <p className="docente-aulas-caption">
                Aula activa: <strong>{selectedClassroom.name}</strong>
              </p>
              {isLoadingActivities ? <p>Cargando actividades...</p> : null}
              {!isLoadingActivities && classroomActivities.length === 0 ? (
                <p>Todavía no hay actividades publicadas para esta aula.</p>
              ) : null}
              {classroomActivities.length > 0 ? (
                <ul>
                  {classroomActivities.map((activity) => {
                    const submission = submissionsByActivityId[activity.id];
                    return (
                      <li key={activity.id}>
                        <strong>{activity.title}</strong> - {resolveSubmissionLabel(submission)}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </>
          ) : (
            <p>Seleccioná o creá un aula para gestionar actividades.</p>
          )}
        </article>

        <article className="docente-aulas-card" aria-label="Listado de alumnos del aula seleccionada">
          <h2>Listado de alumnos</h2>
          {selectedClassroom ? (
            <>
              <p className="docente-aulas-caption">
                Aula activa: <strong>{selectedClassroom.name}</strong>
              </p>
              <form className="docente-aulas-form" onSubmit={(event) => event.preventDefault()}>
                <label>
                  Buscar por studentId
                  <input
                    name="student-filter-query"
                    value={studentFilterQuery}
                    onChange={(event) => setStudentFilterQuery(event.target.value)}
                    placeholder="Ej: student-123"
                  />
                </label>
                {hasActiveStudentFilter ? (
                  <button type="button" onClick={() => setStudentFilterQuery("")}>
                    Limpiar filtro
                  </button>
                ) : null}
                <button type="button" onClick={handleExportRoster}>
                  Exportar CSV
                </button>
              </form>

              {!hasRoster ? <p>Todavía no hay alumnos registrados en esta aula.</p> : null}
              {hasRoster && !hasFilterResults ? (
                <p>No encontramos alumnos para "{studentFilterQuery.trim()}".</p>
              ) : null}
              {hasRoster && hasFilterResults ? (
                <DataTable
                  caption="Listado de alumnos"
                  columns={[{ key: "studentId", header: "Student ID" }]}
                  rows={filteredRosterRows.map((row) => ({ id: row.studentId, studentId: row.studentId }))}
                  emptyMessage="Sin alumnos en el filtro aplicado."
                />
              ) : null}
            </>
          ) : (
            <p>Seleccioná o creá un aula para visualizar y exportar alumnos.</p>
          )}
        </article>

        <article className="docente-aulas-card" aria-label="Formulario importación CSV">
          <h2>Importar CSV</h2>
          {selectedClassroom ? (
            <form className="docente-aulas-form" onSubmit={handleCsvSubmit}>
              <p className="docente-aulas-caption">
                Aula activa: <strong>{selectedClassroom.name}</strong>
              </p>
              <label>
                Archivo CSV
                <input type="file" accept=".csv,text/csv" onChange={handleCsvFileSelection} />
              </label>
              <label>
                Contenido CSV
                <textarea
                  name="csv-content"
                  value={csvForm.csvContent}
                  onChange={(event) =>
                    setCsvForm((previous) => ({
                      ...previous,
                      csvContent: event.target.value
                    }))
                  }
                  placeholder="email,fullName"
                  rows={5}
                />
              </label>
              {csvForm.fileName ? <p>Archivo seleccionado: {csvForm.fileName}</p> : null}
              <button type="submit" disabled={isSubmittingCsv || !canSubmitCsv}>
                {isSubmittingCsv ? "Importando..." : "Importar CSV"}
              </button>
            </form>
          ) : (
            <p>Seleccioná o creá un aula antes de importar alumnos por CSV.</p>
          )}

          {csvReport ? (
            <section aria-label="Reporte de importación CSV" className="docente-aulas-csv-report">
              <p>Filas procesadas: {csvReport.processed}</p>
              <p>Usuarios creados: {csvReport.createdUsers}</p>
              <p>Enrollments creados: {csvReport.createdEnrollments}</p>
              {csvReport.errors.length > 0 ? (
                <ul>
                  {csvReport.errors.map((error: CsvImportError) => (
                    <li key={`${error.line}-${error.code}`}>
                      Línea {error.line} - {error.code}: {error.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Sin errores por fila.</p>
              )}
            </section>
          ) : null}
        </article>
      </section>

      <section aria-label="Listado de aulas docente">
        {uiState === "error" ? (
          <EmptyState
            title="No pudimos sincronizar aulas"
            description="Reintentá en unos segundos para recuperar el listado docente."
            action={{ href: "/docente/aulas", label: "Recargar" }}
          />
        ) : (
          <DataTable
            caption="Listado de aulas docente"
            columns={[
              { key: "aula", header: "Aula" },
              { key: "materia", header: "Materia" },
              { key: "alumnos", header: "Alumnos registrados" }
            ]}
            rows={tableRows}
            emptyMessage={uiState === "loading" ? "Cargando aulas..." : "Todavía no hay aulas creadas."}
          />
        )}
      </section>
    </section>
  );
}

export function filterClassroomRosterRows(rows: ClassroomRosterRow[], query: string): ClassroomRosterRow[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) {
    return rows;
  }

  return rows.filter((row) => {
    const candidate = [row.studentId, row.email ?? "", row.fullName ?? ""].join(" ").toLowerCase();
    return candidate.includes(normalizedQuery);
  });
}

function resolveBadge(feedback: DocenteAulasFeedback | null, uiState: DocenteAulasStatus) {
  if (feedback?.tone === "warning") {
    return "warning" as const;
  }

  if (feedback?.tone === "danger" || uiState === "error") {
    return "blocked" as const;
  }

  return "ok" as const;
}

function resolveStateDescription(uiState: DocenteAulasStatus) {
  switch (uiState) {
    case "loading":
      return {
        label: "Cargando",
        description: "Cargando aulas y sincronizando información docente."
      };
    case "error":
      return {
        label: "Error",
        description: "Hubo un problema al obtener las aulas del docente."
      };
    case "empty":
      return {
        label: "Sin aulas",
        description: "Todavía no hay aulas creadas para este docente."
      };
    default:
      return {
        label: "Operativo",
        description: "Aulas y formularios listos para gestión diaria."
      };
  }
}

function resolveSubmissionLabel(submission: ActivitySubmission | undefined) {
  if (!submission) {
    return "Sin entrega";
  }

  if (submission.status === "graded") {
    return `Corregida (${submission.score ?? "-"}/10)`;
  }

  return "Entregada";
}
