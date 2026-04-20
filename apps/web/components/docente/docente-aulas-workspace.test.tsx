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
      feedback: {
        tone: "warning",
        message: "El alumno ya estaba enrolado en esta aula."
      }
    });

    expect(html).toContain("Estado: Atención");
    expect(html).toContain("El alumno ya estaba enrolado en esta aula.");
  });
});
