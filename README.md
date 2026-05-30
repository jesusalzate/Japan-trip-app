# 🗾 Viaje a Japón — App de planificación

App privada para que **los dos** planifiquemos nuestro viaje a Japón de 15 días en octubre.
Funciona desde el móvil o el ordenador, se **sincroniza en vivo** entre nuestros dispositivos
y guarda las **reservas y documentos** en la nube.

**Incluye:**

- 🏠 **Inicio** — cuenta atrás, progreso de preparativos y resumen del presupuesto.
- ✅ **Tareas** — lista de cosas por hacer con fechas límite (vuelos, visado, entradas…).
- 🗺️ **Itinerario** — los 15 días, editables, con actividades y notas por día.
- 💶 **Presupuesto** — previsto vs. real (~5.770 €), marcar lo ya pagado.
- 🧳 **Equipaje** — checklist de la maleta y de los **documentos del visado**.
- 📁 **Documentos** — subir y abrir los archivos (vuelos, hoteles, visado, seguro, pasaportes).

Construida con **Next.js + Supabase** (base de datos, login y almacenamiento) y pensada para
desplegarse gratis en **Vercel**.

---

## 🚀 Puesta en marcha (una sola vez)

> No hace falta saber programar. Son ~20 minutos siguiendo los pasos.

### 1) Crear el proyecto de Supabase (base de datos gratuita)

1. Entra en <https://supabase.com> → **Start your project** → crea una cuenta.
2. **New project**. Ponle un nombre (p. ej. `viaje-japon`), elige una contraseña de base de
   datos (guárdala) y la región más cercana (Europe West). Espera a que termine de crearse.
3. Ve a **Project Settings → API** y apunta dos datos:
   - **Project URL** (algo como `https://xxxx.supabase.co`)
   - **anon public** key (una clave larga)

### 2) Crear las tablas y cargar los datos del viaje

1. En Supabase, abre **SQL Editor** (icono `</>` en el menú lateral) → **New query**.
2. Copia **todo** el contenido del archivo [`supabase/migrations/0001_schema.sql`](supabase/migrations/0001_schema.sql),
   pégalo y pulsa **Run**. Debe terminar sin errores.
3. Abre otra **New query**, copia **todo** [`supabase/seed.sql`](supabase/seed.sql), pégalo y
   pulsa **Run**. Esto carga el itinerario, las tareas, el presupuesto y las listas.

> El bucket privado `documents` (para los archivos) y las reglas de seguridad se crean solos
> con el primer script.

### 3) Crear nuestras dos cuentas y cerrar el registro

1. Ve a **Authentication → Sign In / Providers → Email** y **desactiva** la opción
   *"Allow new users to sign up"* (así nadie más podrá registrarse). Guarda.
2. Ve a **Authentication → Users → Add user → Create new user**. Crea **dos** usuarios
   (el tuyo y el de tu mujer) con correo y contraseña. Marca **Auto Confirm User** para que
   puedan entrar enseguida.

### 4) Subir el código a GitHub y desplegar en Vercel

1. Sube este repositorio a GitHub (si estás leyendo esto desde GitHub, ya está).
2. Entra en <https://vercel.com> → crea cuenta → **Add New… → Project** → importa el
   repositorio `japan-trip-app`.
3. En **Environment Variables** añade estas dos (de los datos del paso 1):

   | Nombre | Valor |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | tu Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tu clave anon public |

4. Pulsa **Deploy**. En un par de minutos tendrás una dirección tipo
   `https://viaje-japon.vercel.app`.

### 5) Decirle a Supabase cuál es la dirección de la app

En Supabase → **Authentication → URL Configuration** → en **Site URL** pon la dirección de
Vercel del paso anterior. Guarda.

### 6) Instalarla en el móvil (como una app)

1. Abre la dirección de Vercel en el móvil (Safari en iPhone, Chrome en Android).
2. **iPhone:** botón compartir → *Añadir a pantalla de inicio*.
   **Android:** menú ⋮ → *Instalar aplicación* / *Añadir a pantalla de inicio*.
3. Inicia sesión con tu correo y contraseña. ¡Listo! 🎉

---

## 💻 Desarrollo local (opcional)

```bash
npm install
cp .env.example .env.local   # y rellena las dos variables de Supabase
npm run dev                  # http://localhost:3000
```

Otros comandos:

```bash
npm run build   # compila para producción
npm run lint    # revisa el código
```

---

## 🔒 Privacidad y seguridad

- Solo existen **dos cuentas** y el registro público está **desactivado**.
- Los datos del viaje son **compartidos** entre los dos (lo que edita uno lo ve el otro).
- Los documentos viven en un bucket **privado**; se abren con enlaces firmados temporales.
- La seguridad a nivel de fila (RLS) está activada: sin sesión no se accede a nada.

## 🗂️ Estructura del proyecto

```
app/                 Páginas (Inicio, Tareas, Itinerario, Presupuesto, Equipaje, Documentos)
  (app)/             Zona privada (requiere sesión)
  login/             Inicio de sesión
  actions.ts         Acciones de servidor (crear/editar/borrar)
components/          Componentes de interfaz
lib/
  supabase/          Clientes de Supabase (navegador, servidor, proxy)
  data.ts            Lecturas de datos
  trip.ts            Fechas y etiquetas del viaje
supabase/
  migrations/0001_schema.sql   Tablas, seguridad (RLS), realtime y almacenamiento
  seed.sql                     Contenido del viaje (itinerario, tareas, presupuesto, listas)
```

> ¿Cambia la fecha de salida? Ajústala en **Inicio → Cambiar fecha de salida**; todas las
> fechas del itinerario se recalculan solas.
