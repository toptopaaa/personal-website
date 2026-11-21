import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasOwnerSession } from "@/lib/auth/access";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await hasOwnerSession()) {
    redirect("/admin");
  }

  const params = await searchParams;
  const hasError = params.error === "1";

  async function loginAction(formData: FormData) {
    "use server";
    const key = String(formData.get("key") || "").trim();
    const validKey = process.env.ADMIN_KEY;

    if (!validKey || key !== validKey) {
      redirect("/admin/login?error=1");
    }

    const cookieStore = await cookies();
    cookieStore.set("toptopaaa_admin", validKey, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form
        action={loginAction}
        className="w-full max-w-sm space-y-4 border border-neutral-800 rounded-2xl p-6 bg-neutral-950"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Masuk Admin TOPTOPAAA</h1>
          <p className="text-sm text-neutral-400">
            Masukkan kode akses admin (tersimpan otomatis 30 hari).
          </p>
        </div>

        {hasError && (
          <p className="text-sm text-red-400">
            Kode akses salah atau ADMIN_KEY belum dipasang di Cloudflare.
          </p>
        )}

        <input
          type="password"
          name="key"
          required
          placeholder="Kode akses admin..."
          className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-white"
        />

        <button
          type="submit"
          className="w-full rounded-full bg-white text-black font-medium py-3 text-sm hover:bg-neutral-200 transition"
        >
          Masuk Otomatis
        </button>
      </form>
    </main>
  );
}
