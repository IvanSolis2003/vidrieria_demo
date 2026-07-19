import { z } from "zod";

export const vanoSchema = z.object({
  alto: z.coerce.number().positive("Ingresa un alto valido"),
  ancho: z.coerce.number().positive("Ingresa un ancho valido"),
});

export const cotizacionSchema = z.object({
  categoriaId: z.string().min(1, "Selecciona un tipo de trabajo"),
  vanos: z.array(vanoSchema).min(1, "Agrega al menos una medida"),
  imagenes: z.array(z.string().url()).default([]),
  nombre: z.string().min(2, "Ingresa tu nombre"),
  telefono: z
    .string()
    .min(8, "Ingresa un telefono valido")
    .regex(/^[0-9+\s]+$/, "Solo numeros"),
  comuna: z.string().optional().default(""),
});

export type CotizacionInput = z.infer<typeof cotizacionSchema>;
export type Vano = z.infer<typeof vanoSchema>;
