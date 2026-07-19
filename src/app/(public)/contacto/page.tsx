import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import { linkWhatsApp, whatsappNumero } from "@/lib/whatsapp";

export const metadata = {
  title: "Contacto — Vidriería Demo",
};

const instagram = process.env.NEXT_PUBLIC_INSTAGRAM ?? "https://instagram.com/vidrieria.demo";

function telFormato(n: string) {
  return `+${n.slice(0, 2)} ${n.slice(2, 3)} ${n.slice(3, 7)} ${n.slice(7)}`;
}

export default function ContactoPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Contacto
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        Escribenos y coordinamos tu visita o cotizacion.
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}>
              <PhoneIcon color="primary" />
              <Box>
                <Typography variant="subtitle2">Telefono / WhatsApp</Typography>
                <Typography variant="body2" color="text.secondary">
                  {telFormato(whatsappNumero)}
                </Typography>
              </Box>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}>
              <PlaceIcon color="primary" />
              <Box>
                <Typography variant="subtitle2">Ubicacion</Typography>
                <Typography variant="body2" color="text.secondary">
                  Talca, Region del Maule, Chile
                </Typography>
              </Box>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}>
              <InstagramIcon color="primary" />
              <Box>
                <Typography variant="subtitle2">Instagram</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="a"
                  href={instagram}
                  target="_blank"
                  rel="noopener"
                  sx={{ textDecoration: "none" }}
                >
                  @vidrieria.demo
                </Typography>
              </Box>
            </Paper>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, bgcolor: "#151515", color: "#fff", height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Cotiza mas rapido por WhatsApp
            </Typography>
            <Typography variant="body2" color="#bbb" sx={{ mb: 3 }}>
              Cuentanos que necesitas y te respondemos a la brevedad. Puedes adjuntar fotos
              del lugar directamente en el chat.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                component="a"
                href={linkWhatsApp("Hola, quiero cotizar un proyecto.")}
                target="_blank"
                rel="noopener"
                variant="contained"
                startIcon={<WhatsAppIcon />}
                sx={{ bgcolor: "#25D366", "&:hover": { bgcolor: "#1da851" } }}
              >
                Abrir WhatsApp
              </Button>
              <Button href="/cotizar" variant="outlined" sx={{ color: "#fff", borderColor: "#555" }}>
                Usar el cotizador
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Donde estamos
        </Typography>
        <Box
          component="iframe"
          title="Ubicacion en Talca"
          src="https://www.google.com/maps?q=Talca,+Region+del+Maule,+Chile&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sx={{
            width: "100%",
            height: { xs: 300, md: 420 },
            border: 0,
            borderRadius: 2,
          }}
        />
      </Box>
    </Container>
  );
}
