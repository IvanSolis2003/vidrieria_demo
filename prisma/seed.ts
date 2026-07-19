import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (seed: string) => `https://picsum.photos/seed/${seed}/900/650`;

const categorias = [
  {
    nombre: "Ventanas PVC",
    slug: "ventanas-pvc",
    descripcion:
      "Ventanas de PVC de alta hermeticidad y aislacion termica y acustica. Perfiles Veratec y Winhouse.",
    imagenUrl: img("ventanas-pvc"),
    productos: [
      { nombre: "Ventana corredera PVC", descripcion: "Ideal para living y dormitorios, facil operacion." },
      { nombre: "Ventana proyectante PVC", descripcion: "Apertura hacia afuera, excelente ventilacion." },
      { nombre: "Ventana oscilobatiente PVC", descripcion: "Doble apertura, maxima seguridad y hermeticidad." },
    ],
  },
  {
    nombre: "Termopanel / Monolitico",
    slug: "termopanel-monolitico",
    descripcion:
      "Vidrios termopanel (doble vidriado hermetico) y monolitico para todo tipo de proyecto.",
    imagenUrl: img("termopanel"),
    productos: [
      { nombre: "Termopanel DVH", descripcion: "Doble vidrio con camara de aire, ahorro energetico." },
      { nombre: "Vidrio monolitico", descripcion: "Vidrio simple templado o laminado segun uso." },
    ],
  },
  {
    nombre: "Vidrios dimensionados",
    slug: "vidrios-dimensionados",
    descripcion:
      "Vidrios cortados a medida: templados, laminados y flotados para mesones, cubiertas y mas.",
    imagenUrl: img("vidrios"),
    productos: [
      { nombre: "Vidrio templado a medida", descripcion: "Resistente y seguro, cortado a tu medida." },
      { nombre: "Vidrio laminado de seguridad", descripcion: "No se desarma al romperse, ideal seguridad." },
    ],
  },
  {
    nombre: "Shower door",
    slug: "shower-door",
    descripcion:
      "Separadores de bano en vidrio templado con herrajes de calidad. Instalacion incluida.",
    imagenUrl: img("shower-door"),
    productos: [
      { nombre: "Shower door corredero", descripcion: "Sistema corredero para espacios reducidos." },
      { nombre: "Shower door abatible", descripcion: "Apertura clasica, elegante y funcional." },
    ],
  },
];

const proyectos = [
  { titulo: "Ventanas PVC en casa Talca", seed: "proy-1", destacado: true },
  { titulo: "Termopanel edificio corporativo", seed: "proy-2", destacado: true },
  { titulo: "Shower door bano principal", seed: "proy-3", destacado: true },
  { titulo: "Cierre de terraza en aluminio", seed: "proy-4", destacado: false },
  { titulo: "Vidrios dimensionados para cocina", seed: "proy-5", destacado: false },
  { titulo: "Fachada vidriada local comercial", seed: "proy-6", destacado: false },
];

async function main() {
  await prisma.cotizacionImagen.deleteMany();
  await prisma.cotizacion.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.proyecto.deleteMany();

  for (const c of categorias) {
    await prisma.categoria.create({
      data: {
        nombre: c.nombre,
        slug: c.slug,
        descripcion: c.descripcion,
        imagenUrl: c.imagenUrl,
        productos: { create: c.productos },
      },
    });
  }

  for (const p of proyectos) {
    await prisma.proyecto.create({
      data: { titulo: p.titulo, imagenUrl: img(p.seed), destacado: p.destacado },
    });
  }

  const email = "admin@imperio.cl";
  const passwordHash = await bcrypt.hash("imperio123", 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log("Seed completado. Admin:", email, "/ password: imperio123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
