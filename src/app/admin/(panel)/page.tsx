import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function contar() {
  try {
    const [nuevas, total, proyectos] = await Promise.all([
      prisma.cotizacion.count({ where: { estado: "nueva" } }),
      prisma.cotizacion.count(),
      prisma.proyecto.count(),
    ]);
    return { nuevas, total, proyectos };
  } catch {
    return { nuevas: 0, total: 0, proyectos: 0 };
  }
}

function Tarjeta({ valor, label }: { valor: number; label: string }) {
  return (
    <Paper sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h3" color="primary" sx={{ fontWeight: 800 }}>
        {valor}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );
}

export default async function AdminHome() {
  const { nuevas, total, proyectos } = await contar();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Resumen
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Tarjeta valor={nuevas} label="Cotizaciones nuevas" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Tarjeta valor={total} label="Cotizaciones totales" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Tarjeta valor={proyectos} label="Proyectos publicados" />
        </Grid>
      </Grid>
      <Button component={Link} href="/admin/cotizaciones" variant="contained">
        Ver cotizaciones
      </Button>
    </Container>
  );
}
