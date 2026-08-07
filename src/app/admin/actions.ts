"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth, signOut } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
  return session;
}

function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const estadosValidos = ["nueva", "contactado", "cerrada"];

export async function cambiarEstado(id: string, estado: string) {
  await requireAdmin();
  if (!estadosValidos.includes(estado)) return;
  await prisma.cotizacion.update({ where: { id }, data: { estado } });
  revalidatePath("/admin/cotizaciones");
}

export async function eliminarCotizacion(id: string) {
  await requireAdmin();
  await prisma.cotizacion.delete({ where: { id } });
  revalidatePath("/admin/cotizaciones");
  revalidatePath("/admin");
}

export async function marcarMensajeLeido(id: string, leido: boolean) {
  await requireAdmin();
  await prisma.mensajeContacto.update({ where: { id }, data: { leido } });
  revalidatePath("/admin/mensajes");
}

export async function eliminarMensaje(id: string) {
  await requireAdmin();
  await prisma.mensajeContacto.delete({ where: { id } });
  revalidatePath("/admin/mensajes");
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
  data: {
    nombre: string;
    descripcion: string;
    imagenUrl: string;
    precioM2: number | null;
    colores: string;
  },
) {
  await requireAdmin();
  await prisma.categoria.update({
    where: { id },
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      imagenUrl: data.imagenUrl || null,
      precioM2: data.precioM2,
      colores: data.colores || null,
    },
  });
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  revalidatePath("/cotizar");
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

export async function crearCategoria(data: {
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  precioM2: number | null;
  colores: string;
}) {
  await requireAdmin();
  if (!data.nombre.trim()) return;
  let slug = slugify(data.nombre);
  if (!slug) slug = `categoria-${Date.now()}`;
  const existe = await prisma.categoria.findUnique({ where: { slug } });
  if (existe) slug = `${slug}-${Date.now()}`;
  await prisma.categoria.create({
    data: {
      nombre: data.nombre,
      slug,
      descripcion: data.descripcion || null,
      imagenUrl: data.imagenUrl || null,
      precioM2: data.precioM2,
      colores: data.colores || null,
    },
  });
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  revalidatePath("/cotizar");
  revalidatePath("/");
}

export async function eliminarCategoria(id: string) {
  await requireAdmin();
  await prisma.categoria.delete({ where: { id } });
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  revalidatePath("/");
}

export async function crearProducto(data: {
  categoriaId: string;
  nombre: string;
  descripcion: string;
}) {
  await requireAdmin();
  if (!data.categoriaId || !data.nombre.trim()) return;
  await prisma.producto.create({
    data: {
      categoriaId: data.categoriaId,
      nombre: data.nombre,
      descripcion: data.descripcion || null,
    },
  });
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
}

export async function eliminarProducto(id: string) {
  await requireAdmin();
  await prisma.producto.delete({ where: { id } });
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
}

