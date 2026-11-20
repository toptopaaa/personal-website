// Satu-satunya akun yang boleh masuk ke admin. Dipakai di server dan di pengecekan token Google.
export const OWNER_EMAIL = "toptopaaa.id@gmail.com";

export function isOwnerEmail(email: string | null | undefined): boolean {
  return (email ?? "").trim().toLowerCase() === OWNER_EMAIL;
}
