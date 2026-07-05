-- =====================================================================
--  Viaje a Japón — Datos iniciales (seed)
--  Idempotente: cada bloque solo inserta si su tabla está vacía.
--  Ejecutar DESPUÉS de 0001_schema.sql y 0002_itinerary_transport.sql.
-- =====================================================================

-- ----------------------- Ajustes del viaje ---------------------------
insert into public.trip_settings (trip_name, start_date, total_budget, currency)
select 'Viaje a Japón', '2026-10-01', 5770.42, 'EUR'
where not exists (select 1 from public.trip_settings);

-- --------------------------- Itinerario ------------------------------
insert into public.itinerary_days (day_number, title, city, summary, transport, sort_order) values
  (1,  'Salida de España',        'Vuelo',                  'Vuelo nocturno de larga distancia (Madrid–Tokio).', 'Billete aéreo internacional (Madrid–Tokio).', 1),
  (2,  'Llegada a Tokio',         'Tokio',                  'Llegada (Haneda/Narita) y registro en el hotel (Otsuka/Shinjuku).', 'Tren expreso al centro (N''EX / Monorraíl).', 2),
  (3,  'Shibuya',                 'Tokio',                  'Cruce de Shibuya y mirador Shibuya Sky.', 'Metro de Tokio (pase de 72 horas).', 3),
  (4,  'Meiji y Shinjuku',        'Tokio',                  'Santuario Meiji Jingu, Harajuku, Omotesando y Shinjuku Gyoen.', 'Metro de Tokio (pase de 72 horas).', 4),
  (5,  'Asakusa y teamLab',       'Tokio',                  'Templo Senso-ji (Asakusa) y museo teamLab Planets (Toyosu).', 'Metro de Tokio + tren Yurikamome (a Toyosu).', 5),
  (6,  'Hakone y onsen',          'Hakone',                 'Crucero por el lago Ashi y noche en ryokan tradicional con onsen.', 'Tren Odakyu Romancecar (a Hakone).', 6),
  (7,  'Llegada a Kioto',         'Kioto',                  'Shinkansen a Kioto y paseo nocturno por el barrio de Gion.', 'Tren bala Tokaido Shinkansen (a Kioto).', 7),
  (8,  'Kiyomizu y Fushimi Inari','Kioto',                  'Kiyomizu-dera, Sannenzaka y santuario Fushimi Inari Taisha.', 'Autobús y líneas locales de Kioto.', 8),
  (9,  'Templos y bambú',         'Kioto',                  'Daigo-ji (follaje otoñal), Kinkaku-ji y bosque de bambú.', 'Autobús y líneas locales de Kioto.', 9),
  (10, 'Nara y Osaka',            'Nara / Osaka',           'Gran Buda de Nara y traslado nocturno a Osaka (Dotonbori).', 'Tren local JR (pase Kansai-Hiroshima).', 10),
  (11, 'Osaka',                   'Osaka',                  'Castillo de Osaka, barrio retro Shinsekai y mirador Umeda Sky.', 'Tren local JR (pase Kansai-Hiroshima).', 11),
  (12, 'Hiroshima y Miyajima',    'Hiroshima / Miyajima',   'Parque de la Paz e isla de Miyajima (excursión de día completo).', 'Shinkansen y ferry JR (pase regional).', 12),
  (13, 'Universal o Himeji',      'Osaka',                  'Universal Studios Japan o escapada al castillo de Himeji.', 'Tren local JR (pase Kansai-Hiroshima).', 13),
  (14, 'Regreso a Tokio',         'Tokio',                  'Shinkansen de vuelta a Tokio y últimas compras en Akihabara.', 'Tren bala Tokaido Shinkansen (a Tokio).', 14),
  (15, 'Vuelta a casa',           'Tokio',                  'Traslado al aeropuerto y vuelo de regreso a España.', 'Tren expreso al aeropuerto / billete aéreo.', 15)
on conflict (day_number) do nothing;

