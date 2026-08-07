import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getBlogPosts } from "@/lib/data";
import BlogManager from "./BlogManager";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const posts = await getBlogPosts(false);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Blog
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Artículos que se muestran en /blog y en la home. Los borradores no son visibles al público.
      </Typography>
      <BlogManager
        posts={posts.map((p) => ({
          id: p.id,
          titulo: p.titulo,
          slug: p.slug,
          resumen: p.resumen,
          contenido: p.contenido,
          imagenUrl: p.imagenUrl,
          publicado: p.publicado,
        }))}
      />
    </Container>
  );
}
