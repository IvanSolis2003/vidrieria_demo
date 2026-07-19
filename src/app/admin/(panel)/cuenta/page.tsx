import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { auth } from "@/auth";
import CuentaForm from "./CuentaForm";

export const dynamic = "force-dynamic";

export default async function CuentaPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Mi cuenta
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Cambia la contrasena de acceso al panel.
      </Typography>
      <CuentaForm email={email} />
    </Container>
  );
}
