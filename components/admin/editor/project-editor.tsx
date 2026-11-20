"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ChangeEvent } from "react";
import {
  deleteProjectAction,
  saveProjectAction,
  setProjectStatusAction,
} from "@/app/admin/actions";
import { BlocksSection } from "@/components/admin/editor/blocks-section";
import { CoverSection } from "@/components/admin/editor/cover-section";
import { Field, FormGroup, inputClass, primaryButtonClass } from "@/components/admin/editor/form-fields";
import { PublishPanel } from "@/components/admin/editor/publish-panel";
import { StatusPill } from "@/components/admin/status-pill";
import { isoToJakartaInput, statusView } from "@/lib/projects/schedule";
import {
  LIMITS,
  slugify,
  type ActionResult,
  type Block,
  type Project,
  type ProjectFormInput,
} from "@/lib/projects/model";

const TEMP_SLUG_PREFIX = "proyek-";

type Notice = { tone: "ok" | "error"; text: string } | null;

function toFormInput(project: Project): ProjectFormInput {
  return {
    slug: project.slug,
    title: project.title,
    client: project.client,
    year: project.year,
    category: project.category,
    role: project.role,
    summary: project.summary,
    deliverablesText: project.deliverables.join("\n"),
    steps: Array.from({ length: LIMITS.steps }, (_, index) => project.process[index] ?? { title: "", body: "" }),
    result: project.result,
    coverAlt: project.coverAlt,
    blocks: project.blocks,
  };
}

