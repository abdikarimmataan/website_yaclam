export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[!-~]{6,}$/;

export const PASSWORD_MESSAGE =
  "Password must be 6+ chars with upper, lower, number, and special character";

export const REGISTER_FIELDS = [
  { key: "fullname", label: "Full name" },
  { key: "email", label: "Email address" },
  { key: "password", label: "Password" },
] as const;

export function validateRegisterForm(values: {
  fullname: string;
  email: string;
  password: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  const fullname = values.fullname.trim();
  const email = values.email.trim();
  const password = values.password;

  if (!fullname) errors.fullname = "Full name is required";
  if (!email) errors.email = "Email address is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }
  if (!password) errors.password = "Password is required";
  else if (!PASSWORD_PATTERN.test(password)) errors.password = PASSWORD_MESSAGE;

  return errors;
}
