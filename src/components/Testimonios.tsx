import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

type Testimonio = {
  id: string;
  nombre: string;
  comuna: string | null;
  servicio: string | null;
  rating: number;
  texto: string;
};

export default function Testimonios({ testimonios }: { testimonios: Testimonio[] }) {
  if (testimonios.length === 0) return null;

  return (
    <Grid container spacing={3}>
      {testimonios.map((t) => (
        <Grid key={t.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <FormatQuoteIcon sx={{ color: "primary.main", fontSize: 32 }} />
              <Rating value={t.rating} readOnly size="small" sx={{ display: "block", mb: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t.texto}
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                  {t.nombre.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">{t.nombre}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {[t.comuna, t.servicio].filter(Boolean).join(" · ")}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
