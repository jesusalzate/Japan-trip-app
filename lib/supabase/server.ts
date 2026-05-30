import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_KEY } from "@/lib/supabase/config";

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 * Gestiona las cookies de sesión. Siempre usar `auth.getUser()` (no getSession)
 * en servidor para revalidar el token contra el servidor de Auth.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Llamado desde un Server Component: ignorable si hay middleware
            // refrescando la sesión.
          }
        },
      },
    },
  );
}
