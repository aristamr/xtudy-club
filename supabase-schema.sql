-- Ejecuta este script en Supabase: tu proyecto → SQL Editor → New query → pega esto → Run
-- Crea una sola tabla genérica de "llave-valor" que reemplaza el almacenamiento de Claude.

create table if not exists kv_store (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- Seguridad: por ahora, igual que en la versión de prueba, cualquiera con la
-- clave pública (anon key) puede leer y escribir. Esto es aceptable para esta
-- etapa de validación con pocos restaurantes, pero NO es seguridad real.
-- Cuando quieras protegerlo de verdad (por ejemplo, antes de conectar Stripe),
-- aquí es donde se agregarían políticas más estrictas.
alter table kv_store enable row level security;

create policy "acceso público de lectura y escritura (temporal)"
  on kv_store
  for all
  using (true)
  with check (true);
