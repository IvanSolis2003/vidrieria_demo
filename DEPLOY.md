# Guía de deploy — Vidriería Demo

Pasos para poner el sitio en producción en Vercel (todo en free tier).

## 1. Crear las cuentas y obtener credenciales

### Neon (base de datos)
1. Entra a https://neon.tech y crea un proyecto.
2. Copia la connection string **pooled** (termina en `-pooler...`).
3. Ese valor va en `DATABASE_URL`.

### Vercel Blob (imágenes)
1. En https://vercel.com/dashboard/stores crea un store de tipo **Blob**.
2. Copia el token `BLOB_READ_WRITE_TOKEN`.
   (Al conectar el store al proyecto en Vercel, esta variable se agrega sola.)

### Resend (emails)
1. Entra a https://resend.com, crea una API key → `RESEND_API_KEY`.
2. Define el correo que recibe las notificaciones → `NOTIFY_EMAIL`.
3. Remitente: usa `onboarding@resend.dev` para pruebas o un dominio verificado.

### Auth
- Genera el secreto: `npx auth secret` → `AUTH_SECRET`.

## 2. Cargar el esquema y los datos

Con `DATABASE_URL` apuntando a Neon, desde local:

```bash
npx prisma migrate deploy   # o: npx prisma db push
npm run seed
```

El seed crea las categorías, proyectos y el usuario admin
(`admin@vidrieriademo.cl` / `demo1234`).

## 3. Deploy en Vercel

1. Sube el repo a GitHub (ya está en `IvanSolis2003/vidrieria_demo`).
2. En https://vercel.com/new importa el repositorio.
3. Framework: **Next.js** (autodetectado).
4. En **Environment Variables** agrega:
   - `DATABASE_URL`
   - `BLOB_READ_WRITE_TOKEN`
   - `RESEND_API_KEY`
   - `NOTIFY_EMAIL`
   - `RESEND_FROM`
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_WHATSAPP`
   - `NEXT_PUBLIC_INSTAGRAM`
5. Deploy. URL resultante aprox: `vidrieria-demo.vercel.app`.

> El build corre `prisma generate && next build` automáticamente (script `build`).

## 4. Post-deploy

- Entra a `/admin/login`, cambia las fotos de proyectos y textos desde el panel.
- Cambia la contraseña del admin (edita `AdminUser` en Neon o el seed).
- Verifica que llegue el email de notificación al enviar una cotización de prueba.
