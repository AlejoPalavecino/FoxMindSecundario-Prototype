import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildClassroomRosterCsv,
  createClassroom,
  createEnrollment,
  exportClassroomRosterCsv,
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

  it("fetches teacher classrooms with roster data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: "class-1",
            name: "2A",
            subject: "Matemática",
            students: [
              {
                studentId: "student-1",
                email: "uno@foxmind.app",
                fullName: "Alumno Uno",
                status: "active"
              }
            ]
          }
        ]
      })
    );

    const classrooms = await fetchTeacherClassrooms();

    expect(classrooms).toEqual([
      {
        id: "class-1",
        name: "2A",
        subject: "Matemática",
        students: [
          {
            studentId: "student-1",
            email: "uno@foxmind.app",
            fullName: "Alumno Uno",
            status: "active"
          }
        ]
      }
    ]);
  });

  it("creates a classroom with the expected POST contract", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "class-1", name: "2A", subject: "Matemática", students: [] })
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
      json: async () => ({ id: "class-1", name: "2A Actualizada", subject: "Historia", students: [] })
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

  it("builds classroom roster csv payload with stable header order", () => {
    const csv = buildClassroomRosterCsv([
      { studentId: "student-1", email: "uno@foxmind.app", fullName: "Alumno Uno", status: "active" },
      { studentId: "student-2", email: "", fullName: "", status: "" }
    ]);

    expect(csv).toBe(
      "studentId,email,fullName,status\nstudent-1,uno@foxmind.app,Alumno Uno,active\nstudent-2,,,"
    );
  });

  it("triggers roster csv export download action when selected classroom has students", () => {
    const triggerDownload = vi.fn();
    const createBlobUrl = vi.fn().mockReturnValue("blob://roster");
    const revokeBlobUrl = vi.fn();

    const exported = exportClassroomRosterCsv({
      classroomName: "2A Matemática",
      rows: [{ studentId: "student-1", email: "uno@foxmind.app", fullName: "Alumno Uno", status: "" }],
      deps: {
        createBlobUrl,
        triggerDownload,
        revokeBlobUrl
      }
    });

    expect(exported).toBe(true);
    expect(createBlobUrl).toHaveBeenCalledWith(
      "studentId,email,fullName,status\nstudent-1,uno@foxmind.app,Alumno Uno,"
    );
    expect(triggerDownload).toHaveBeenCalledWith("blob://roster", "2a-matematica-alumnos.csv");
    expect(revokeBlobUrl).toHaveBeenCalledWith("blob://roster");
  });

  it("skips roster csv export and calls no-data callback when classroom has no students", () => {
    const triggerDownload = vi.fn();
    const onNoData = vi.fn();

    const exported = exportClassroomRosterCsv({
      classroomName: "2A Matemática",
      rows: [],
      onNoData,
      deps: {
        createBlobUrl: vi.fn(),
        triggerDownload,
        revokeBlobUrl: vi.fn()
      }
    });

    expect(exported).toBe(false);
    expect(onNoData).toHaveBeenCalledTimes(1);
    expect(triggerDownload).not.toHaveBeenCalled();
  });
});