-- ----------------- Actividades destacadas por día --------------------
insert into public.itinerary_activities (day_id, name, time_label, sort_order)
select d.id, v.name, v.tl, v.ord
from (values
  (2,  'Tren expreso al centro (N''EX / Monorraíl)', 'Llegada', 1),
  (2,  'Check-in y primera cena (Otsuka/Shinjuku)',  'Noche',   2),
  (3,  'Cruce de Shibuya',                            'Tarde',   1),
  (3,  'Shibuya Sky (reservar atardecer)',           'Tarde',   2),
  (4,  'Santuario Meiji Jingu',                       'Mañana',  1),
  (4,  'Harajuku y Omotesando',                       'Tarde',   2),
  (4,  'Jardín Shinjuku Gyoen',                        'Tarde',   3),
  (5,  'Templo Senso-ji (Asakusa)',                   'Mañana',  1),
  (5,  'teamLab Planets (Toyosu)',                    'Tarde',   2),
  (6,  'Crucero por el lago Ashi',                    'Tarde',   1),
  (6,  'Noche en ryokan con onsen',                   'Noche',   2),
  (7,  'Shinkansen a Kioto (desde Odawara)',          'Mañana',  1),
  (7,  'Paseo nocturno por Gion',                     'Noche',   2),
  (8,  'Kiyomizu-dera y Sannenzaka',                  'Mañana',  1),
  (8,  'Fushimi Inari Taisha',                        'Tarde',   2),
  (9,  'Kinkaku-ji (Pabellón de Oro)',               'Mañana',  1),
  (9,  'Bosque de bambú de Arashiyama',               'Tarde',   2),
  (10, 'Gran Buda de Nara (Todai-ji)',                'Mañana',  1),
  (10, 'Dotonbori (Osaka)',                            'Noche',   2),
  (11, 'Castillo de Osaka',                            'Mañana',  1),
  (11, 'Mirador Umeda Sky',                            'Tarde',   2),
  (12, 'Parque Memorial de la Paz (Hiroshima)',       'Mañana',  1),
  (12, 'Isla de Miyajima (torii flotante)',           'Tarde',   2),
  (14, 'Compras en Akihabara',                         'Tarde',   1)
) as v(daynum, name, tl, ord)
join public.itinerary_days d on d.day_number = v.daynum
where not exists (select 1 from public.itinerary_activities);

-- ------------------------------ Tareas -------------------------------
-- Fechas calculadas a partir de la fecha de salida (trip_settings.start_date).
insert into public.tasks (title, description, category, due_date, sort_order)
select t.title, t.descr, t.cat, (s.start_date + t.offset_days)::date, t.ord
from (select start_date from public.trip_settings limit 1) s,
(values
  ('Comprar billetes de avión (Madrid–Tokio)', 'Con 1 escala. Reservar también hoteles con cancelación gratuita.', 'reservas',   -120, 1),
  ('Reservar hoteles (cancelación gratuita)',   'Tokio, Kioto, Osaka + ryokan en Hakone. Necesarios para el visado.', 'reservas',   -120, 2),
  ('Pedir cita de visado (Consulado Barcelona)','Por correo: visado@bc.mofa.go.jp. ~2 meses antes de la salida.',      'visado',      -60, 3),
  ('Preparar documentos del visado',            'Certificado laboral, 3 nóminas, certificado y extractos bancarios.', 'visado',      -65, 4),
  ('Comprar entradas Shibuya Sky',              'La venta abre 30 días antes; el atardecer se agota rápido.',         'tickets',     -30, 5),
  ('Comprar entradas teamLab Planets',          'La venta abre 30 días antes. Comprar al abrir.',                     'tickets',     -30, 6),
  ('Contratar seguro de viaje (Heymondo Top)',  'Cobertura médica 5.000.000 €. Imprescindible para Japón.',           'seguro',      -20, 7),
  ('Comprar 2× Kansai-Hiroshima Area Pass',     'Compra previa online (JR West). 5 días.',                            'transporte',  -15, 8),
  ('Comprar 2× eSIM (datos ilimitados)',        '15 días, red SoftBank.',                                             'transporte',  -10, 9),
  ('Pre-registro en Visit Japan Web',           'Generar el QR de inmigración y aduanas antes de viajar.',            'otros',        -4, 10),
  ('Organizar envío de equipaje (Takuhaibin)',  'Yamato Transport: maletas de hotel a hotel (~15 €/maleta).',         'transporte',  -3, 11)
) as t(title, descr, cat, offset_days, ord)
where not exists (select 1 from public.tasks);

