# Guía para publicar Xtudy Club — paso a paso

No necesitas saber programar para seguir esto. Son botones y copiar/pegar.

## Paso 1 — Crear la base de datos (Supabase)

1. Ve a **supabase.com** → **Start your project** → crea tu cuenta (puedes usar tu cuenta de GitHub para entrar más rápido).
2. Crea un proyecto nuevo (dale un nombre, ej. `xtudy-club`, y una contraseña de base de datos — guárdala, no la necesitarás seguido pero es bueno tenerla anotada).
3. Espera 1-2 minutos a que Supabase termine de crear el proyecto.
4. En el menú izquierdo, ve a **SQL Editor** → **New query**.
5. Abre el archivo `supabase-schema.sql` (incluido en este proyecto), copia todo su contenido, pégalo ahí, y dale **Run**.
6. Ve a **Project Settings** (ícono de engrane) → **API**. Ahí vas a ver dos cosas que necesitas copiar:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (una clave larga de texto)

Guarda esos dos valores, los usamos en el Paso 3.

## Paso 2 — Subir el proyecto a GitHub

1. Ve a **github.com** → botón verde **New** (o el ícono "+" arriba a la derecha → "New repository").
2. Ponle de nombre, por ejemplo, `xtudy-club`. Déjalo en **Public** o **Private** (cualquiera funciona con Vercel). No marques ninguna opción de "README" ni ".gitignore" (para evitar conflictos). Dale **Create repository**.
3. En la página que aparece, busca el link **"uploading an existing file"** (o "upload files").
4. Arrastra **todos los archivos y carpetas de este proyecto** ahí (menos la carpeta `node_modules` si llegara a existir — no debería, ya la quitamos).
5. Baja hasta abajo y dale **Commit changes**.

Listo, tu código ya está en GitHub.

## Paso 3 — Publicar en Vercel

1. Ve a **vercel.com** → **Sign up** → elige **"Continue with GitHub"** (así quedan conectados automáticamente).
2. Dale **Add New...** → **Project**.
3. Busca tu repositorio `xtudy-club` en la lista y dale **Import**.
4. Antes de darle a "Deploy", abre la sección **Environment Variables** y agrega estas dos (con los valores que copiaste en el Paso 1):
   - `VITE_SUPABASE_URL` → tu Project URL
   - `VITE_SUPABASE_ANON_KEY` → tu anon public key
5. Dale **Deploy**. Espera 1-2 minutos.

Al terminar, Vercel te da un link real, algo como `xtudy-club.vercel.app` — esa es tu página, ya funcionando de verdad, sin depender de Claude ni pedir inicio de sesión a nadie.

## Paso 4 — Migrar tus registros actuales (si ya tenías gente registrada)

Si ya tenías estudiantes registrados en la versión publicada desde Claude:
1. Entra al panel de administrador de esa versión anterior y dale a **"Exportar registros (CSV)"** y **"Exportar canjes (CSV)"**.
2. Guárdame esos dos archivos — te ayudo a importarlos a la base de datos nueva de Supabase para que nadie se pierda.

## Cuando quieras actualizar la app más adelante

Cada vez que yo te dé una versión nueva del código:
1. Reemplaza el archivo `src/App.jsx` en tu repositorio de GitHub con el nuevo (puedes editarlo directo en la web de GitHub, o subir el archivo de nuevo).
2. Vercel detecta el cambio solo y vuelve a publicar automáticamente — no hay que hacer nada más.
