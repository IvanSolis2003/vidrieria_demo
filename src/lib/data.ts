import { prisma } from "@/lib/prisma";
import { contenidoDefault } from "@/lib/contenido";

export async function getCategorias() {
  try {
    return await prisma.categoria.findMany({
      orderBy: { nombre: "asc" },
      include: { productos: true },
    });
  } catch {
    return [];
  }
}

export async function getCategoriaPorSlug(slug: string) {
  try {
    return await prisma.categoria.findUnique({
      where: { slug },
      include: { productos: true },
    });
  } catch {
    return null;
  }
}

export async function getProyectos(soloDestacados = false) {
  try {
    return await prisma.proyecto.findMany({
      where: soloDestacados ? { destacado: true } : undefined,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getTestimonios() {
  try {
    return await prisma.testimonio.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export async function getSiteContent() {
  try {
    const c = await prisma.siteContent.findUnique({ where: { id: "main" } });
    if (c) return c;
  } catch {
    return { id: "main", ...contenidoDefault };
  }
  return { id: "main", ...contenidoDefault };
}
