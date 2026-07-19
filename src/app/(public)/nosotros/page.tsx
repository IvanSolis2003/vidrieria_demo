import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PlaceIcon from "@mui/icons-material/Place";
import Testimonios from "@/components/Testimonios";
import { ventajas } from "@/lib/contenido";
import { getSiteContent, getTestimonios } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nosotros — Vidriería Demo",
};

export default async function NosotrosPage() {
  const [contenido, testimonios] = await Promise.all([
    getSiteContent(),
    getTestimonios(),
  ]);

  const stats = [
    { valor: contenido.aniosExperiencia, label: "años de experiencia" },
    { valor: contenido.proyectos, label: "proyectos instalados" },
    { valor: contenido.coberturaZona, label: "zona de cobertura" },
    { valor: contenido.garantia, label: "de garantía" },
  ];

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Nosotros
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 820 }}>
          {contenido.nosotrosIntro}
        </Typography>
      </Container>

      <Box sx={{ bgcolor: "#151515", color: "#fff", py: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((s) => (
              <Grid key={s.label} size={{ xs: 6, md: 3 }} sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 800 }}>
                  {s.valor}
                </Typography>
                <Typography variant="body2" color="#bbb">
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Por qué elegirnos
        </Typography>
        <Grid container spacing={3}>
          {ventajas.map((v) => (
            <Grid key={v.titulo} size={{ xs: 12, sm: 6 }}>
              <Paper variant="outlined" sx={{ p: 3, height: "100%", display: "flex", gap: 2 }}>
                <CheckCircleOutlineIcon color="primary" />
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {v.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {v.texto}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ p: 3, mt: 4, display: "flex", gap: 2, bgcolor: "#f5f5f5" }} elevation={0}>
          <PlaceIcon color="primary" />
          <Box>
            <Typography variant="subtitle1">Zona de cobertura</Typography>
            <Typography variant="body2" color="text.secondary">
              {contenido.coberturaTexto}
            </Typography>
          </Box>
        </Paper>
      </Container>

      {testimonios.length > 0 && (
        <Box sx={{ bgcolor: "#fafafa", py: 6 }}>
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ mb: 3 }}>
              Lo que dicen nuestros clientes
            </Typography>
            <Testimonios testimonios={testimonios} />
          </Container>
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <Button component={Link} href="/cotizar" variant="contained" size="large">
          Cotiza tu proyecto
        </Button>
      </Container>
    </>
  );
}
