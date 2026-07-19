import { Resend } from "resend";

type DatosEmail = {
  nombre: string;
  telefono: string;
  comuna?: string | null;
  categoria: string;
  vanos: { alto: number; ancho: number }[];
  imagenes: string[];
};

export async function notificarCotizacion(d: DatosEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const para = process.env.NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM ?? "Vidrieria Demo <onboarding@resend.dev>";

  if (!apiKey || !para || apiKey === "re_DUMMY") {
    console.warn("Resend no configurado: se omite el email de notificacion.");
    return;
  }

  const resend = new Resend(apiKey);

  const medidas = d.vanos
    .map((v, i) => `  ${i + 1}. ${v.alto} x ${v.ancho} cm`)
    .join("<br/>");
  const fotos = d.imagenes.length
    ? d.imagenes.map((u) => `<a href="${u}">${u}</a>`).join("<br/>")
    : "Sin fotos adjuntas";

  await resend.emails.send({
    from,
    to: para,
    subject: `Nueva cotizacion: ${d.categoria} — ${d.nombre}`,
    html: `
      <h2>Nueva cotizacion desde la web</h2>
      <p><b>Nombre:</b> ${d.nombre}</p>
      <p><b>Telefono:</b> ${d.telefono}</p>
      <p><b>Comuna:</b> ${d.comuna || "-"}</p>
      <p><b>Tipo de trabajo:</b> ${d.categoria}</p>
      <p><b>Medidas (alto x ancho):</b><br/>${medidas}</p>
      <p><b>Fotos:</b><br/>${fotos}</p>
    `,
  });
}
