"use server";

import { prisma } from "@/lib/prisma";
import { cotizacionSchema, type CotizacionInput } from "@/lib/schemas";
import { notificarCotizacion } from "@/lib/resend";
import { linkWhatsApp } from "@/lib/whatsapp";

type Resultado =
  | { ok: true; whatsappUrl: string }
  | { ok: false; error: string };

export async function crearCotizacion(
  data: CotizacionInput,
  honeypot?: string,
): Promise<Resultado> {
  if (honeypot && honeypot.trim() !== "") {
    return { ok: true, whatsappUrl: linkWhatsApp() };
  }

  const parsed = cotizacionSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: "Datos invalidos. Revisa el formulario." };
  }
  const d = parsed.data;

  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: d.categoriaId },
    });
    if (!categoria) {
      return { ok: false, error: "La categoria seleccionada no existe." };
    }

    await prisma.cotizacion.create({
      data: {
        categoriaId: d.categoriaId,
        vanos: d.vanos,
        nombre: d.nombre,
        telefono: d.telefono,
        comuna: d.comuna || null,
        imagenes: {
          create: d.imagenes.map((url) => ({ url })),
        },
      },
    });

    await notificarCotizacion({
      nombre: d.nombre,
      telefono: d.telefono,
      comuna: d.comuna,
      categoria: categoria.nombre,
      vanos: d.vanos,
      imagenes: d.imagenes,
    });

    const medidas = d.vanos
      .map((v, i) => `${i + 1}) ${v.alto}x${v.ancho} cm`)
      .join(", ");
    const mensaje = `Hola! Soy ${d.nombre}. Quiero cotizar: ${categoria.nombre}. Medidas: ${medidas}. Comuna: ${d.comuna || "-"}. Telefono: ${d.telefono}.`;

    return { ok: true, whatsappUrl: linkWhatsApp(mensaje) };
  } catch (e) {
    console.error("Error al crear cotizacion:", e);
    return { ok: false, error: "No se pudo guardar la cotizacion. Intenta de nuevo." };
  }
}
