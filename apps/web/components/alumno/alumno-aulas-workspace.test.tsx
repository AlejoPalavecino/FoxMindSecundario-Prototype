import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AlumnoAulasWorkspace,
  type AlumnoAulasUiState,
  resolveAlumnoAulasUiState
} from "./alumno-aulas-workspace";

function renderWorkspace(state: AlumnoAulasUiState) {
  return renderToStaticMarkup(<AlumnoAulasWorkspace runInitialFetch={false} initialState={state} />);
}

describe("alumno aulas workspace", () => {
  it("resolves loading, empty and success states from classrooms count", () => {
    expect(resolveAlumnoAulasUiState({ isLoading: true, hasError: false, classroomsCount: 0 })).toBe("loading");
    expect(resolveAlumnoAulasUiState({ isLoading: false, hasError: false, classroomsCount: 0 })).toBe("empty");
    expect(resolveAlumnoAulasUiState({ isLoading: false, hasError: false, classroomsCount: 2 })).toBe("success");
  });

  it("renders assigned classrooms cards in success state", () => {
    const html = renderWorkspace({
      uiState: "success",
      classrooms: [
        {
          id: "class-1",
          name: "2A",
          subject: "Matemática",
          enrollmentId: "enr-1"
        }
      ],
      feedback: null,
      selectedClassroomId: "class-1",
      submissionsByActivityId: {},
      selectedActivityId: null,
      submitForm: { content: "" }
    });

    expect(html).toContain("Aulas asignadas");
    expect(html).toContain("2A");
    expect(html).toContain("Matemática");
    expect(html).toContain("Estado: Operativo");
  });

  it("renders empty state message when there are no assigned classrooms", () => {
    const html = renderWorkspace({
      uiState: "empty",
      classrooms: [],
      feedback: null,
      selectedClassroomId: null,
      submissionsByActivityId: {},
      selectedActivityId: null,
      submitForm: { content: "" }
    });

    expect(html).toContain("No tenés aulas asignadas todavía.");
  });

  it("renders activity submit form and pending badge when no submission exists", () => {
    const html = renderWorkspace({
      uiState: "success",
      classrooms: [
        {
          id: "class-1",
          name: "2A",
          subject: "Matemática",
          enrollmentId: "enr-1"
        }
      ],
      feedback: null,
      selectedClassroomId: "class-1",
      selectedActivityId: "activity-1",
      submitForm: { content: "" },
      submissionsByActivityId: {},
      activitiesByClassroomId: {
        "class-1": [
          {
            id: "activity-1",
            classroomId: "class-1",
            title: "TP 1",
            description: "Resolver guía",
            status: "published",
            createdAt: "2026-05-12T10:00:00.000Z"
          }
        ]
      }
    });

    expect(html).toContain("Estado: Pendiente");
    expect(html).toContain("Entregar actividad");
    expect(html).toContain("name=\"submission-content\"");
  });

  it("renders graded status with score and feedback after teacher correction", () => {
    const html = renderWorkspace({
      uiState: "success",
      classrooms: [
        {
          id: "class-1",
          name: "2A",
          subject: "Matemática",
          enrollmentId: "enr-1"
        }
      ],
      feedback: null,
      selectedClassroomId: "class-1",
      selectedActivityId: "activity-1",
      submitForm: { content: "" },
      submissionsByActivityId: {
        "activity-1": {
          id: "submission-1",
          activityId: "activity-1",
          studentId: "student-1",
          content: "Resolución completa",
          status: "graded",
          score: 10,
          feedback: "Excelente argumentación y prolijidad",
          gradedAt: "2026-05-13T09:15:00.000Z",
          gradedByUserId: "teacher-1"
        }
      },
      activitiesByClassroomId: {
        "class-1": [
          {
            id: "activity-1",
            classroomId: "class-1",
            title: "TP 1",
            description: "Resolver guía",
            status: "published",
            createdAt: "2026-05-12T10:00:00.000Z"
          }
        ]
      }
    });

    expect(html).toContain("Estado: Corregida");
    expect(html).toContain("Nota: 10/10");
    expect(html).toContain("Excelente argumentación y prolijidad");
  });

  it("renders submitted status after student delivery before grading", () => {
    const html = renderWorkspace({
      uiState: "success",
      classrooms: [
        {
          id: "class-1",
          name: "2A",
          subject: "Matemática",
          enrollmentId: "enr-1"
        }
      ],
      feedback: null,
      selectedClassroomId: "class-1",
      selectedActivityId: "activity-1",
      submitForm: { content: "" },
      submissionsByActivityId: {
        "activity-1": {
          id: "submission-1",
          activityId: "activity-1",
          studentId: "student-1",
          content: "Resolución completa",
          status: "submitted",
          createdAt: "2026-05-12T11:00:00.000Z"
        }
      },
      activitiesByClassroomId: {
        "class-1": [
          {
            id: "activity-1",
            classroomId: "class-1",
            title: "TP 1",
            description: "Resolver guía",
            status: "published",
            createdAt: "2026-05-12T10:00:00.000Z"
          }
        ]
      }
    });

    expect(html).toContain("Estado: Entregada");
  });
});
