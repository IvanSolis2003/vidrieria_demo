import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { prisma } from "@/lib/prisma";
import ProyectosManager from "./ProyectosManager";

export const dynamic = "force-dynamic";

async function cargar() {
  try {
    return await prisma.proyecto.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function ProyectosAdminPage() {
  const proyectos = await cargar();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Proyectos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Crea, edita o elimina las obras que se muestran en el sitio.
      </Typography>
      <ProyectosManager
        proyectos={proyectos.map((p) => ({
          id: p.id,
          titulo: p.titulo,
          imagenUrl: p.imagenUrl,
          destacado: p.destacado,
        }))}
      />
    </Container>
  );
}
