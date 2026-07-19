const numero = process.env.NEXT_PUBLIC_WHATSAPP ?? "56900000000";

export function linkWhatsApp(mensaje?: string): string {
  const base = `https://wa.me/${numero}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

export const whatsappNumero = numero;
