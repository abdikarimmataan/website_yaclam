export function contactCardHref(key: string, description: string): string | null {
  const value = description.trim();
  if (!value) return null;

  if (key === "email") {
    const email = value.replace(/^mailto:/i, "").trim();
    return email.includes("@") ? `mailto:${email}` : null;
  }

  if (key === "phone") {
    const digits = value.replace(/[^\d+]/g, "");
    return digits.length >= 6 ? `tel:${digits}` : null;
  }

  return null;
}
