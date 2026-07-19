import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getAntesDespues } from "@/lib/data";
import AntesDespuesManager from "./AntesDespuesManager";

export const dynamic = "force-dynamic";

export default async function AntesDespuesAdminPage() {
  const items = await getAntesDespues();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Antes y después
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Sube pares de fotos (antes y después) que se muestran en la página de Proyectos.
      </Typography>
      <AntesDespuesManager
        items={items.map((a) => ({
          id: a.id,
          titulo: a.titulo,
          imagenAntesUrl: a.imagenAntesUrl,
          imagenDespuesUrl: a.imagenDespuesUrl,
        }))}
      />
    </Container>
  );
}
