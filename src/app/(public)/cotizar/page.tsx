import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export const metadata = {
  title: "Cotizar — Imperio",
};

export default function CotizarPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Cotizador
      </Typography>
      <Typography color="text.secondary">Proximamente.</Typography>
    </Container>
  );
}
