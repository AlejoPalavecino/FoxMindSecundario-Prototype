import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  DocenteAulasWorkspace,
  type DocenteAulasUiState,
  resolveUiState
} from "./docente-aulas-workspace";

function renderWorkspace(state: DocenteAulasUiState) {
  return renderToStaticMarkup(
    <DocenteAulasWorkspace runInitialFetch={false} initialState={state} />
  );
}

describe("docente aulas workspace", () => {
  it("resolves loading, empty and success states from classrooms count", () => {
    expect(resolveUiState({ isLoading: true, hasError: false, classroomsCount: 0 })).toBe("loading");
    expect(resolveUiState({ isLoading: false, hasError: false, classroomsCount: 0 })).toBe("empty");
    expect(resolveUiState({ isLoading: false, hasError: false, classroomsCount: 2 })).toBe("success");
  });

  it("renders create, edit and enrollment forms in success mode", () => {
    const html = renderWorkspace({
      uiState: "success",
      classrooms: [{ id: "class-1", name: "2A", subject: "Matemática", studentIds: [] }],
      selectedClassroomId: "class-1",
      createForm: { name: "", subject: "" },
      editForm: { name: "2A", subject: "Matemática" },
      enrollmentForm: { studentId: "" },
      csvForm: { fileName: "", csvContent: "" },
      csvReport: null,
      feedback: null
    });

    expect(html).toContain("Crear aula");
    expect(html).toContain("Editar aula");
    expect(html).toContain("Alta manual de alumno");
    expect(html).toContain("name=\"studentId\"");
    expect(html).toContain("Estado: Operativo");
  });

  it("renders warning feedback for duplicate enrollment response", () => {
    const html = renderWorkspace({
      uiState: "success",
      classrooms: [{ id: "class-1", name: "2A", subject: "Matemática", studentIds: ["student-1"] }],
      selectedClassroomId: "class-1",
      createForm: { name: "", subject: "" },
      editForm: { name: "2A", subject: "Matemática" },
      enrollmentForm: { studentId: "student-1" },
      csvForm: { fileName: "", csvContent: "" },
      csvReport: null,
      feedback: {
        tone: "warning",
        message: "El alumno ya estaba enrolado en esta aula."
      }
    });

    expect(html).toContain("Estado: Atención");
    expect(html).toContain("El alumno ya estaba enrolado en esta aula.");
  });

  it("renders csv import report with row-level errors", () => {
    const html = renderWorkspace({
      uiState: "success",
      classrooms: [{ id: "class-1", name: "2A", subject: "Matemática", studentIds: [] }],
      selectedClassroomId: "class-1",
      createForm: { name: "", subject: "" },
      editForm: { name: "2A", subject: "Matemática" },
      enrollmentForm: { studentId: "" },
      csvForm: { fileName: "alumnos.csv", csvContent: "email,fullName" },
      csvReport: {
        processed: 2,
        createdUsers: 1,
        createdEnrollments: 1,
        errors: [
          {
            line: 3,
            code: "DUPLICATE_ENROLLMENT",
            message: "El alumno ya estaba enrolado en esta aula"
          }
        ]
      },
      feedback: {
        tone: "warning",
        message: "Importación finalizada con observaciones."
      }
    });

    expect(html).toContain("Importar CSV");
    expect(html).toContain("alumnos.csv");
    expect(html).toContain("Filas procesadas: 2");
    expect(html).toContain("Línea 3");
    expect(html).toContain("DUPLICATE_ENROLLMENT");
  });
});
