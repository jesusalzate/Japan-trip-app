"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { BudgetCategory, TaskCategory } from "@/lib/types";

async function db() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  return { supabase, user };
}

// ---------------------- Tareas ----------------------

export async function toggleTask(id: string, isDone: boolean) {
  const { supabase } = await db();
  await supabase
    .from("tasks")
    .update({ is_done: isDone, done_at: isDone ? new Date().toISOString() : null })
    .eq("id", id);
  revalidatePath("/tareas");
  revalidatePath("/");
}

export async function addTask(formData: FormData) {
  const { supabase, user } = await db();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const category = String(formData.get("category") ?? "otros") as TaskCategory;
  const due = String(formData.get("due_date") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  await supabase.from("tasks").insert({
    title,
    category,
    due_date: due || null,
    description: description || null,
    created_by: user.id,
  });
  revalidatePath("/tareas");
  revalidatePath("/");
}

export async function deleteTask(id: string) {
  const { supabase } = await db();
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/tareas");
  revalidatePath("/");
}

export async function updateTaskDetails(
  id: string,
  data: {
    title: string;
    description: string;
    category: TaskCategory;
    due_date: string;
  },
) {
  const { supabase } = await db();
  const title = data.title.trim();
  if (!title) return;
  await supabase
    .from("tasks")
    .update({
      title,
      description: data.description.trim() || null,
      category: data.category,
      due_date: data.due_date || null,
    })
    .eq("id", id);
  revalidatePath("/tareas");
  revalidatePath("/");
}

// ---------------------- Subtareas ----------------------

export async function addSubtask(taskId: string, formData: FormData) {
  const { supabase } = await db();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  await supabase.from("task_subtasks").insert({ task_id: taskId, title });
  revalidatePath("/tareas");
}

export async function toggleSubtask(id: string, isDone: boolean) {
  const { supabase } = await db();
  await supabase.from("task_subtasks").update({ is_done: isDone }).eq("id", id);
  revalidatePath("/tareas");
}

export async function deleteSubtask(id: string) {
  const { supabase } = await db();
  await supabase.from("task_subtasks").delete().eq("id", id);
  revalidatePath("/tareas");
}

// ---------------------- Itinerario ----------------------

export async function updateDayNotes(id: string, notes: string) {
  const { supabase } = await db();
  await supabase.from("itinerary_days").update({ notes }).eq("id", id);
  revalidatePath("/itinerario");
}

export async function updateDayTransport(id: string, transport: string) {
  const { supabase } = await db();
  await supabase.from("itinerary_days").update({ transport }).eq("id", id);
  revalidatePath("/itinerario");
}

export async function updateDayDetails(
  id: string,
  data: { title: string; city: string; summary: string },
) {
  const { supabase } = await db();
  const title = data.title.trim();
  if (!title) return;
  await supabase
    .from("itinerary_days")
    .update({
      title,
      city: data.city.trim() || null,
      summary: data.summary.trim() || null,
    })
    .eq("id", id);
  revalidatePath("/itinerario");
}

type ActionResult = { ok: true } | { ok: false; message: string };

export async function addItineraryDay(
  afterDayNumber: number,
): Promise<ActionResult> {
  const { supabase } = await db();
  const { error } = await supabase.rpc("insert_itinerary_day", {
    p_after_day_number: afterDayNumber,
  });
  if (error) {
    return { ok: false, message: `No se pudo añadir el día: ${error.message}` };
  }
  revalidatePath("/itinerario");
  return { ok: true };
}

export async function deleteItineraryDay(
  dayNumber: number,
): Promise<ActionResult> {
  const { supabase } = await db();
  const { error } = await supabase.rpc("delete_itinerary_day", {
    p_day_number: dayNumber,
  });
  if (error) {
    return {
      ok: false,
      message: `No se pudo eliminar el día: ${error.message}`,
    };
  }
  revalidatePath("/itinerario");
  return { ok: true };
}

export async function toggleActivity(id: string, isDone: boolean) {
  const { supabase } = await db();
  await supabase.from("itinerary_activities").update({ is_done: isDone }).eq("id", id);
  revalidatePath("/itinerario");
}

export async function addActivity(dayId: string, formData: FormData) {
  const { supabase } = await db();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const time_label = String(formData.get("time_label") ?? "").trim();
  await supabase.from("itinerary_activities").insert({
    day_id: dayId,
    name,
    time_label: time_label || null,
  });
  revalidatePath("/itinerario");
}

export async function deleteActivity(id: string) {
  const { supabase } = await db();
  await supabase.from("itinerary_activities").delete().eq("id", id);
  revalidatePath("/itinerario");
}

// ---------------------- Presupuesto ----------------------

export async function updateBudgetActual(
  id: string,
  actual: number | null,
  isPaid: boolean,
) {
  const { supabase } = await db();
  await supabase
    .from("budget_items")
    .update({ actual_amount: actual, is_paid: isPaid })
    .eq("id", id);
  revalidatePath("/presupuesto");
  revalidatePath("/");
}

export async function addBudgetItem(formData: FormData) {
  const { supabase } = await db();
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return;
  const category = String(formData.get("category") ?? "tickets") as BudgetCategory;
  const planned = Number(formData.get("planned_amount") ?? 0) || 0;
  await supabase
    .from("budget_items")
    .insert({ label, category, planned_amount: planned });
  revalidatePath("/presupuesto");
  revalidatePath("/");
}

export async function deleteBudgetItem(id: string) {
  const { supabase } = await db();
  await supabase.from("budget_items").delete().eq("id", id);
  revalidatePath("/presupuesto");
  revalidatePath("/");
}

// ---------------------- Equipaje / Documentos visado ----------------------

export async function togglePacking(id: string, isPacked: boolean) {
  const { supabase } = await db();
  await supabase.from("packing_items").update({ is_packed: isPacked }).eq("id", id);
  revalidatePath("/equipaje");
}

export async function addPackingItem(formData: FormData) {
  const { supabase } = await db();
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return;
  const category = String(formData.get("category") ?? "equipaje");
  const assigned = String(formData.get("assigned_to") ?? "").trim();
  await supabase.from("packing_items").insert({
    label,
    category,
    assigned_to: assigned || "ambos",
  });
  revalidatePath("/equipaje");
}

export async function deletePackingItem(id: string) {
  const { supabase } = await db();
  await supabase.from("packing_items").delete().eq("id", id);
  revalidatePath("/equipaje");
}

// ---------------------- Ajustes del viaje ----------------------

export async function updateTripStart(id: string, startDate: string) {
  const { supabase } = await db();
  if (!startDate) return;
  await supabase.from("trip_settings").update({ start_date: startDate }).eq("id", id);
  revalidatePath("/", "layout");
}

// ---------------------- Documentos (metadatos) ----------------------

export async function deleteDocument(id: string, storagePath: string) {
  const { supabase } = await db();
  await supabase.storage.from("documents").remove([storagePath]);
  await supabase.from("documents").delete().eq("id", id);
  revalidatePath("/documentos");
}
