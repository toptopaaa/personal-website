import type { Metadata } from "next";
import type { ReactNode } from "react";

// Halaman admin tidak boleh masuk mesin pencari dan tidak di-cache.
export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

// Halaman admin selalu dirender saat diminta. Datanya milik pemilik, jadi tidak boleh
// dibuat atau di-cache saat build. Tanpa baris ini, build bisa gagal jika env backend belum terpasang.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main id="main" tabIndex={-1} className="min-h-dvh bg-background text-foreground focus:outline-none">
      {children}
    </main>
  );
}
