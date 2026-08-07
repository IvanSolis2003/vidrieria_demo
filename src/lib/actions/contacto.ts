"use server";

import { prisma } from "@/lib/prisma";
import { contactoSchema, type ContactoInput } from "@/lib/schemas";
import { notificarContacto } from "@/lib/resend";

type Resultado = { ok: true } | { ok: false; error: string };

export async function enviarContacto(
  data: ContactoInput,
  honeypot?: string,
): Promise<Resultado> {
  if (honeypot && honeypot.trim() !== "") {
    return { ok: true };
  }

  const parsed = contactoSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: "Revisa los datos del formulario." };
  }
  const d = parsed.data;

  try {
    await prisma.mensajeContacto.create({
      data: {
        nombre: d.nombre,
        email: d.email,
        tipoConsulta: d.tipoConsulta,
        mensaje: d.mensaje,
      },
    });

    await notificarContacto(d);

    return { ok: true };
  } catch (e) {
    console.error("Error al guardar mensaje de contacto:", e);
    return { ok: false, error: "No se pudo enviar tu mensaje. Intenta de nuevo." };
  }
}