-- --------------------------- Presupuesto -----------------------------
insert into public.budget_items (category, label, planned_amount, sort_order)
select v.cat, v.label, v.amount, v.ord
from (values
  ('vuelos',     'Vuelos larga distancia (I/V, 2 pers.)',        1620.00, 1),
  ('tren',       'Tren Valencia–Madrid (I/V, 2 pers.)',           120.00, 2),
  ('hoteles',    'Hoteles urbanos (13 noches)',                  1235.00, 3),
  ('ryokan',     'Ryokan en Hakone (1 noche, media pensión)',     235.00, 4),
  ('transporte', 'Pases de transporte en Japón',                  566.00, 5),
  ('comida',     'Comida diaria (50 €/persona/día)',             1500.00, 6),
  ('seguro',     'Seguro Heymondo Top (2 pers.)',                 164.42, 7),
  ('esim',       '2× eSIM (15 días)',                              90.00, 8),
  ('visados',    'Visados de turismo (gratuitos)',                  0.00, 9),
  ('tickets',    'Entradas (teamLab, Shibuya Sky, Universal)',    240.00, 10)
) as v(cat, label, amount, ord)
where not exists (select 1 from public.budget_items);

-- ----------------- Equipaje y documentos del visado ------------------
insert into public.packing_items (category, label, assigned_to, sort_order)
select v.cat, v.label, v.who, v.ord
from (values
  -- Documentos para el visado
  ('documentos_visado', 'Pasaporte vigente (cubre todo el viaje)',                    'ambos', 1),
  ('documentos_visado', 'Formulario de solicitud de visado',                          'ambos', 2),
  ('documentos_visado', 'Foto reciente (4,5 × 4,5 cm)',                               'ambos', 3),
  ('documentos_visado', 'Certificado laboral (cargo, antigüedad y salario)',          'ambos', 4),
  ('documentos_visado', 'Últimas 3 nóminas',                                          'ambos', 5),
  ('documentos_visado', 'Certificado bancario con saldo a la fecha',                  'ambos', 6),
  ('documentos_visado', 'Extractos bancarios del último trimestre',                   'ambos', 7),
  ('documentos_visado', 'Reservas de vuelo confirmadas (I/V)',                        'ambos', 8),
  ('documentos_visado', 'Reservas de hotel confirmadas',                             'ambos', 9),
  ('documentos_visado', 'Itinerario del viaje',                                       'ambos', 10),
  -- Equipaje
  ('equipaje', 'Ropa para clima fresco (otoño)',                                      'ambos', 11),
  ('equipaje', 'Chaqueta ligera / impermeable',                                       'ambos', 12),
  ('equipaje', 'Calzado cómodo para caminar',                                         'ambos', 13),
  ('equipaje', 'Mochila de mano ligera (noche en Hakone)',                            'ambos', 14),
  ('equipaje', 'Adaptador de enchufe (tipo A, Japón)',                                'ambos', 15),
  ('equipaje', 'Neceser',                                                             'ambos', 16),
  -- Electrónica
  ('electronica', 'Power bank (batería externa)',                                     'ambos', 17),
  ('electronica', 'Cargadores y cables',                                              'ambos', 18),
  ('electronica', 'eSIM activada',                                                    'ambos', 19),
  ('electronica', 'Auriculares',                                                      'ambos', 20),
  -- Salud
  ('salud', 'Botiquín básico',                                                        'ambos', 21),
  ('salud', 'Medicación personal',                                                    'ambos', 22),
  ('salud', 'Tarjeta / póliza del seguro Heymondo',                                   'ambos', 23)
) as v(cat, label, who, ord)
where not exists (select 1 from public.packing_items);
