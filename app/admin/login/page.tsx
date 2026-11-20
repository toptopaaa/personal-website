import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { hasOwnerSession } from "@/lib/auth/owner";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await hasOwnerSession()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-[400px] flex-col justify-center px-5 py-16">
      <h1 className="name-heading">Masuk</h1>
      <p className="mt-2 text-sm text-muted">Link masuk akan dikirim ke email pemilik situs.</p>
      <div className="mt-8">
        <LoginForm errorCode={error} />
      </div>
    </section>
  );
}
