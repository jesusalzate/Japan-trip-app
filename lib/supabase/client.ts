"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_KEY } from "@/lib/supabase/config";

/**
 * Cliente de Supabase para componentes del navegador (client components).
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
