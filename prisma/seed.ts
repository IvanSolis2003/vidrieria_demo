import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { contenidoDefault } from "../src/lib/contenido";

const prisma = new PrismaClient();

const testimonios = [
  {
    nombre: "Carolina M.",
    comuna: "Talca",
    servicio: "Ventanas PVC",
    rating: 5,
    texto:
      "Cambiamos todas las ventanas de la casa a PVC y se nota muchisimo el silencio y el calor que se mantiene. El equipo fue puntual y ordenado.",
  },
  {
    nombre: "Rodrigo S.",
    comuna: "Curico",
    servicio: "Termopanel",
    rating: 5,
    texto:
      "Excelente asesoria con el termopanel. Me explicaron las opciones sin apuro y el resultado quedo impecable. Totalmente recomendables.",
  },
  {
    nombre: "Fernanda P.",
    comuna: "San Clemente",
    servicio: "Shower door",
    rating: 5,
    texto:
      "Instalaron el shower door del bano principal en una manana. Muy prolijos y el vidrio quedo perfecto. Volveria a contratarlos.",
  },
  {
    nombre: "Jorge V.",
    comuna: "Linares",
    servicio: "Vidrios dimensionados",
    rating: 4,
    texto:
      "Necesitaba vidrios templados a medida para la cocina y los tuvieron listos rapido. Buen precio y buena atencion.",
  },
  {
    nombre: "Marcela A.",
    comuna: "Maule",
    servicio: "Cierre de terraza",
    rating: 5,
    texto:
      "Nos cerraron la terraza en aluminio y vidrio y ganamos un espacio nuevo en la casa. Cumplieron los plazos tal cual.",
  },
  {
    nombre: "Patricio L.",
    comuna: "Talca",
    servicio: "Ventanas PVC",
    rating: 5,
    texto:
      "Cotizacion clara desde el principio, sin sorpresas. La instalacion fue limpia y quedaron atentos ante cualquier duda.",
  },
];

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`;

const categorias = [
  {
    nombre: "Ventanas PVC",
    slug: "ventanas-pvc",
    descripcion:
      "Ventanas de PVC de alta hermeticidad y aislacion termica y acustica. Perfiles Veratec y Winhouse.",
    imagenUrl: img("1493809842364-78817add7ffb"),
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
    imagenUrl: img("1600607687939-ce8a6c25118c"),
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
    imagenUrl: img("1556909212-d5b604d0c90d"),
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
    imagenUrl: img("1584622650111-993a426fbf0a"),
    productos: [
      { nombre: "Shower door corredero", descripcion: "Sistema corredero para espacios reducidos." },
      { nombre: "Shower door abatible", descripcion: "Apertura clasica, elegante y funcional." },
    ],
  },
];

const proyectos = [
  { titulo: "Ventanas PVC en casa Talca", seed: "1449844908441-8829872d2607", destacado: true },
  { titulo: "Termopanel edificio corporativo", seed: "1600566753086-00f18fb6b3ea", destacado: true },
  { titulo: "Shower door bano principal", seed: "1620626011761-996317b8d101", destacado: true },
  { titulo: "Cierre de terraza en aluminio", seed: "1600210492486-724fe5c67fb0", destacado: false },
  { titulo: "Vidrios dimensionados para cocina", seed: "1556909212-d5b604d0c90d", destacado: false },
  { titulo: "Fachada vidriada local comercial", seed: "1615873968403-89e068629265", destacado: false },
];

async function main() {
  await prisma.cotizacionImagen.deleteMany();
  await prisma.cotizacion.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.proyecto.deleteMany();
  await prisma.testimonio.deleteMany();

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

  for (const t of testimonios) {
    await prisma.testimonio.create({ data: t });
  }

  await prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main", ...contenidoDefault },
  });

  const email = "admin@vidrieriademo.cl";
  const password = "demo1234";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.deleteMany();
  await prisma.adminUser.create({ data: { email, passwordHash } });

  console.log("Seed completado. Admin:", email, "/ password:", password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
