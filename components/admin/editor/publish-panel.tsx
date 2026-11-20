import { FormGroup, outlineButtonClass, primaryButtonClass, smallButtonClass, inputClass } from "@/components/admin/editor/form-fields";
import type { ProjectStatus } from "@/lib/projects/model";

type PublishPanelProps = {
  status: ProjectStatus;
  scheduleAt: string;
  pending: boolean;
  onScheduleChange: (value: string) => void;
  onPublish: () => void;
  onSchedule: () => void;
  onDraft: () => void;
  onDelete: () => void;
};

// Tombol penerbitan. Isian terbaru selalu disimpan dulu sebelum status berubah.
export function PublishPanel({
  status,
  scheduleAt,
  pending,
  onScheduleChange,
  onPublish,
  onSchedule,
  onDraft,
  onDelete,
}: PublishPanelProps) {
  return (
    <FormGroup title="Penerbitan">
      <div className="space-y-4">
        {status !== "published" && (
          <button type="button" onClick={onPublish} disabled={pending} className={`${primaryButtonClass} w-full`}>
            Terbitkan sekarang
          </button>
        )}

        <div className="rounded-2xl border border-line p-4">
          <label htmlFor="schedule" className="text-sm font-medium">
            Jadwalkan terbit
          </label>
          <p className="mt-1 text-sm text-muted">Waktu memakai WIB (Asia/Jakarta).</p>
          <input
            id="schedule"
            type="datetime-local"
            value={scheduleAt}
            onChange={(event) => onScheduleChange(event.target.value)}
            className={inputClass}
          />
          <button type="button" onClick={onSchedule} disabled={pending} className={`${outlineButtonClass} mt-3 w-full`}>
            Simpan jadwal
          </button>
        </div>

        {status !== "draft" && (
          <button type="button" onClick={onDraft} disabled={pending} className={`${outlineButtonClass} w-full`}>
            Jadikan draf (sembunyikan dari publik)
          </button>
        )}

        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className={`${smallButtonClass} w-full border-transparent text-red-600 hover:bg-surface-2`}
        >
          Hapus project
        </button>
      </div>
    </FormGroup>
  );
}
