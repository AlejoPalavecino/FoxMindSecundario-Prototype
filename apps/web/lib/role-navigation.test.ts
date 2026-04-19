import { describe, expect, it } from "vitest";
import {
  getDefaultPathByRole,
  getRoleNavigation,
  getRoleShellMeta,
  type RoleNavigationKey
} from "./role-navigation";

describe("role-navigation", () => {
  it("returns a docente menu with all expected sections", () => {
    const nav = getRoleNavigation("DOCENTE");
    const keys: RoleNavigationKey[] = nav.items.map((item) => item.key);

    expect(nav.role).toBe("DOCENTE");
    expect(keys).toEqual([
      "dashboard",
      "aulas",
      "agenda",
      "progreso",
      "copiloto",
      "configuracion"
    ]);
  });

  it("returns an alumno menu with all expected sections", () => {
    const nav = getRoleNavigation("ALUMNO");
    const keys: RoleNavigationKey[] = nav.items.map((item) => item.key);

    expect(nav.role).toBe("ALUMNO");
    expect(keys).toEqual(["dashboard", "aulas", "estudia", "mi-progreso", "configuracion"]);
  });

  it("marks only currently available shell routes as enabled", () => {
    const docente = getRoleNavigation("DOCENTE");
    const alumno = getRoleNavigation("ALUMNO");

    expect(docente.items.filter((item) => item.enabled).map((item) => item.href)).toEqual(["/docente"]);
    expect(alumno.items.filter((item) => item.enabled).map((item) => item.href)).toEqual(["/alumno"]);
  });

  it("returns role shell metadata and default path by role", () => {
    expect(getRoleShellMeta("DOCENTE")).toEqual({
      role: "DOCENTE",
      title: "Panel Docente",
      subtitle: "Gestioná aulas, agenda y progreso desde un solo lugar.",
      accent: "docente"
    });
    expect(getRoleShellMeta("ALUMNO")).toEqual({
      role: "ALUMNO",
      title: "Panel Alumno",
      subtitle: "Seguí tus aulas, estudiá y revisá tu avance.",
      accent: "alumno"
    });

    expect(getDefaultPathByRole("DOCENTE")).toBe("/docente");
    expect(getDefaultPathByRole("ALUMNO")).toBe("/alumno");
  });
});
