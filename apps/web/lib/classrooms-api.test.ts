import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createClassroom,
  createEnrollment,
  fetchStudentClassrooms,
  fetchTeacherClassrooms,
  importEnrollmentsCsv,
  resolveEnrollmentNotice,
  updateClassroom
} from "./classrooms-api";

describe("classrooms api", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("falls back to empty list when classrooms listing endpoint is unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ message: "Not Found" })
      })
    );

    const classrooms = await fetchTeacherClassrooms();

    expect(classrooms).toEqual([]);
  });

  it("creates a classroom with the expected POST contract", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "class-1", name: "2A", subject: "Matemática" })
    });
    vi.stubGlobal("fetch", fetchMock);

    const classroom = await createClassroom({ name: "2A", subject: "Matemática" });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/classrooms",
      expect.objectContaining({
        method: "POST"
      })
    );
    expect(classroom).toMatchObject({ id: "class-1", name: "2A", subject: "Matemática" });
  });

  it("updates a classroom with PATCH contract", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "class-1", name: "2A Actualizada", subject: "Historia" })
    });
    vi.stubGlobal("fetch", fetchMock);

    const classroom = await updateClassroom("class-1", {
      name: "2A Actualizada",
      subject: "Historia"
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/classrooms/class-1",
      expect.objectContaining({
        method: "PATCH"
      })
    );
    expect(classroom.subject).toBe("Historia");
  });

  it("returns duplicate enrollment notice when API responds created false", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ created: false, enrollmentId: "enroll-1" })
      })
    );

    const result = await createEnrollment("class-1", { studentId: "student-1" });

    expect(result.created).toBe(false);
    expect(resolveEnrollmentNotice(result)).toMatchObject({ tone: "warning" });
  });

  it("imports enrollments csv and returns row-level errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        processed: 2,
        createdUsers: 1,
        createdEnrollments: 1,
        errors: [{ line: 3, code: "DUPLICATE_ENROLLMENT", message: "duplicado" }]
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await importEnrollmentsCsv("class-1", {
      csvContent: "email,fullName\nstudent@foxmind.app,Alumno Uno"
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/classrooms/class-1/enrollments/csv",
      expect.objectContaining({
        method: "POST"
      })
    );
    expect(result.errors).toEqual([
      {
        line: 3,
        code: "DUPLICATE_ENROLLMENT",
        message: "duplicado"
      }
    ]);
  });

  it("fetches classrooms assigned to student", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ id: "class-1", name: "2A", subject: "Matemática", enrollmentId: "enr-1" }]
      })
    );

    const classrooms = await fetchStudentClassrooms();

    expect(classrooms).toEqual([
      {
        id: "class-1",
        name: "2A",
        subject: "Matemática",
        enrollmentId: "enr-1"
      }
    ]);
  });
});
