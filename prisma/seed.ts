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

const faqs = [
  {
    orden: 1,
    pregunta: "¿Cuánto demora la instalación?",
    respuesta:
      "Depende del proyecto: una ventana individual puede instalarse en un dia, mientras que un proyecto completo de casa toma entre 3 y 5 dias habiles. Te damos un plazo exacto despues de la visita tecnica.",
  },
  {
    orden: 2,
    pregunta: "¿La visita para cotizar tiene costo?",
    respuesta:
      "No, la medicion y asesoria tecnica en terreno no tienen costo. Vamos, tomamos las medidas exactas y te entregamos una cotizacion detallada.",
  },
  {
    orden: 3,
    pregunta: "¿Qué garantía tienen los trabajos?",
    respuesta:
      "Todos nuestros trabajos incluyen garantia por escrito en fabricacion e instalacion. Si algo falla dentro del periodo de garantia, respondemos sin costo para ti.",
  },
  {
    orden: 4,
    pregunta: "¿Trabajan fuera de Talca?",
    respuesta:
      "Si, cubrimos Talca y comunas cercanas de la Region del Maule como San Clemente, Curico y Linares. Consultanos por tu comuna si no estas seguro.",
  },
  {
    orden: 5,
    pregunta: "¿Puedo elegir el color del perfil?",
    respuesta:
      "Si, la mayoria de nuestros productos estan disponibles en varios colores (blanco, grafito, roble, nogal, negro, entre otros segun la linea). Lo vemos juntos en la visita tecnica.",
  },
  {
    orden: 6,
    pregunta: "¿Cómo se paga el trabajo?",
    respuesta:
      "Habitualmente se solicita un anticipo al confirmar el pedido y el saldo contra entrega/instalacion. Los medios de pago se coordinan directamente contigo.",
  },
];

const categorias = [
  {
    nombre: "Ventanas PVC",
    slug: "ventanas-pvc",
    descripcion:
      "Ventanas de PVC de alta hermeticidad y aislacion termica y acustica. Perfiles Veratec y Winhouse.",
    imagenUrl: img("1493809842364-78817add7ffb"),
    precioM2: 120000,
    colores: "Blanco, Grafito, Roble, Nogal, Negro",
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
    precioM2: 95000,
    colores: "Blanco, Gris, Negro",
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
    precioM2: 45000,
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
    precioM2: 85000,
    colores: "Transparente, Esmerilado",
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

const blogPosts = [
  {
    titulo: "PVC vs Aluminio: ¿cuál conviene para tus ventanas?",
    slug: "pvc-vs-aluminio",
    resumen:
      "Comparamos aislación térmica, mantención y precio entre PVC y aluminio para ayudarte a decidir.",
    imagenUrl: img("1493809842364-78817add7ffb"),
    contenido:
      "El PVC destaca por su aislacion termica y acustica: al ser un material no conductor, mantiene mejor la temperatura interior y reduce el ruido exterior. Requiere poca mantencion, solo limpieza regular.\n\nEl aluminio es mas resistente estructuralmente y permite perfiles mas delgados, lo que da mas superficie de vidrio. Con ruptura de puente termico mejora bastante su aislacion, pero sigue siendo menos eficiente que el PVC.\n\nEn general, para climas con estaciones marcadas como el Maule, recomendamos PVC si buscas ahorro energetico, y aluminio si priorizas diseño minimalista o vanos muy grandes.",
  },
  {
    titulo: "Cómo elegir el termopanel adecuado para tu proyecto",
    slug: "como-elegir-termopanel",
    resumen:
      "Guía rápida para entender el DVH, el espesor de cámara de aire y cuándo conviene cada opción.",
    imagenUrl: img("1600607687939-ce8a6c25118c"),
    contenido:
      "El termopanel o DVH (doble vidriado hermetico) consiste en dos vidrios separados por una camara de aire o gas, que mejora la aislacion termica y acustica frente a un vidrio simple.\n\nEl espesor de la camara de aire influye directamente en el rendimiento: camaras mas anchas (16-20mm) ofrecen mejor aislacion, ideal para dormitorios o zonas con ruido exterior.\n\nSi tu proyecto esta cerca de una calle con trafico o buscas reducir el consumo de calefaccion, el termopanel es una excelente inversion a mediano plazo.",
  },
  {
    titulo: "Mantenimiento básico para que tus ventanas duren más",
    slug: "mantenimiento-ventanas",
    resumen:
      "Consejos simples de limpieza y revisión periódica para alargar la vida útil de tus ventanas.",
    imagenUrl: img("1600566753086-00f18fb6b3ea"),
    contenido:
      "Limpia los rieles y guias cada 2-3 meses para evitar acumulacion de tierra que dificulte el deslizamiento. Usa un paño humedo y evita productos abrasivos sobre el perfil.\n\nRevisa periodicamente los sellos de goma: si notas resequedad o grietas, es momento de reemplazarlos para mantener la hermeticidad.\n\nLubrica los herrajes y bisagras una vez al año con un lubricante siliconado, nunca con aceite, que puede atraer mas polvo.\n\nSi detectas condensacion excesiva entre los vidrios de un termopanel, puede indicar perdida de hermeticidad: contactanos para revisarlo.",
  },
];

async function main() {
  await prisma.cotizacionImagen.deleteMany();
  await prisma.cotizacion.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.proyecto.deleteMany();
  await prisma.testimonio.deleteMany();
  await prisma.antesDespues.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.blogPost.deleteMany();

  for (const c of categorias) {
    await prisma.categoria.create({
      data: {
        nombre: c.nombre,
        slug: c.slug,
        descripcion: c.descripcion,
        imagenUrl: c.imagenUrl,
        precioM2: c.precioM2,
        colores: "colores" in c ? c.colores : null,
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

  const antesDespues = [
    {
      titulo: "Cambio de ventanas de aluminio a PVC",
      imagenAntesUrl: img("1513694203232-719a280e022f"),
      imagenDespuesUrl: img("1493809842364-78817add7ffb"),
    },
    {
      titulo: "Renovacion de bano con shower door",
      imagenAntesUrl: img("1584622650111-993a426fbf0a"),
      imagenDespuesUrl: img("1620626011761-996317b8d101"),
    },
  ];
  for (const a of antesDespues) {
    await prisma.antesDespues.create({ data: a });
  }

  for (const f of faqs) {
    await prisma.faq.create({ data: f });
  }

  for (const p of blogPosts) {
    await prisma.blogPost.create({ data: p });
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
