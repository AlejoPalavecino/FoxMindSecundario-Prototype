import { AlumnoAulasWorkspace, type AlumnoAulasUiState } from "../../../../components/alumno/alumno-aulas-workspace";
import { DocenteAulasWorkspace, type DocenteAulasUiState } from "../../../../components/docente/docente-aulas-workspace";

const CLASSROOM_ID = "classroom-smoke-1";
const ACTIVITY_ID = "activity-smoke-1";
const SUBMISSION_ID = "submission-smoke-1";

const docenteCreateState: DocenteAulasUiState = {
  uiState: "success",
  classrooms: [
    {
      id: CLASSROOM_ID,
      name: "1A Ciencias",
      subject: "Ciencias Naturales",
      students: [
        {
          studentId: "student-demo-1",
          email: "alumno.demo@foxmind.app",
          fullName: "Alumno Demo",
          status: "active"
        }
      ]
    }
  ],
  selectedClassroomId: CLASSROOM_ID,
  createForm: { name: "", subject: "" },
  editForm: { name: "1A Ciencias", subject: "Ciencias Naturales" },
  enrollmentForm: { studentId: "" },
  studentFilterQuery: "",
  csvForm: { fileName: "", csvContent: "" },
  activityForm: {
    title: "Actividad Sprint 3",
    description: "Describe un concepto y sumá un ejemplo práctico."
  },
  gradeForm: { submissionId: "", score: "", feedback: "" },
  activitiesByClassroomId: {
    [CLASSROOM_ID]: [
      {
        id: ACTIVITY_ID,
        classroomId: CLASSROOM_ID,
        title: "Actividad Sprint 3",
        description: "Describe un concepto y sumá un ejemplo práctico.",
        status: "published",
        createdAt: new Date().toISOString(),
        submissions: []
      }
    ]
  },
  submissionsByActivityId: {},
  csvReport: null,
  feedback: {
    tone: "success",
    message: "Actividad creada correctamente."
  }
};

const alumnoSubmittedState: AlumnoAulasUiState = {
  uiState: "success",
  classrooms: [
    {
      id: CLASSROOM_ID,
      name: "1A Ciencias",
      subject: "Ciencias Naturales",
      enrollmentId: "enrollment-smoke-1"
    }
  ],
  selectedClassroomId: CLASSROOM_ID,
  selectedActivityId: ACTIVITY_ID,
  submitForm: {
    content: "Entrega de ejemplo del alumno para evidencia visual."
  },
  activitiesByClassroomId: {
    [CLASSROOM_ID]: [
      {
        id: ACTIVITY_ID,
        classroomId: CLASSROOM_ID,
        title: "Actividad Sprint 3",
        description: "Describe un concepto y sumá un ejemplo práctico.",
        status: "published",
        createdAt: new Date().toISOString(),
        studentSubmission: {
          id: SUBMISSION_ID,
          activityId: ACTIVITY_ID,
          studentId: "student-demo-1",
          content: "Entrega de ejemplo del alumno para evidencia visual.",
          status: "submitted",
          createdAt: new Date().toISOString()
        }
      }
    ]
  },
  submissionsByActivityId: {
    [ACTIVITY_ID]: {
      id: SUBMISSION_ID,
      activityId: ACTIVITY_ID,
      studentId: "student-demo-1",
      content: "Entrega de ejemplo del alumno para evidencia visual.",
      status: "submitted",
      createdAt: new Date().toISOString()
    }
  },
  feedback: null
};

const docenteGradedState: DocenteAulasUiState = {
  ...docenteCreateState,
  gradeForm: {
    submissionId: SUBMISSION_ID,
    score: "8",
    feedback: "Buen trabajo: argumento claro y ejemplo correcto."
  },
  activitiesByClassroomId: {
    [CLASSROOM_ID]: [
      {
        id: ACTIVITY_ID,
        classroomId: CLASSROOM_ID,
        title: "Actividad Sprint 3",
        description: "Describe un concepto y sumá un ejemplo práctico.",
        status: "published",
        createdAt: new Date().toISOString(),
        submissions: [
          {
            id: SUBMISSION_ID,
            activityId: ACTIVITY_ID,
            studentId: "student-demo-1",
            content: "Entrega de ejemplo del alumno para evidencia visual.",
            status: "graded",
            score: 8,
            feedback: "Buen trabajo: argumento claro y ejemplo correcto.",
            gradedAt: new Date().toISOString(),
            gradedByUserId: "teacher-demo-1"
          }
        ]
      }
    ]
  },
  submissionsByActivityId: {
    [ACTIVITY_ID]: {
      id: SUBMISSION_ID,
      activityId: ACTIVITY_ID,
      studentId: "student-demo-1",
      content: "Entrega de ejemplo del alumno para evidencia visual.",
      status: "graded",
      score: 8,
      feedback: "Buen trabajo: argumento claro y ejemplo correcto.",
      gradedAt: new Date().toISOString(),
      gradedByUserId: "teacher-demo-1"
    }
  },
  feedback: {
    tone: "success",
    message: "Entrega corregida y calificada."
  }
};

const alumnoGradedState: AlumnoAulasUiState = {
  ...alumnoSubmittedState,
  activitiesByClassroomId: {
    [CLASSROOM_ID]: [
      {
        id: ACTIVITY_ID,
        classroomId: CLASSROOM_ID,
        title: "Actividad Sprint 3",
        description: "Describe un concepto y sumá un ejemplo práctico.",
        status: "published",
        createdAt: new Date().toISOString(),
        studentSubmission: {
          id: SUBMISSION_ID,
          activityId: ACTIVITY_ID,
          studentId: "student-demo-1",
          content: "Entrega de ejemplo del alumno para evidencia visual.",
          status: "graded",
          score: 8,
          feedback: "Buen trabajo: argumento claro y ejemplo correcto.",
          gradedAt: new Date().toISOString(),
          gradedByUserId: "teacher-demo-1"
        }
      }
    ]
  },
  submissionsByActivityId: {
    [ACTIVITY_ID]: {
      id: SUBMISSION_ID,
      activityId: ACTIVITY_ID,
      studentId: "student-demo-1",
      content: "Entrega de ejemplo del alumno para evidencia visual.",
      status: "graded",
      score: 8,
      feedback: "Buen trabajo: argumento claro y ejemplo correcto.",
      gradedAt: new Date().toISOString(),
      gradedByUserId: "teacher-demo-1"
    }
  }
};

export default function Sprint3EvidencePage() {
  return (
    <main className="role-shell-content">
      <h1>Evidencia Sprint 3</h1>

      <section id="docente-create-activity">
        <h2>1) Docente crea actividad</h2>
        <DocenteAulasWorkspace runInitialFetch={false} initialState={docenteCreateState} />
      </section>

      <section id="alumno-submit-activity">
        <h2>2) Alumno entrega actividad</h2>
        <AlumnoAulasWorkspace runInitialFetch={false} initialState={alumnoSubmittedState} />
      </section>

      <section id="docente-grade-submission">
        <h2>3) Docente corrige entrega</h2>
        <DocenteAulasWorkspace runInitialFetch={false} initialState={docenteGradedState} />
      </section>

      <section id="alumno-view-feedback">
        <h2>4) Alumno visualiza nota y feedback</h2>
        <AlumnoAulasWorkspace runInitialFetch={false} initialState={alumnoGradedState} />
      </section>
    </main>
  );
}
