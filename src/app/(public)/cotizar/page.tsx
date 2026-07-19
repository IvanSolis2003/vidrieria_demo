import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Cotizador from "./Cotizador";
import { getCategorias } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cotizar — Imperio",
};

export default async function CotizarPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const categorias = await getCategorias();

  if (categorias.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Cotizador
        </Typography>
        <Typography color="text.secondary">
          No hay categorias cargadas todavia. Ejecuta el seed de la base de datos.
        </Typography>
      </Container>
    );
  }

  const simples = categorias.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    slug: c.slug,
    descripcion: c.descripcion,
    imagenUrl: c.imagenUrl,
  }));

  return <Cotizador categorias={simples} categoriaInicial={categoria} />;
}