export async function cambiarPassword(data: {
  actual: string;
  nueva: string;
}): Promise<{ ok: boolean; error?: string }> {
  const session = await requireAdmin();
  const email = session.user?.email;
  if (!email) return { ok: false, error: "Sesion invalida." };
  if (data.nueva.length < 6) {
    return { ok: false, error: "La nueva contrasena debe tener al menos 6 caracteres." };
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return { ok: false, error: "Usuario no encontrado." };

  const ok = await bcrypt.compare(data.actual, user.passwordHash);
  if (!ok) return { ok: false, error: "La contrasena actual es incorrecta." };

  const passwordHash = await bcrypt.hash(data.nueva, 10);
  await prisma.adminUser.update({ where: { email }, data: { passwordHash } });
  return { ok: true };
}

type TestimonioData = {
  nombre: string;
  comuna: string;
  servicio: string;
  rating: number;
  texto: string;
};

export async function crearTestimonio(data: TestimonioData) {
  await requireAdmin();
  if (!data.nombre.trim() || !data.texto.trim()) return;
  await prisma.testimonio.create({
    data: {
      nombre: data.nombre,
      comuna: data.comuna || null,
      servicio: data.servicio || null,
      rating: Math.min(5, Math.max(1, data.rating)),
      texto: data.texto,
    },
  });
  revalidatePath("/admin/testimonios");
  revalidatePath("/nosotros");
  revalidatePath("/");
}

export async function actualizarTestimonio(id: string, data: TestimonioData) {
  await requireAdmin();
  await prisma.testimonio.update({
    where: { id },
    data: {
      nombre: data.nombre,
      comuna: data.comuna || null,
      servicio: data.servicio || null,
      rating: Math.min(5, Math.max(1, data.rating)),
      texto: data.texto,
    },
  });
  revalidatePath("/admin/testimonios");
  revalidatePath("/nosotros");
  revalidatePath("/");
}

export async function eliminarTestimonio(id: string) {
  await requireAdmin();
  await prisma.testimonio.delete({ where: { id } });
  revalidatePath("/admin/testimonios");
  revalidatePath("/nosotros");
  revalidatePath("/");
}

type AntesDespuesData = {
  titulo: string;
  imagenAntesUrl: string;
  imagenDespuesUrl: string;
};

export async function crearAntesDespues(data: AntesDespuesData) {
  await requireAdmin();
  if (!data.titulo.trim() || !data.imagenAntesUrl || !data.imagenDespuesUrl) return;
  await prisma.antesDespues.create({ data });
  revalidatePath("/admin/antes-despues");
  revalidatePath("/proyectos");
}

export async function actualizarAntesDespues(id: string, data: AntesDespuesData) {
  await requireAdmin();
  await prisma.antesDespues.update({ where: { id }, data });
  revalidatePath("/admin/antes-despues");
  revalidatePath("/proyectos");
}

export async function eliminarAntesDespues(id: string) {
  await requireAdmin();
  await prisma.antesDespues.delete({ where: { id } });
  revalidatePath("/admin/antes-despues");
  revalidatePath("/proyectos");
}

type FaqData = { pregunta: string; respuesta: string; orden: number };

export async function crearFaq(data: FaqData) {
  await requireAdmin();
  if (!data.pregunta.trim() || !data.respuesta.trim()) return;
  await prisma.faq.create({ data });
  revalidatePath("/admin/faq");
  revalidatePath("/nosotros");
}

export async function actualizarFaq(id: string, data: FaqData) {
  await requireAdmin();
  await prisma.faq.update({ where: { id }, data });
  revalidatePath("/admin/faq");
  revalidatePath("/nosotros");
}

export async function eliminarFaq(id: string) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faq");
  revalidatePath("/nosotros");
}

type BlogPostData = {
  titulo: string;
  resumen: string;
  contenido: string;
  imagenUrl: string;
  publicado: boolean;
};

export async function crearBlogPost(data: BlogPostData) {
  await requireAdmin();
  if (!data.titulo.trim() || !data.contenido.trim()) return;
  let slug = slugify(data.titulo);
  if (!slug) slug = `post-${Date.now()}`;
  const existe = await prisma.blogPost.findUnique({ where: { slug } });
  if (existe) slug = `${slug}-${Date.now()}`;
  await prisma.blogPost.create({
    data: {
      titulo: data.titulo,
      slug,
      resumen: data.resumen,
      contenido: data.contenido,
      imagenUrl: data.imagenUrl || null,
      publicado: data.publicado,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
}

export async function actualizarBlogPost(id: string, data: BlogPostData) {
  await requireAdmin();
  await prisma.blogPost.update({
    where: { id },
    data: {
      titulo: data.titulo,
      resumen: data.resumen,
      contenido: data.contenido,
      imagenUrl: data.imagenUrl || null,
      publicado: data.publicado,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
}

export async function eliminarBlogPost(id: string) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
}

export async function actualizarContenido(data: {
  nosotrosIntro: string;
  aniosExperiencia: string;
  proyectos: string;
  coberturaZona: string;
  garantia: string;
  coberturaTexto: string;
}) {
  await requireAdmin();
  await prisma.siteContent.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  });
  revalidatePath("/admin/nosotros");
  revalidatePath("/nosotros");
}

export async function cerrarSesion() {
  await signOut({ redirectTo: "/admin/login" });
}
