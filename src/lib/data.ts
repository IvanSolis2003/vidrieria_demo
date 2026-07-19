import { prisma } from "@/lib/prisma";

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
