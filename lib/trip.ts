import { addDays, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type {
  BudgetCategory,
  DocumentCategory,
  PackingCategory,
  TaskCategory,
} from "@/lib/types";

/** Fecha (YYYY-MM-DD) del día N del itinerario a partir de la fecha de salida. */
export function dayDate(startDate: string, dayNumber: number): Date {
  return addDays(parseISO(startDate), dayNumber - 1);
}

/** "lun, 1 oct" */
export function formatShort(date: Date): string {
  return format(date, "EEE d MMM", { locale: es });
}

/** "miércoles, 1 de octubre de 2026" */
export function formatLong(date: Date): string {
  return format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
}

/** "1 oct" */
export function formatDayMonth(date: Date): string {
  return format(date, "d MMM", { locale: es });
}

/** Días restantes hasta una fecha (puede ser negativo si ya pasó). */
export function daysUntil(target: Date, from: Date = new Date()): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

// ---- Metadatos de categorías (etiquetas en español + color del chip) ----

export const TASK_CATEGORIES: Record<
  TaskCategory,
  { label: string; color: string }
> = {
  reservas: { label: "Reservas", color: "bg-rose-100 text-rose-800" },
  visado: { label: "Visado", color: "bg-amber-100 text-amber-800" },
  tickets: { label: "Entradas", color: "bg-violet-100 text-violet-800" },
  seguro: { label: "Seguro", color: "bg-emerald-100 text-emerald-800" },
  transporte: { label: "Transporte", color: "bg-sky-100 text-sky-800" },
  otros: { label: "Otros", color: "bg-stone-100 text-stone-700" },
};

export const BUDGET_CATEGORIES: Record<BudgetCategory, string> = {
  vuelos: "Vuelos",
  tren: "Tren España",
  hoteles: "Hoteles",
  ryokan: "Ryokan",
  transporte: "Transporte Japón",
  comida: "Comida",
  seguro: "Seguro",
  esim: "eSIM",
  visados: "Visados",
  tickets: "Entradas",
};

export const PACKING_CATEGORIES: Record<PackingCategory, string> = {
  documentos_visado: "Documentos para el visado",
  equipaje: "Equipaje",
  electronica: "Electrónica",
  salud: "Salud",
};

export const DOCUMENT_CATEGORIES: Record<DocumentCategory, string> = {
  vuelo: "Vuelo",
  hotel: "Hotel",
  visado: "Visado",
  seguro: "Seguro",
  pasaporte: "Pasaporte",
  otros: "Otros",
};

/** Color del chip de una ciudad del itinerario. */
export function cityColor(city: string | null): string {
  switch (city) {
    case "Tokio":
      return "bg-rose-100 text-rose-800";
    case "Hakone":
      return "bg-teal-100 text-teal-800";
    case "Kioto":
      return "bg-violet-100 text-violet-800";
    case "Osaka":
      return "bg-amber-100 text-amber-800";
    case "Nara / Osaka":
      return "bg-orange-100 text-orange-800";
    case "Hiroshima / Miyajima":
      return "bg-sky-100 text-sky-800";
    case "Vuelo":
      return "bg-stone-100 text-stone-700";
    default:
      return "bg-stone-100 text-stone-700";
  }
}
