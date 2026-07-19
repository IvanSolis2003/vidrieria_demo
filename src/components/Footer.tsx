import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import { linkWhatsApp } from "@/lib/whatsapp";

const instagram = process.env.NEXT_PUBLIC_INSTAGRAM ?? "https://instagram.com/vidrieria.demo";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#151515", color: "#ddd", mt: 8, py: 5 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={3}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1 }}>
              VIDRIERÍA DEMO
            </Typography>
            <Typography variant="body2" color="#999">
              Aluminio · PVC · Vidrios — Talca, Region del Maule
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              component="a"
              href={linkWhatsApp("Hola, quiero mas informacion.")}
              target="_blank"
              rel="noopener"
              startIcon={<WhatsAppIcon />}
              variant="outlined"
              sx={{ color: "#fff", borderColor: "#444" }}
            >
              WhatsApp
            </Button>
            <Button
              component="a"
              href={instagram}
              target="_blank"
              rel="noopener"
              startIcon={<InstagramIcon />}
              variant="outlined"
              sx={{ color: "#fff", borderColor: "#444" }}
            >
              Instagram
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Typography variant="caption" color="#777" component={Link} href="/productos" sx={{ textDecoration: "none" }}>
            Productos
          </Typography>
          <Typography variant="caption" color="#777" component={Link} href="/proyectos" sx={{ textDecoration: "none" }}>
            Proyectos
          </Typography>
          <Typography variant="caption" color="#777" component={Link} href="/contacto" sx={{ textDecoration: "none" }}>
            Contacto
          </Typography>
        </Stack>

        <Typography variant="caption" color="#666" sx={{ display: "block", mt: 3 }}>
          © {new Date().getFullYear()} Vidriería Demo. Sitio de demostración.
        </Typography>
        <Typography variant="caption" color="#666" sx={{ display: "block", mt: 0.5 }}>
          Realizado por{" "}
          <Box
            component="a"
            href="https://iasmtech.com"
            target="_blank"
            rel="noopener"
            sx={{ color: "#aaa", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            iasmtech.com
          </Box>
        </Typography>
      </Container>
    </Box>
  );
}
