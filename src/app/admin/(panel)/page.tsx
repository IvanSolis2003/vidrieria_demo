import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import { prisma } from "@/lib/prisma";
import GraficoBarras from "./GraficoBarras";

export const dynamic = "force-dynamic";

const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

type Metricas = {
  nuevas: number;
  contactado: number;
  cerrada: number;
  total: number;
  proyectos: number;
  testimonios: number;
  porMes: { label: string; valor: number }[];
  porCategoria: { label: string; valor: number }[];
};

async function cargar(): Promise<Metricas> {
  try {
    const [cotizaciones, categorias, proyectos, testimonios] = await Promise.all([
      prisma.cotizacion.findMany({ select: { estado: true, categoriaId: true, createdAt: true } }),
      prisma.categoria.findMany({ select: { id: true, nombre: true } }),
      prisma.proyecto.count(),
      prisma.testimonio.count(),
    ]);

    const nombreCat = new Map(categorias.map((c) => [c.id, c.nombre]));

    const ahora = new Date();
    const buckets: { label: string; clave: string; valor: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      buckets.push({ label: meses[d.getMonth()], clave: `${d.getFullYear()}-${d.getMonth()}`, valor: 0 });
    }
    const indice = new Map(buckets.map((b, i) => [b.clave, i]));

    const conteoCat = new Map<string, number>();
    for (const c of cotizaciones) {
      const d = new Date(c.createdAt);
      const idx = indice.get(`${d.getFullYear()}-${d.getMonth()}`);
      if (idx !== undefined) buckets[idx].valor++;
      const nombre = nombreCat.get(c.categoriaId) ?? "Sin categoria";
      conteoCat.set(nombre, (conteoCat.get(nombre) ?? 0) + 1);
    }

    const porCategoria = [...conteoCat.entries()]
      .map(([label, valor]) => ({ label, valor }))
      .sort((a, b) => b.valor - a.valor);

    return {
      nuevas: cotizaciones.filter((c) => c.estado === "nueva").length,
      contactado: cotizaciones.filter((c) => c.estado === "contactado").length,
      cerrada: cotizaciones.filter((c) => c.estado === "cerrada").length,
      total: cotizaciones.length,
      proyectos,
      testimonios,
      porMes: buckets.map((b) => ({ label: b.label, valor: b.valor })),
      porCategoria,
    };
  } catch {
    return {
      nuevas: 0,
      contactado: 0,
      cerrada: 0,
      total: 0,
      proyectos: 0,
      testimonios: 0,
      porMes: [],
      porCategoria: [],
    };
  }
}

function Tile({ valor, label, color }: { valor: number; label: string; color?: string }) {
  return (
    <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
      <Typography variant="h3" sx={{ fontWeight: 800, color: color ?? "primary.main" }}>
        {valor}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );
}

export default async function AdminHome() {
  const m = await cargar();
  const maxCat = Math.max(1, ...m.porCategoria.map((c) => c.valor));

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Resumen
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Tile valor={m.nuevas} label="Cotizaciones nuevas" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Tile valor={m.total} label="Cotizaciones totales" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Tile valor={m.proyectos} label="Proyectos" color="#1a1a1a" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Tile valor={m.testimonios} label="Testimonios" color="#1a1a1a" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Cotizaciones por mes
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Últimos 6 meses
            </Typography>
            <GraficoBarras datos={m.porMes} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Estado de cotizaciones
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              <EstadoLinea label="Nuevas" valor={m.nuevas} total={m.total} color="error" />
              <EstadoLinea label="Contactado" valor={m.contactado} total={m.total} color="warning" />
              <EstadoLinea label="Cerradas" valor={m.cerrada} total={m.total} color="success" />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cotizaciones por categoría
            </Typography>
            {m.porCategoria.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Todavía no hay cotizaciones.
              </Typography>
            ) : (
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                {m.porCategoria.map((c) => (
                  <Box key={c.label}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">{c.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {c.valor}
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "#eee",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${(c.valor / maxCat) * 100}%`,
                          height: "100%",
                          bgcolor: "primary.main",
                          borderRadius: 4,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Button component={Link} href="/admin/cotizaciones" variant="contained">
          Ver cotizaciones
        </Button>
      </Box>
    </Container>
  );
}

function EstadoLinea({
  label,
  valor,
  total,
  color,
}: {
  label: string;
  valor: number;
  total: number;
  color: "error" | "warning" | "success";
}) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0;
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Chip size="small" label={label} color={color} variant="outlined" />
        <Typography variant="body2" color="text.secondary">
          {valor} · {pct}%
        </Typography>
      </Stack>
      <LinearProgress variant="determinate" value={pct} color={color} sx={{ height: 6, borderRadius: 3 }} />
    </Box>
  );
}
