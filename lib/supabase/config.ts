// Lee la configuración de Supabase desde las variables de entorno.
// Acepta el nombre nuevo (PUBLISHABLE_KEY) y el antiguo (ANON_KEY) por
// compatibilidad. Ambas son claves públicas (viajan al navegador): no son
// secretas. La contraseña de la base de datos NO se usa aquí.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
