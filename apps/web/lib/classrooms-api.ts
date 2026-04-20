export interface TeacherClassroom {
  id: string;
  name: string;
  subject: string;
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

export interface EnrollmentNotice {
  tone: "success" | "warning";
  message: string;
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
  return requestJson<TeacherClassroom[]>("/classrooms", { method: "GET" }, { fallbackToEmptyOn404: true });
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
