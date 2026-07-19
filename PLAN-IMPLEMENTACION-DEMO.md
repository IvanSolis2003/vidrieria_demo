# PLAN DE IMPLEMENTACIÓN — "Vidriería Demo" (Imperio PVC-Aluminio-Vidrios)

## 0. Objetivo

Demo **totalmente funcional** para mostrarle al dueño de Imperio el alcance completo del
sitio: la parte pública (catálogo + cotizador) y el lado de administración (recibir y
gestionar las cotizaciones). Mismo stack real de Bóveda, corriendo 100% en free tiers.

## 1. Stack

Next.js 15 (App Router) + TypeScript · MUI v6 · Neon Postgres · Prisma · Vercel Blob ·
Resend · Vercel Hosting · react-hook-form + zod · Auth.js v5 (email + contraseña).

## 2. Modelo de datos

Categoria, Producto, Cotizacion, CotizacionImagen, Proyecto, AdminUser.
Ver `prisma/schema.prisma`.

## 3. WhatsApp

- Botón flotante fijo en todas las páginas → `https://wa.me/56986001008`.
- Al completar el cotizador se guarda en Neon y se genera link de WhatsApp con el resumen.
- Notificación paralela a Imperio por correo vía Resend.

## 4. Instagram

- Botón "Síguenos" → link directo al perfil (sin API).
- Galería de "Proyectos" curada manualmente en tabla `Proyecto`.

## 5. Páginas

Home · Productos y Servicios · Cotizador · Nosotros/Proyectos · Contacto.

## 6. Cotizador (5 pasos)

1. Tipo de trabajo · 2. Dimensiones · 3. Fotos (Vercel Blob, compresión WebP) ·
4. Datos de contacto · 5. Resumen → Server Action guarda en Neon + email Resend + link WhatsApp.

## 7. Panel /admin

Protegido con Auth.js v5. Cotizaciones (cambio de estado), CRUD de proyectos, edición
básica de productos/categorías.

## 8. Paleta

Primary rojo Imperio (#C8102E), header negro/gris oscuro, contenido blanco, acentos gris metálico.

## 9. Fases

1. Setup base · 2. Seed + páginas públicas · 3. Cotizador · 4. Panel admin · 5. Deploy.

## 11. Reglas de trabajo

Sin comentarios en el código, cambios quirúrgicos, sin dependencias no autorizadas, todo en
español, correr ESLint y `npm run build` al final.
