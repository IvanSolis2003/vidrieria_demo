import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InstagramIcon from "@mui/icons-material/Instagram";
import AntesDespues from "@/components/AntesDespues";
import { getProyectos, getAntesDespues } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Proyectos — Vidriería Demo",
};

const instagram = process.env.NEXT_PUBLIC_INSTAGRAM ?? "https://instagram.com/vidrieria.demo";

export default async function ProyectosPage() {
  const [proyectos, antesDespues] = await Promise.all([
    getProyectos(),
    getAntesDespues(),
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 1 }}
      >
        <Typography variant="h4">Nuestros proyectos</Typography>
        <Button
          component="a"
          href={instagram}
          target="_blank"
          rel="noopener"
          variant="outlined"
          startIcon={<InstagramIcon />}
        >
          Siguenos en Instagram
        </Button>
      </Stack>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        Una muestra de trabajos realizados.
      </Typography>

      {proyectos.length === 0 ? (
        <Typography color="text.secondary">
          No hay proyectos cargados todavia. Ejecuta el seed de la base de datos.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {proyectos.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ position: "relative" }}>
                <CardMedia component="img" height="240" image={p.imagenUrl} alt={p.titulo} />
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle1">{p.titulo}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {antesDespues.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Antes y después
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Arrastra el control sobre cada imagen para ver la transformación.
          </Typography>
          <AntesDespues
            items={antesDespues.map((a) => ({
              id: a.id,
              titulo: a.titulo,
              imagenAntesUrl: a.imagenAntesUrl,
              imagenDespuesUrl: a.imagenDespuesUrl,
            }))}
          />
        </Box>
      )}

      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Button component={Link} href="/cotizar" variant="contained" size="large">
          Quiero algo asi, cotizar
        </Button>
      </Box>
    </Container>
  );
}
