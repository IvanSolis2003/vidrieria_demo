import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { prisma } from "@/lib/prisma";
import CotizacionRow from "./CotizacionRow";

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
        Ordenadas por fecha, las nuevas primero. Cambia el estado con el selector.
      </Typography>

      {cotizaciones.length === 0 ? (
        <Typography color="text.secondary">Todavia no hay cotizaciones.</Typography>
      ) : (
        <Stack spacing={2}>
          {cotizaciones.map((c) => (
            <CotizacionRow
              key={c.id}
              id={c.id}
              nombre={c.nombre}
              telefono={c.telefono}
              comuna={c.comuna}
              categoria={mapa.get(c.categoriaId) ?? "Sin categoria"}
              estado={c.estado}
              createdAt={new Date(c.createdAt).toLocaleDateString("es-CL")}
              vanos={(c.vanos as Vano[]) ?? []}
              imagenes={c.imagenes.map((i) => i.url)}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}
