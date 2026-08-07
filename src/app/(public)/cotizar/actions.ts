"use server";

import { prisma } from "@/lib/prisma";
import { cotizacionSchema, OTRO_ID, type CotizacionInput } from "@/lib/schemas";
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
  const esOtro = d.categoriaId === OTRO_ID;

  try {
    let nombreCategoria = "Otro / Personalizado";

    if (!esOtro) {
      const categoria = await prisma.categoria.findUnique({
        where: { id: d.categoriaId },
      });
      if (!categoria) {
        return { ok: false, error: "La categoria seleccionada no existe." };
      }
      nombreCategoria = categoria.nombre;
    }

    await prisma.cotizacion.create({
      data: {
        categoriaId: esOtro ? null : d.categoriaId,
        detalle: esOtro ? d.detalle : null,
        vanos: esOtro ? [] : d.vanos,
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
      categoria: nombreCategoria,
      vanos: esOtro ? [] : d.vanos,
      detalle: esOtro ? d.detalle : null,
      imagenes: d.imagenes,
    });

    const medidas = esOtro
      ? d.detalle
      : d.vanos.map((v, i) => `${i + 1}) ${v.alto}x${v.ancho} cm`).join(", ");
    const mensaje = `Hola! Soy ${d.nombre}. Quiero cotizar: ${nombreCategoria}. ${esOtro ? "Detalle" : "Medidas"}: ${medidas}. Comuna: ${d.comuna || "-"}. Telefono: ${d.telefono}.`;

    return { ok: true, whatsappUrl: linkWhatsApp(mensaje) };
  } catch (e) {
    console.error("Error al crear cotizacion:", e);
    return { ok: false, error: "No se pudo guardar la cotizacion. Intenta de nuevo." };
  }
}
