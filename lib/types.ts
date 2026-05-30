// Tipos de las filas de la base de datos (espejo de supabase/migrations/0001_schema.sql).

export type TaskCategory =
  | "reservas"
  | "visado"
  | "tickets"
  | "seguro"
  | "transporte"
  | "otros";

export interface TripSettings {
  id: string;
  trip_name: string;
  start_date: string; // YYYY-MM-DD
  total_budget: number;
  currency: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  category: TaskCategory;
  due_date: string | null;
  is_done: boolean;
  done_at: string | null;
  sort_order: number;
  created_at: string;
}

export interface ItineraryDay {
  id: string;
  day_number: number;
  title: string;
  city: string | null;
  summary: string | null;
  notes: string | null;
  sort_order: number;
}

export interface ItineraryActivity {
  id: string;
  day_id: string;
  name: string;
  time_label: string | null;
  location: string | null;
  notes: string | null;
  is_done: boolean;
  sort_order: number;
}

export type BudgetCategory =
  | "vuelos"
  | "tren"
  | "hoteles"
  | "ryokan"
  | "transporte"
  | "comida"
  | "seguro"
  | "esim"
  | "visados"
  | "tickets";

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  label: string;
  planned_amount: number;
  actual_amount: number | null;
  is_paid: boolean;
  notes: string | null;
  sort_order: number;
}

export type PackingCategory =
  | "equipaje"
  | "documentos_visado"
  | "electronica"
  | "salud";

export interface PackingItem {
  id: string;
  category: PackingCategory;
  label: string;
  is_packed: boolean;
  assigned_to: string | null;
  sort_order: number;
}

export type DocumentCategory =
  | "vuelo"
  | "hotel"
  | "visado"
  | "seguro"
  | "pasaporte"
  | "otros";

export interface TripDocument {
  id: string;
  category: DocumentCategory;
  title: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  related_task_id: string | null;
  created_at: string;
}
