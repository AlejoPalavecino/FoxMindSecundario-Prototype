import { describe, expect, it } from "vitest";
import {
  getDashboardQuickActions,
  getDefaultPathByRole,
  getRoleNavigation,
  getRoleShellMeta,
  isRoleNavItemActive,
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

  it("keeps all docente and alumno sections enabled", () => {
    const docente = getRoleNavigation("DOCENTE");
    const alumno = getRoleNavigation("ALUMNO");

    expect(docente.items.filter((item) => item.enabled).map((item) => item.href)).toEqual([
      "/docente",
      "/docente/aulas",
      "/docente/agenda",
      "/docente/progreso",
      "/docente/copiloto",
      "/docente/configuracion"
    ]);
    expect(alumno.items.filter((item) => item.enabled).map((item) => item.href)).toEqual([
      "/alumno",
      "/alumno/aulas",
      "/alumno/estudia",
      "/alumno/progreso",
      "/alumno/configuracion"
    ]);
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

  it("marks active navigation items for nested subroutes", () => {
    expect(isRoleNavItemActive("/docente", "/docente")).toBe(true);
    expect(isRoleNavItemActive("/docente/aulas", "/docente/aulas/123")).toBe(true);
    expect(isRoleNavItemActive("/docente", "/docente/aulas")).toBe(false);
    expect(isRoleNavItemActive("/alumno/progreso", "/alumno/progreso?tab=semanal")).toBe(true);
    expect(isRoleNavItemActive("/alumno/progreso", "/alumno/progreso-avanzado")).toBe(false);
  });

  it("returns dashboard quick actions from enabled role navigation", () => {
    expect(getDashboardQuickActions("DOCENTE").map((item) => item.href)).toEqual([
      "/docente/aulas",
      "/docente/agenda",
      "/docente/progreso"
    ]);
    expect(getDashboardQuickActions("ALUMNO").map((item) => item.href)).toEqual([
      "/alumno/aulas",
      "/alumno/estudia",
      "/alumno/progreso"
    ]);
  });
});
