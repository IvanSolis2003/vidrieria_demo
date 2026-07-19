import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import CategoriaCard from "@/components/CategoriaCard";
import { getCategorias } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Productos y servicios — Vidriería Demo",
};

export default async function ProductosPage() {
  const categorias = await getCategorias();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Productos y servicios
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        Conoce nuestras lineas de trabajo. Cada una se puede cotizar en linea.
      </Typography>

      {categorias.length === 0 ? (
        <Typography color="text.secondary">
          No hay categorias cargadas todavia. Ejecuta el seed de la base de datos.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {categorias.map((c) => (
            <Grid key={c.id} size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CategoriaCard
                    nombre={c.nombre}
                    slug={c.slug}
                    descripcion={c.descripcion}
                    imagenUrl={c.imagenUrl}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Incluye:
                    </Typography>
                    <List dense disablePadding>
                      {c.productos.map((p, i) => (
                        <Box key={p.id}>
                          {i > 0 && <Divider component="li" />}
                          <ListItem disableGutters>
                            <ListItemText primary={p.nombre} secondary={p.descripcion} />
                          </ListItem>
                        </Box>
                      ))}
                    </List>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
