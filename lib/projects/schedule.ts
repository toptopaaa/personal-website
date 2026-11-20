// Jadwal terbit dan label status. Semua waktu memakai WIB (Asia/Jakarta),
// supaya hasilnya sama walaupun HP atau komputer memakai zona waktu lain.
import type { ProjectStatus } from "@/lib/projects/model";

export const JAKARTA_TIMEZONE = "Asia/Jakarta";
const JAKARTA_OFFSET = "+07:00";

// Nilai dari input datetime-local (WIB) menjadi ISO UTC. Mengembalikan null jika formatnya salah.
export function jakartaInputToIso(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00${JAKARTA_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

// ISO menjadi nilai untuk input datetime-local dalam WIB.
export function isoToJakartaInput(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: JAKARTA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function formatJakarta(iso: string): string {
  const formatted = new Intl.DateTimeFormat("id-ID", {
    timeZone: JAKARTA_TIMEZONE,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
  return `${formatted} WIB`;
}

export type StatusView = { label: string; tone: "draft" | "scheduled" | "live" };

export function statusView(project: { status: ProjectStatus; publishAt: string | null }, now: Date): StatusView {
  if (project.status === "draft") return { label: "Draf", tone: "draft" };
  if (project.status === "scheduled" && project.publishAt && new Date(project.publishAt) > now) {
    return { label: `Dijadwalkan · ${formatJakarta(project.publishAt)}`, tone: "scheduled" };
  }
  return { label: "Terbit", tone: "live" };
}
