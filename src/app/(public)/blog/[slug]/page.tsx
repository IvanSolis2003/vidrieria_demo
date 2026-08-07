import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getBlogPostPorSlug } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostPorSlug(slug);
  if (!post) return { title: "Blog — Vidriería Demo" };

  const titulo = `${post.titulo} — Blog Vidriería Demo`;
  return {
    title: titulo,
    description: post.resumen,
    openGraph: {
      title: titulo,
      description: post.resumen,
      type: "article",
      images: post.imagenUrl ? [post.imagenUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostPorSlug(slug);

  if (!post || !post.publicado) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.titulo,
    description: post.resumen,
    image: post.imagenUrl ?? undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: "Vidriería Demo" },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Button component={Link} href="/blog" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        Volver al blog
      </Button>

      <Typography variant="h3" gutterBottom>
        {post.titulo}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {new Date(post.createdAt).toLocaleDateString("es-CL", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Typography>

      {post.imagenUrl && (
        <Box
          component="img"
          src={post.imagenUrl}
          alt={post.titulo}
          sx={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 2, mb: 4 }}
        />
      )}

      <Box>
        {post.contenido.split("\n").map((parrafo, i) =>
          parrafo.trim() ? (
            <Typography key={i} variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
              {parrafo}
            </Typography>
          ) : null,
        )}
      </Box>

      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Button component={Link} href="/cotizar" variant="contained" size="large">
          Cotiza tu proyecto
        </Button>
      </Box>
    </Container>
  );
}
