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
      feedback: null
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
      feedback: null
    });

    expect(html).toContain("No tenés aulas asignadas todavía.");
  });
});
