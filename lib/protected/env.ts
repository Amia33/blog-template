export const MIN_SECRET_LENGTH = 32;

export function getProtectedSecret(): string | null {
  const value = process.env.PROTECTED_SESSION_SECRET;

  if (typeof value !== "string" || value.trim().length < MIN_SECRET_LENGTH) {
    return null;
  }

  return value;
}

export function isProtectedConfigured(): boolean {
  return getProtectedSecret() !== null;
}
