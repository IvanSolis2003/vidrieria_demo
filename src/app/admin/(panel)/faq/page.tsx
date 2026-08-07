import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getFaqs } from "@/lib/data";
import FaqManager from "./FaqManager";

export const dynamic = "force-dynamic";

export default async function FaqAdminPage() {
  const faqs = await getFaqs();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Preguntas frecuentes
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Se muestran en la página Nosotros, en formato acordeón.
      </Typography>
      <FaqManager
        faqs={faqs.map((f) => ({ id: f.id, pregunta: f.pregunta, respuesta: f.respuesta, orden: f.orden }))}
      />
    </Container>
  );
}