export function ProjectEditor({ project }: { project: Project }) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormInput>(() => toFormInput(project));
  const [slugTouched, setSlugTouched] = useState(!project.slug.startsWith(TEMP_SLUG_PREFIX));
  const [scheduleAt, setScheduleAt] = useState(() =>
    project.status === "scheduled" && project.publishAt ? isoToJakartaInput(project.publishAt) : "",
  );
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, startTransition] = useTransition();
  const view = statusView(project, new Date());

  function patch(changes: Partial<ProjectFormInput>) {
    setForm((current) => ({ ...current, ...changes }));
  }

  // Selama slug belum diubah manual, slug mengikuti judul.
  function handleTitle(event: ChangeEvent<HTMLInputElement>) {
    const title = event.target.value;
    setForm((current) => ({
      ...current,
      title,
      slug: slugTouched ? current.slug : slugify(title) || current.slug,
    }));
  }

  function handleSlug(event: ChangeEvent<HTMLInputElement>) {
    setSlugTouched(true);
    patch({ slug: event.target.value });
  }

  function updateStep(index: number, key: "title" | "body", value: string) {
    setForm((current) => ({
      ...current,
      steps: current.steps.map((step, stepIndex) => (stepIndex === index ? { ...step, [key]: value } : step)),
    }));
  }

  function setBlocks(update: (current: Block[]) => Block[]) {
    setForm((current) => ({ ...current, blocks: update(current.blocks) }));
  }

  function runAction(task: () => Promise<ActionResult>) {
    setNotice(null);
    startTransition(async () => {
      const result = await task();
      setNotice(result.ok ? { tone: "ok", text: result.message } : { tone: "error", text: result.error });
      if (result.ok) router.refresh();
    });
  }

  // Semua aksi penerbitan menyimpan isian terbaru dulu, supaya tidak ada perubahan yang hilang.
  const saveOnly = () => runAction(() => saveProjectAction(project.id, form));

  const publishNow = () =>
    runAction(async () => {
      const saved = await saveProjectAction(project.id, form);
      return saved.ok ? setProjectStatusAction(project.id, "publish") : saved;
    });

  const scheduleLater = () => {
    if (!scheduleAt) {
      setNotice({ tone: "error", text: "Pilih tanggal dan jam jadwal dulu." });
      return;
    }
    runAction(async () => {
      const saved = await saveProjectAction(project.id, form);
      return saved.ok ? setProjectStatusAction(project.id, "schedule", scheduleAt) : saved;
    });
  };

  const moveToDraft = () => runAction(() => setProjectStatusAction(project.id, "draft"));

  function removeProject() {
    if (!window.confirm("Hapus project ini beserta semua gambarnya? Tindakan ini tidak bisa dibatalkan.")) return;
    startTransition(async () => {
      const result = await deleteProjectAction(project.id);
      if (!result.ok) setNotice({ tone: "error", text: result.error });
    });
  }

  return (
    <div className="mx-auto w-full max-w-[600px] px-5 pt-6 pb-40 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin" className="inline-flex min-h-11 items-center text-sm text-muted hover:text-foreground">
          ← Semua karya
        </Link>
        <Link
          href={`/admin/preview/${project.id}`}
          className="inline-flex min-h-11 items-center text-sm underline decoration-1 underline-offset-4 hover:decoration-accent"
        >
          Lihat pratinjau
        </Link>
      </div>

      <div className="mt-4">
        <StatusPill view={view} />
      </div>

      <FormGroup title="Cover">
        <CoverSection
          projectId={project.id}
          coverUrl={project.coverUrl}
          coverAlt={form.coverAlt}
          onCoverAltChange={(value) => patch({ coverAlt: value })}
        />
      </FormGroup>

      <FormGroup title="Detail">
        <Field id="title" label="Judul">
          <input id="title" className={inputClass} value={form.title} maxLength={LIMITS.title} onChange={handleTitle} />
        </Field>
        <Field id="slug" label="Alamat halaman" hint={`Tampil sebagai /work/${form.slug || "..."}`}>
          <input id="slug" className={inputClass} value={form.slug} maxLength={LIMITS.slug} onChange={handleSlug} />
        </Field>
        <Field id="client" label="Client">
          <input id="client" className={inputClass} value={form.client} maxLength={LIMITS.client} onChange={(event) => patch({ client: event.target.value })} />
        </Field>
        <Field id="year" label="Year">
          <input id="year" className={inputClass} value={form.year} maxLength={LIMITS.year} onChange={(event) => patch({ year: event.target.value })} />
        </Field>
        <Field id="category" label="Category">
          <input id="category" className={inputClass} value={form.category} maxLength={LIMITS.category} onChange={(event) => patch({ category: event.target.value })} />
        </Field>
        <Field id="role" label="My role">
          <input id="role" className={inputClass} value={form.role} maxLength={LIMITS.role} onChange={(event) => patch({ role: event.target.value })} />
        </Field>
      </FormGroup>

      <FormGroup title="Overview dan deliverables">
        <Field id="summary" label="Overview" hint={`Maksimal ${LIMITS.summary} karakter.`}>
          <textarea id="summary" rows={5} className={inputClass} value={form.summary} maxLength={LIMITS.summary} onChange={(event) => patch({ summary: event.target.value })} />
        </Field>
        <Field id="deliverables" label="Deliverables" hint="Satu baris untuk satu item. Maksimal 12 baris.">
          <textarea id="deliverables" rows={6} className={inputClass} value={form.deliverablesText} onChange={(event) => patch({ deliverablesText: event.target.value })} />
        </Field>
      </FormGroup>

      <BlocksSection
        projectId={project.id}
        blocks={form.blocks}
        onBlocksChange={setBlocks}
      />

      <FormGroup title="Process (opsional, maksimal 3 langkah)">
        {form.steps.map((step, index) => (
          <div key={index} className="rounded-2xl border border-line p-4">
            <p className="font-mono text-xs text-muted uppercase tracking-[0.08em]">Langkah {index + 1}</p>
            <Field id={`step-${index}-title`} label="Judul langkah">
              <input id={`step-${index}-title`} className={inputClass} value={step.title} maxLength={LIMITS.stepTitle} onChange={(event) => updateStep(index, "title", event.target.value)} />
            </Field>
            <Field id={`step-${index}-body`} label="Isi langkah">
              <textarea id={`step-${index}-body`} rows={3} className={inputClass} value={step.body} maxLength={LIMITS.stepBody} onChange={(event) => updateStep(index, "body", event.target.value)} />
            </Field>
          </div>
        ))}
      </FormGroup>

      <FormGroup title="Hasil (opsional)">
        <Field id="result" label="Result" hint="Isi hanya dengan hasil yang bisa dibuktikan.">
          <textarea id="result" rows={2} className={inputClass} value={form.result} maxLength={LIMITS.result} onChange={(event) => patch({ result: event.target.value })} />
        </Field>
      </FormGroup>

      <PublishPanel
        status={project.status}
        scheduleAt={scheduleAt}
        pending={pending}
        onScheduleChange={setScheduleAt}
        onPublish={publishNow}
        onSchedule={scheduleLater}
        onDraft={moveToDraft}
        onDelete={removeProject}
      />

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-background/95 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex w-full max-w-[600px] items-center gap-3">
          <p
            role="status"
            aria-live="polite"
            className={`min-w-0 flex-1 truncate text-sm ${notice?.tone === "error" ? "text-red-600" : "text-muted"}`}
          >
            {pending ? "Menyimpan…" : notice?.text ?? "Perubahan belum tersimpan sampai kamu menekan Simpan."}
          </p>
          <button type="button" onClick={saveOnly} disabled={pending} className={primaryButtonClass}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
