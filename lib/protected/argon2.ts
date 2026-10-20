const ARGON2ID_PATTERN =
  /^\$argon2id\$v=19\$m=(\d+),t=(\d+),p=(\d+)\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/;

export function isAcceptableArgon2id(hash: string): boolean {
  const match = ARGON2ID_PATTERN.exec(hash);
  if (!match) return false;

  const memoryCost = Number(match[1]);
  const timeCost = Number(match[2]);
  const parallelism = Number(match[3]);

  return memoryCost >= 19456 && timeCost >= 2 && parallelism >= 1;
}
