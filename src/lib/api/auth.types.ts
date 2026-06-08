export type AuthRole = "student" | "instructor";

export type AuthProfile = {
  full_name?: string;
  avatar_url?: string;
  bio?: string;
};

export type AuthUser = {
  id?: string;
  _id?: string;
  email?: string;
  accountType?: string;
  profile?: AuthProfile;
};

export type AuthInstructor = {
  id?: string;
  _id?: string;
  email?: string;
  name?: string;
  photo?: string;
  bio?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullname: string;
  email: string;
  password: string;
};

export type StudentLoginResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type InstructorLoginResponse = {
  instructor: AuthInstructor;
  accessToken: string;
  refreshToken: string;
};

export type AuthSession = {
  role: AuthRole;
  accessToken: string;
  refreshToken: string;
  email: string;
  displayName: string;
  initials: string;
  userId?: string;
};
