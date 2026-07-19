import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getSiteContent } from "@/lib/data";
import ContenidoForm from "./ContenidoForm";

export const dynamic = "force-dynamic";

export default async function NosotrosAdminPage() {
  const c = await getSiteContent();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Nosotros
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Edita el texto, los números y la zona de cobertura que se muestran en la página Nosotros.
      </Typography>
      <ContenidoForm
        contenido={{
          nosotrosIntro: c.nosotrosIntro,
          aniosExperiencia: c.aniosExperiencia,
          proyectos: c.proyectos,
          coberturaZona: c.coberturaZona,
          garantia: c.garantia,
          coberturaTexto: c.coberturaTexto,
        }}
      />
    </Container>
  );
}
