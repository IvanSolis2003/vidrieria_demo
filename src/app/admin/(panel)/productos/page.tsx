import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getCategorias } from "@/lib/data";
import ProductosManager from "./ProductosManager";

export const dynamic = "force-dynamic";

export default async function ProductosAdminPage() {
  const categorias = await getCategorias();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Productos y categorias
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Edita los textos e imagenes que se muestran en el sitio, sin tocar codigo.
      </Typography>
      <ProductosManager
        categorias={categorias.map((c) => ({
          id: c.id,
          nombre: c.nombre,
          descripcion: c.descripcion,
          imagenUrl: c.imagenUrl,
          productos: c.productos.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
          })),
        }))}
      />
    </Container>
  );
}
