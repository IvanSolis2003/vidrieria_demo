export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteTitulo = "Vidriería Demo — Aluminio, PVC y Vidrios";
export const siteDescripcion =
  "Ventanas de PVC, termopanel, vidrios dimensionados y shower door en Talca y la Región del Maule. Cotiza tu proyecto en línea.";
