import { api } from "@/api/http";
import type {
  AuthRole,
  AuthSession,
  InstructorLoginResponse,
  LoginPayload,
  RegisterPayload,
  StudentLoginResponse,
} from "@/lib/api/auth.types";
import { initialsFromName } from "@/lib/auth/session";

const USER_LOGIN = "/users/login";
const USER_REGISTER = "/users/register";
const INSTRUCTOR_LOGIN = "/instructor/login";

function sessionFromStudent(data: StudentLoginResponse): AuthSession {
  const name = data.user.profile?.full_name?.trim() || data.user.email || "Student";
  return {
    role: "student",
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    email: data.user.email ?? "",
    displayName: name,
    initials: initialsFromName(name),
    userId: String(data.user.id ?? data.user._id ?? ""),
  };
}

function sessionFromInstructor(data: InstructorLoginResponse): AuthSession {
  const name = data.instructor.name?.trim() || data.instructor.email || "Instructor";
  return {
    role: "instructor",
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    email: data.instructor.email ?? "",
    displayName: name,
    initials: initialsFromName(name),
    userId: String(data.instructor.id ?? data.instructor._id ?? ""),
  };
}

export async function login(role: AuthRole, payload: LoginPayload): Promise<AuthSession> {
  if (role === "instructor") {
    const data = await api.post<InstructorLoginResponse>(INSTRUCTOR_LOGIN, payload, { auth: false });
    return sessionFromInstructor(data);
  }

  const data = await api.post<StudentLoginResponse>(USER_LOGIN, payload, { auth: false });
  return sessionFromStudent(data);
}

export async function registerStudent(payload: RegisterPayload): Promise<string> {
  const data = await api.post<{ message?: string }>(
    USER_REGISTER,
    {
      fullname: payload.fullname.trim(),
      email: payload.email.trim(),
      password: payload.password,
    },
    { auth: false }
  );
  return data.message ?? "Registration successful";
}
