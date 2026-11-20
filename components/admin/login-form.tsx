"use client";

export function LoginForm({ errorCode }: { errorCode?: string }) {
  return (
    <div>
      <a
        href="/admin"
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        Masuk melalui Cloudflare Access
      </a>
      {errorCode && (
        <p role="status" aria-live="polite" className="mt-4 min-h-6 text-sm text-muted">
          {errorCode === "unauthorized" ? "Akun ini tidak diizinkan masuk." : "Autentikasi tidak berhasil."}
        </p>
      )}
    </div>
  );
}
