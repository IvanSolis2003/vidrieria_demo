# Vidriería Demo — Imperio PVC · Aluminio · Vidrios

Demo funcional del sitio web para **Imperio** (aluminio, PVC y vidrios). Incluye el sitio
público (catálogo + cotizador) y el panel de administración donde el dueño gestiona las
cotizaciones que le llegan.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| UI | MUI v6 |
| Base de datos | Neon Postgres |
| ORM | Prisma |
| Imágenes | Vercel Blob |
| Email | Resend |
| Auth panel | Auth.js v5 (email + contraseña) |
| Formularios | react-hook-form + zod |
| Hosting | Vercel |

Todos los servicios corren en su capa gratuita (free tier).

## Puesta en marcha local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Copiar `.env.example` a `.env.local` y completar los valores (ver sección Variables).
3. Aplicar el esquema a la base y cargar datos de ejemplo:
   ```bash
   npx prisma migrate dev
   npm run seed
   ```
4. Levantar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Variables de entorno

Ver [.env.example](.env.example). Necesitas cuentas gratuitas en:

- **Neon** (https://neon.tech) → `DATABASE_URL`
- **Vercel Blob** (https://vercel.com/dashboard/stores) → `BLOB_READ_WRITE_TOKEN`
- **Resend** (https://resend.com) → `RESEND_API_KEY`
- `AUTH_SECRET` → generar con `npx auth secret`

## Estructura

- `/` — Home
- `/productos` — Productos y servicios
- `/proyectos` — Galería de obras
- `/contacto` — Datos de contacto
- `/cotizar` — Cotizador (stepper de 5 pasos)
- `/admin` — Panel protegido (cotizaciones + CRUD)

## Acceso al panel

El seed crea un usuario administrador inicial:

- **Email:** `admin@imperio.cl`
- **Contraseña:** `imperio123`

Cámbialos en producción (edita `prisma/seed.ts` o la tabla `AdminUser`).

## Plan de implementación

Ver [PLAN-IMPLEMENTACION-DEMO.md](PLAN-IMPLEMENTACION-DEMO.md).
