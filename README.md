# Vidriería Demo — PVC · Aluminio · Vidrios

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript) ![MUI](https://img.shields.io/badge/UI-Material%20UI%20v6-007FFF?logo=mui) ![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

Sitio demo completo para un negocio de vidriería (aluminio, PVC y vidrios): catálogo público, cotizador y un panel de administración con el que el dueño gestiona todo el contenido sin tocar código. Construido como proyecto de portafolio para mostrar qué tan rápido una PYME puede tener presencia digital autogestionable.

**En vivo:** [vidrieria-demo-xi.vercel.app](https://vidrieria-demo-xi.vercel.app/)
**Panel admin:** [/admin](https://vidrieria-demo-xi.vercel.app/admin) — `admin@vidrieriademo.cl` / `demo1234`

## Qué resuelve

Una vidriería típica no tiene sitio propio o depende de un flyer de WhatsApp para cotizar. Esta demo muestra el flujo completo: un cliente entra, pide una cotización subiendo fotos del proyecto, y el dueño la recibe, gestiona y responde desde un panel propio — sin depender de un desarrollador para actualizar productos, proyectos o testimonios.

## Features

**Sitio público**
- Home con categorías, proyectos destacados y testimonios.
- Catálogo de productos y galería de proyectos realizados.
- Página "Nosotros" (experiencia, cobertura, garantía) con testimonios.
- **Cotizador** — stepper de 5 pasos con subida de fotos (Vercel Blob), honeypot anti-spam, guardado en base de datos + email de aviso (Resend) + link directo a WhatsApp.
- Botón flotante de WhatsApp, favicon y Open Graph propios.

**Panel `/admin` (autogestión completa)**
- Cotizaciones: filtro por estado, búsqueda, paginación, cambio de estado, eliminar.
- Productos, categorías y proyectos: CRUD completo con subida de imagen a Blob.
- Testimonios: CRUD con calificación por estrellas.
- Contenido de la sección "Nosotros" (texto, estadísticas, zona de cobertura) editable desde un modelo `SiteContent`.
- Cuenta: cambio de contraseña del administrador.

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

## Arquitectura

- **Público vs. admin**: las rutas públicas leen directo de Postgres vía Prisma (Server Components); `/admin` está protegido por Auth.js y expone las mismas tablas en modo CRUD.
- **Cotizador**: formulario multi-paso que sube imágenes a Vercel Blob antes de persistir la cotización, dispara un email con Resend y arma un link de WhatsApp prellenado.
- **Contenido editable sin migraciones**: la sección "Nosotros" no vive hardcodeada — el modelo `SiteContent` guarda texto/estadísticas/cobertura para que el dueño la edite desde el panel.

### Modelo de datos

`Categoria`, `Producto`, `Cotizacion` + `CotizacionImagen`, `Proyecto`, `AdminUser`, `MensajeContacto`, `BlogPost`, `Testimonio`, `AntesDespues`, `Faq`, `SiteContent`. Ver [prisma/schema.prisma](prisma/schema.prisma).

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

## Estructura de rutas

- `/` — Home
- `/productos` — Productos y servicios
- `/proyectos` — Galería de obras
- `/nosotros` — Nosotros (experiencia, cobertura, garantía) + testimonios
- `/contacto` — Datos de contacto
- `/cotizar` — Cotizador (stepper de 5 pasos)
- `/admin` — Panel protegido (cotizaciones + CRUD)

## Acceso al panel

El seed crea un usuario administrador inicial:

- **Email:** `admin@vidrieriademo.cl`
- **Contraseña:** `demo1234`

Cámbialos en producción (edita `prisma/seed.ts` o la tabla `AdminUser`).

## Plan de implementación

Ver [PLAN-IMPLEMENTACION-DEMO.md](PLAN-IMPLEMENTACION-DEMO.md).

## Autor

**Iván Solís Manqueo** — Full Stack Developer, Talca, Chile
[iasmtech.com](https://iasmtech.com) · [ivan.solis20.m@gmail.com](mailto:ivan.solis20.m@gmail.com)

Proyecto de portafolio. Los datos de contacto del cliente real fueron reemplazados por valores de simulación.
