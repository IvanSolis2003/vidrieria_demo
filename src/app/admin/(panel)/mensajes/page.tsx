import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { prisma } from "@/lib/prisma";
import MensajeRow from "./MensajeRow";

export const dynamic = "force-dynamic";

async function cargar() {
  try {
    return await prisma.mensajeContacto.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function MensajesPage() {
  const mensajes = await cargar();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Mensajes de contacto
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Enviados desde el formulario de contacto del sitio (home y página Contacto).
      </Typography>

      {mensajes.length === 0 ? (
        <Typography color="text.secondary">Todavía no hay mensajes.</Typography>
      ) : (
        <Stack spacing={2}>
          {mensajes.map((m) => (
            <MensajeRow
              key={m.id}
              id={m.id}
              nombre={m.nombre}
              email={m.email}
              tipoConsulta={m.tipoConsulta}
              mensaje={m.mensaje}
              leido={m.leido}
              createdAt={new Date(m.createdAt).toLocaleString("es-CL")}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}
