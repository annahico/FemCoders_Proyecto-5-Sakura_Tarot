// Client-side password hashing.
//
// There's no real backend here (mockapi.io is a passive REST mock, it
// can't run server-side code), so this can't be genuine
// bcrypt-on-the-server hashing — that's the only fully correct answer.
// What this *does* fix: the plaintext password no longer travels over
// the wire or sits in the public mockapi.io response for GET /users.
// Each user gets a random salt; the stored value is
// SHA-256(password + salt), never the raw password.
//
// This is still weaker than server-side hashing with a slow algorithm
// (bcrypt/argon2) — SHA-256 is fast, so a leaked hash+salt pair is
// crackable by brute force given enough compute. Treat this as
// "don't leak passwords in plaintext", not as production-grade auth.

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const generateSalt = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
};

export const hashPassword = async (password, salt) => {
  const data = new TextEncoder().encode(password + salt);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
};
