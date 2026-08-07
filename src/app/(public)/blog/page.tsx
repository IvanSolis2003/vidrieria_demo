import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { getBlogPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog — Vidriería Demo",
  description:
    "Consejos y guías sobre ventanas de PVC, aluminio, termopanel y vidrios: cómo elegir, mantener y aprovechar mejor cada solución.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Blog
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        Consejos y guías sobre ventanas, vidrios y termopanel.
      </Typography>

      {posts.length === 0 ? (
        <Typography color="text.secondary">
          Todavía no hay artículos publicados.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {posts.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardActionArea
                  component={Link}
                  href={`/blog/${p.slug}`}
                  sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
                >
                  {p.imagenUrl && (
                    <CardMedia component="img" height="180" image={p.imagenUrl} alt={p.titulo} />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {p.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {p.resumen}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
