import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CategoriaCard from "@/components/CategoriaCard";
import { getCategorias, getProyectos } from "@/lib/data";

export const dynamic = "force-dynamic";

const marcas = ["Veratec", "Winhouse", "Vidrios templados", "Termopanel DVH"];

export default async function Home() {
  const [categorias, proyectos] = await Promise.all([
    getCategorias(),
    getProyectos(true),
  ]);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          color: "#fff",
          backgroundImage:
            "linear-gradient(rgba(10,10,10,0.65), rgba(10,10,10,0.75)), url(https://picsum.photos/seed/imperio-hero/1600/900)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 14 } }}>
          <Box sx={{ maxWidth: 640 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
              Ventanas, vidrios y cierres a tu medida
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: "#ddd", fontWeight: 400 }}>
              PVC, termopanel, vidrios dimensionados y shower door. Trabajo profesional
              en Talca y la Region del Maule.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button component={Link} href="/cotizar" variant="contained" size="large">
                Cotiza tu proyecto
              </Button>
              <Button
                component={Link}
                href="/productos"
                variant="outlined"
                size="large"
                sx={{ color: "#fff", borderColor: "#fff" }}
              >
                Ver productos
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#f5f5f5", py: 3 }}>
        <Container maxWidth="lg">
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Trabajamos con:
            </Typography>
            {marcas.map((m) => (
              <Chip key={m} label={m} variant="outlined" />
            ))}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Productos y servicios
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Elige una categoria y cotiza en linea en pocos pasos.
        </Typography>

        {categorias.length === 0 ? (
          <Typography color="text.secondary">
            No hay categorias cargadas todavia. Ejecuta el seed de la base de datos.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {categorias.map((c) => (
              <Grid key={c.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <CategoriaCard
                  nombre={c.nombre}
                  slug={c.slug}
                  descripcion={c.descripcion}
                  imagenUrl={c.imagenUrl}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {proyectos.length > 0 && (
        <Box sx={{ bgcolor: "#fafafa", py: 8 }}>
          <Container maxWidth="lg">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Typography variant="h4">Proyectos recientes</Typography>
              <Button component={Link} href="/proyectos">
                Ver todos
              </Button>
            </Stack>
            <Grid container spacing={3}>
              {proyectos.slice(0, 3).map((p) => (
                <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card>
                    <CardMedia component="img" height="220" image={p.imagenUrl} alt={p.titulo} />
                    <CardContent>
                      <Typography variant="subtitle1">{p.titulo}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
    </>
  );
}
