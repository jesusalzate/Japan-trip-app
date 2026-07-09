# 🗾 Viaje a Japón — App de planificación

App privada para que **los dos** planifiquemos nuestro viaje a Japón de 15 días en octubre.
Funciona desde el móvil o el ordenador, se **sincroniza en vivo** entre nuestros dispositivos
y guarda las **reservas y documentos** en la nube.

**Incluye:**

- 🏠 **Inicio** — cuenta atrás, progreso de preparativos, resumen del presupuesto y un
  **conversor € / ¥** rápido con tipo de cambio que se **actualiza solo cada día**.
- ✅ **Tareas** — lista de cosas por hacer con fechas límite (vuelos, visado, entradas…),
  cada una con su propio **checklist de subtareas**.
- 🗺️ **Itinerario** — días editables (título, ciudad, resumen) con actividades, transporte y
  notas; se pueden **añadir o eliminar días** según vayamos concretando el plan.
- 💶 **Presupuesto** — previsto vs. real (~5.770 €) con su equivalente en yenes, marcar lo
  ya pagado.
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

Ejecuta estos siete scripts **en este orden**, cada uno en una **New query** nueva del
**SQL Editor** (icono `</>` en el menú lateral) → pega el contenido completo → **Run**:

1. [`supabase/migrations/0001_schema.sql`](supabase/migrations/0001_schema.sql) — crea las tablas,
   la seguridad (RLS) y el almacenamiento de documentos.
2. [`supabase/migrations/0002_itinerary_transport.sql`](supabase/migrations/0002_itinerary_transport.sql) —
   añade el campo de transporte de cada día del itinerario.
3. [`supabase/migrations/0003_itinerary_day_management.sql`](supabase/migrations/0003_itinerary_day_management.sql) —
   permite añadir y eliminar días del itinerario desde la app.
4. [`supabase/seed.sql`](supabase/seed.sql) — carga el itinerario, las tareas, el presupuesto y
   las listas.
5. [`supabase/migrations/0004_task_subtasks.sql`](supabase/migrations/0004_task_subtasks.sql) —
   añade las subtareas (checklist) dentro de cada tarea.
6. [`supabase/migrations/0005_fix_day_functions_where_clause.sql`](supabase/migrations/0005_fix_day_functions_where_clause.sql) —
   corrige un error ("UPDATE requires a WHERE clause") al añadir/eliminar días.
7. [`supabase/migrations/0006_add_yen_rate.sql`](supabase/migrations/0006_add_yen_rate.sql) —
   añade el tipo de cambio para el conversor € / ¥ y el presupuesto en yenes.

Cada uno debe terminar sin errores antes de pasar al siguiente.

> ¿Ya tenías la app funcionando y solo quieres añadir alguna novedad? Ejecuta únicamente el
> script correspondiente (2, 3, 5, 6 o 7) — son seguros de repetir o ejecutar sobre datos ya
> cargados.
> **Si al añadir o eliminar un día del itinerario te sale el error "UPDATE requires a WHERE
> clause"**, es porque falta ejecutar el script **6** — corrige justo eso.

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
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | tu clave *publishable* (`sb_publishable_…`) |

   > Si tu proyecto usa la clave clásica `anon` (empieza por `eyJ…`), puedes ponerla en
   > `NEXT_PUBLIC_SUPABASE_ANON_KEY`; la app acepta ambos nombres.

4. **(Opcional)** Para que el tipo de cambio se actualice **solo, una vez al día**, añade
   también estas dos variables:

   | Nombre | Valor |
   |---|---|
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → **Project Settings → API** → clave **service_role** (⚠️ secreta: no la pongas nunca con el prefijo `NEXT_PUBLIC_`) |
   | `CRON_SECRET` | Cualquier cadena aleatoria larga que inventes tú (p. ej. generada en <https://1password.com/password-generator>) |

   Sin estas dos variables la app funciona exactamente igual, solo que el tipo de cambio
   habrá que refrescarlo a mano con el botón 🔄 del conversor.

5. Pulsa **Deploy**. En un par de minutos tendrás una dirección tipo
   `https://viaje-japon.vercel.app`. El archivo `vercel.json` del proyecto ya programa la
   actualización diaria automáticamente (gratis en el plan Hobby, que permite tareas
   programadas de hasta una vez al día).

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
- El tipo de cambio (automático diario y el botón manual) consulta un servicio externo
  gratuito ([Frankfurter](https://www.frankfurter.app/), datos del BCE, sin necesidad de
  clave) solo para obtener EUR→JPY; no se envían datos del viaje. También puedes escribir
  el tipo de cambio a mano si lo prefieres.
- La clave `SUPABASE_SERVICE_ROLE_KEY` (si la configuras) **solo** vive en las variables de
  entorno del servidor de Vercel, nunca llega al navegador, y solo la usa la tarea
  programada diaria para escribir el tipo de cambio.

## 🗂️ Estructura del proyecto

```
app/                 Páginas (Inicio, Tareas, Itinerario, Presupuesto, Equipaje, Documentos)
  (app)/             Zona privada (requiere sesión)
  login/             Inicio de sesión
  api/exchange-rate/         Consulta el tipo de cambio actual (botón manual)
  api/cron/refresh-yen-rate/ Actualiza el tipo de cambio una vez al día (cron de Vercel)
  actions.ts         Acciones de servidor (crear/editar/borrar)
components/          Componentes de interfaz
lib/
  supabase/          Clientes de Supabase (navegador, servidor, proxy)
  data.ts            Lecturas de datos
  trip.ts            Fechas y etiquetas del viaje
supabase/
  migrations/0001_schema.sql   Tablas, seguridad (RLS), realtime y almacenamiento
  migrations/0002_itinerary_transport.sql   Campo de transporte por día
  migrations/0003_itinerary_day_management.sql   Añadir/eliminar días del itinerario
  migrations/0004_task_subtasks.sql   Subtareas (checklist) dentro de cada tarea
  migrations/0005_fix_day_functions_where_clause.sql   Corrige el error "UPDATE requires a WHERE clause"
  migrations/0006_add_yen_rate.sql   Tipo de cambio para el conversor € / ¥
  seed.sql                     Contenido del viaje (itinerario, tareas, presupuesto, listas)
vercel.json          Programa la actualización diaria del tipo de cambio
```

> ¿Cambia la fecha de salida? Ajústala en **Inicio → Cambiar fecha de salida**; todas las
> fechas del itinerario se recalculan solas.
