export interface TeacherClassroom {
  id: string;
  name: string;
  subject: string;
  students: ClassroomRosterRow[];
}

export interface CreateClassroomPayload {
  name: string;
  subject: string;
}

export interface UpdateClassroomPayload {
  name: string;
  subject: string;
}

export interface CreateEnrollmentPayload {
  studentId: string;
}

export interface CreateEnrollmentResponse {
  created: boolean;
  enrollmentId: string;
}

export interface ImportEnrollmentsCsvPayload {
  csvContent: string;
}

export interface CsvImportError {
  line: number;
  code: string;
  message: string;
}

export interface ImportEnrollmentsCsvResponse {
  processed: number;
  createdUsers: number;
  createdEnrollments: number;
  errors: CsvImportError[];
}

export interface StudentClassroom {
  id: string;
  name: string;
  subject: string;
  enrollmentId: string;
}

export interface EnrollmentNotice {
  tone: "success" | "warning";
  message: string;
}

export interface ClassroomRosterRow {
  studentId: string;
  email?: string;
  fullName?: string;
  status?: string;
}

interface ExportClassroomRosterDeps {
  createBlobUrl: (csv: string) => string;
  triggerDownload: (blobUrl: string, fileName: string) => void;
  revokeBlobUrl: (blobUrl: string) => void;
}

interface ExportClassroomRosterInput {
  classroomName: string;
  rows: ClassroomRosterRow[];
  onNoData?: () => void;
  deps?: ExportClassroomRosterDeps;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

class ApiClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiClientError";
  }
}

interface RequestJsonOptions {
  fallbackToEmptyOn404?: boolean;
}

export async function fetchTeacherClassrooms(): Promise<TeacherClassroom[]> {
  return requestJson<TeacherClassroom[]>("/classrooms", { method: "GET" });
}

export async function createClassroom(payload: CreateClassroomPayload): Promise<TeacherClassroom> {
  return requestJson<TeacherClassroom>("/classrooms", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateClassroom(
  classroomId: string,
  payload: UpdateClassroomPayload
): Promise<TeacherClassroom> {
  return requestJson<TeacherClassroom>(`/classrooms/${classroomId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function createEnrollment(
  classroomId: string,
  payload: CreateEnrollmentPayload
): Promise<CreateEnrollmentResponse> {
  return requestJson<CreateEnrollmentResponse>(`/classrooms/${classroomId}/enrollments`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function importEnrollmentsCsv(
  classroomId: string,
  payload: ImportEnrollmentsCsvPayload
): Promise<ImportEnrollmentsCsvResponse> {
  return requestJson<ImportEnrollmentsCsvResponse>(`/classrooms/${classroomId}/enrollments/csv`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchStudentClassrooms(): Promise<StudentClassroom[]> {
  return requestJson<StudentClassroom[]>("/student/classrooms", { method: "GET" });
}

export function resolveEnrollmentNotice(result: CreateEnrollmentResponse): EnrollmentNotice {
  if (!result.created) {
    return {
      tone: "warning",
      message: "El alumno ya estaba enrolado en esta aula."
    };
  }

  return {
    tone: "success",
    message: "Alumno enrolado correctamente."
  };
}

export function buildClassroomRosterCsv(rows: ClassroomRosterRow[]): string {
  const header = "studentId,email,fullName,status";
  const lines = rows.map((row) => {
    return [
      sanitizeCsvCell(row.studentId),
      sanitizeCsvCell(row.email),
      sanitizeCsvCell(row.fullName),
      sanitizeCsvCell(row.status)
    ].join(",");
  });

  return [header, ...lines].join("\n");
}

export function exportClassroomRosterCsv(input: ExportClassroomRosterInput): boolean {
  if (input.rows.length === 0) {
    input.onNoData?.();
    return false;
  }

  const deps = input.deps ?? browserExportDeps();
  if (!deps) {
    return false;
  }

  const csv = buildClassroomRosterCsv(input.rows);
  const blobUrl = deps.createBlobUrl(csv);
  const fileName = `${slugifyFileName(input.classroomName)}-alumnos.csv`;

  deps.triggerDownload(blobUrl, fileName);
  deps.revokeBlobUrl(blobUrl);
  return true;
}

async function requestJson<T>(
  path: string,
  init: RequestInit,
  options: RequestJsonOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, withAuth(init));

  if (options.fallbackToEmptyOn404 && response.status === 404) {
    return [] as T;
  }

  if (!response.ok) {
    throw new ApiClientError(await resolveErrorMessage(response));
  }

  return (await response.json()) as T;
}

function withAuth(init: RequestInit): RequestInit {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  const token = readCookie("foxmind_access_token");
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return {
    ...init,
    headers
  };
}

async function resolveErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: unknown };
    if (typeof body.message === "string" && body.message.trim().length > 0) {
      return body.message;
    }
  } catch {
    return "No se pudo completar la operación de aulas.";
  }

  return "No se pudo completar la operación de aulas.";
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const chunks = document.cookie.split(";");
  for (const chunk of chunks) {
    const [rawKey, ...rest] = chunk.trim().split("=");
    if (rawKey === name) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return null;
}

function sanitizeCsvCell(value: string | undefined): string {
  const base = (value ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (/[",\n]/.test(base)) {
    return `"${base.replace(/"/g, '""')}"`;
  }

  return base;
}

function browserExportDeps(): ExportClassroomRosterDeps | null {
  if (typeof document === "undefined" || typeof URL === "undefined") {
    return null;
  }

  return {
    createBlobUrl(csv: string) {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      return URL.createObjectURL(blob);
    },
    triggerDownload(blobUrl: string, fileName: string) {
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = fileName;
      anchor.click();
    },
    revokeBlobUrl(blobUrl: string) {
      URL.revokeObjectURL(blobUrl);
    }
  };
}

function slugifyFileName(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "aula";
}
