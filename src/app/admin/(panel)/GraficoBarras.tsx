import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Dato = { label: string; valor: number };

export default function GraficoBarras({ datos }: { datos: Dato[] }) {
  const max = Math.max(1, ...datos.map((d) => d.valor));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: 1.5,
        height: 180,
        px: 1,
      }}
    >
      {datos.map((d) => (
        <Box
          key={d.label}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "100%",
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
            {d.valor}
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: 44,
              height: `${(d.valor / max) * 100}%`,
              minHeight: d.valor > 0 ? 4 : 2,
              bgcolor: d.valor > 0 ? "primary.main" : "#e0e0e0",
              borderRadius: "4px 4px 0 0",
              transition: "height .2s",
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {d.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
