import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_KEY } from "@/lib/supabase/config";

/**
 * Refresca la sesión de Supabase en cada petición y protege las rutas.
 * Redirige a /login si no hay usuario autenticado.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Si faltan las variables de entorno (p. ej. antes de configurar Supabase),
  // no bloqueamos la petición para no romper la app.
  const url = SUPABASE_URL;
  const key = SUPABASE_KEY;
  if (!url || !key) return supabaseResponse;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANTE: revalida el token contra el servidor de Auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublic =
    path.startsWith("/login") ||
    path.startsWith("/auth") ||
    path.startsWith("/manifest") ||
    path.startsWith("/icons") ||
    path === "/sw.js" ||
    // Los cron jobs de Vercel no tienen sesión de usuario; se autorizan
    // con su propio secreto compartido dentro de cada route handler.
    path.startsWith("/api/cron/");

  if (!user && !isPublic) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // Si ya está autenticado y va a /login, lo mandamos al inicio.
  if (user && path.startsWith("/login")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
