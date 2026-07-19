import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { prisma } from "@/lib/prisma";
import CotizacionesLista from "./CotizacionesLista";

export const dynamic = "force-dynamic";

type Vano = { alto: number; ancho: number };

async function cargar() {
  try {
    const [cotizaciones, categorias] = await Promise.all([
      prisma.cotizacion.findMany({
        orderBy: { createdAt: "desc" },
        include: { imagenes: true },
      }),
      prisma.categoria.findMany(),
    ]);
    const mapa = new Map(categorias.map((c) => [c.id, c.nombre]));
    return { cotizaciones, mapa };
  } catch {
    return { cotizaciones: [], mapa: new Map<string, string>() };
  }
}

export default async function CotizacionesPage() {
  const { cotizaciones, mapa } = await cargar();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Cotizaciones
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Ordenadas por fecha, las nuevas primero. Filtra por estado o busca por nombre.
      </Typography>

      {cotizaciones.length === 0 ? (
        <Typography color="text.secondary">Todavia no hay cotizaciones.</Typography>
      ) : (
        <CotizacionesLista
          cotizaciones={cotizaciones.map((c) => ({
            id: c.id,
            nombre: c.nombre,
            telefono: c.telefono,
            comuna: c.comuna,
            categoria: mapa.get(c.categoriaId) ?? "Sin categoria",
            estado: c.estado,
            createdAt: new Date(c.createdAt).toLocaleDateString("es-CL"),
            vanos: (c.vanos as Vano[]) ?? [],
            imagenes: c.imagenes.map((i) => i.url),
          }))}
        />
      )}
    </Container>
  );
}
