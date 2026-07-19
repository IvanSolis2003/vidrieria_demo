"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth, signOut } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

const estadosValidos = ["nueva", "contactado", "cerrada"];

export async function cambiarEstado(id: string, estado: string) {
  await requireAdmin();
  if (!estadosValidos.includes(estado)) return;
  await prisma.cotizacion.update({ where: { id }, data: { estado } });
  revalidatePath("/admin/cotizaciones");
}

export async function crearProyecto(data: {
  titulo: string;
  imagenUrl: string;
  destacado: boolean;
}) {
  await requireAdmin();
  if (!data.titulo || !data.imagenUrl) return;
  await prisma.proyecto.create({ data });
  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
  revalidatePath("/");
}

export async function actualizarProyecto(
  id: string,
  data: { titulo: string; imagenUrl: string; destacado: boolean },
) {
  await requireAdmin();
  await prisma.proyecto.update({ where: { id }, data });
  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
  revalidatePath("/");
}

export async function eliminarProyecto(id: string) {
  await requireAdmin();
  await prisma.proyecto.delete({ where: { id } });
  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
  revalidatePath("/");
}

export async function actualizarCategoria(
  id: string,
  data: { nombre: string; descripcion: string; imagenUrl: string },
) {
  await requireAdmin();
  await prisma.categoria.update({
    where: { id },
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      imagenUrl: data.imagenUrl || null,
    },
  });
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  revalidatePath("/");
}

export async function actualizarProducto(
  id: string,
  data: { nombre: string; descripcion: string },
) {
  await requireAdmin();
  await prisma.producto.update({
    where: { id },
    data: { nombre: data.nombre, descripcion: data.descripcion || null },
  });
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
}

export async function cerrarSesion() {
  await signOut({ redirectTo: "/admin/login" });
}
