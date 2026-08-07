import { z } from "zod";

export const vanoSchema = z.object({
  alto: z.coerce.number().positive("Ingresa un alto valido"),
  ancho: z.coerce.number().positive("Ingresa un ancho valido"),
});

export const OTRO_ID = "otro" as const;

export const cotizacionSchema = z
  .object({
    categoriaId: z.string().min(1, "Selecciona un tipo de trabajo"),
    vanos: z.array(vanoSchema).default([]),
    detalle: z.string().optional().default(""),
    imagenes: z.array(z.string().url()).default([]),
    nombre: z.string().min(2, "Ingresa tu nombre"),
    telefono: z
      .string()
      .min(8, "Ingresa un telefono valido")
      .regex(/^[0-9+\s]+$/, "Solo numeros"),
    comuna: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.categoriaId === OTRO_ID) {
      if (data.detalle.trim().length < 10) {
        ctx.addIssue({
          path: ["detalle"],
          code: z.ZodIssueCode.custom,
          message: "Cuéntanos qué necesitas (mínimo 10 caracteres)",
        });
      }
    } else if (data.vanos.length === 0) {
      ctx.addIssue({
        path: ["vanos"],
        code: z.ZodIssueCode.custom,
        message: "Agrega al menos una medida",
      });
    }
  });

export type CotizacionInput = z.infer<typeof cotizacionSchema>;
export type Vano = z.infer<typeof vanoSchema>;

export const tiposConsulta = [
  "Cotización",
  "Postventa / Garantía",
  "Trabajemos juntos",
  "Otros",
] as const;

export const contactoSchema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre"),
  email: z.string().email("Ingresa un email valido"),
  tipoConsulta: z.enum(tiposConsulta, { errorMap: () => ({ message: "Selecciona un tipo de consulta" }) }),
  mensaje: z.string().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)"),
});

export type ContactoInput = z.infer<typeof contactoSchema>;
