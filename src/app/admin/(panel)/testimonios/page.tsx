import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getTestimonios } from "@/lib/data";
import TestimoniosManager from "./TestimoniosManager";

export const dynamic = "force-dynamic";

export default async function TestimoniosAdminPage() {
  const testimonios = await getTestimonios();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Testimonios
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Reseñas de clientes que se muestran en la home y en la página Nosotros.
      </Typography>
      <TestimoniosManager
        testimonios={testimonios.map((t) => ({
          id: t.id,
          nombre: t.nombre,
          comuna: t.comuna,
          servicio: t.servicio,
          rating: t.rating,
          texto: t.texto,
        }))}
      />
    </Container>
  );
}
