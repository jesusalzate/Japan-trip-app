import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEFAULT_YEN_RATE } from "@/lib/currency";
import type {
  BudgetItem,
  ItineraryActivity,
  ItineraryDay,
  PackingItem,
  Task,
  TaskSubtask,
  TripDocument,
  TripSettings,
} from "@/lib/types";

/** ¿Están configuradas las variables de Supabase? */
export function isConfigured(): boolean {
  return isSupabaseConfigured;
}

const DEFAULT_START = "2026-10-01";

export async function getTripSettings(): Promise<TripSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from("trip_settings").select("*").limit(1).single();
  return {
    id: "",
    trip_name: "Viaje a Japón",
    start_date: DEFAULT_START,
    total_budget: 5770.42,
    currency: "EUR",
    yen_rate_updated_at: null,
    updated_at: "",
    ...data,
    // Si la fila existe pero aún no se ha aplicado la migración del tipo
    // de cambio, la columna no vendrá en la respuesta: usa el valor por defecto.
    yen_rate: data?.yen_rate ?? DEFAULT_YEN_RATE,
  };
}

export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .order("is_done", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getTaskSubtasks(): Promise<TaskSubtask[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("task_subtasks")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getBudgetItems(): Promise<BudgetItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("budget_items")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getItineraryDays(): Promise<ItineraryDay[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("itinerary_days")
    .select("*")
    .order("day_number", { ascending: true });
  return data ?? [];
}

export async function getActivities(): Promise<ItineraryActivity[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("itinerary_activities")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getPackingItems(): Promise<PackingItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("packing_items")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getDocuments(): Promise<TripDocument[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}
