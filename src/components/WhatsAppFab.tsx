import Fab from "@mui/material/Fab";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { linkWhatsApp } from "@/lib/whatsapp";

export default function WhatsAppFab() {
  return (
    <Fab
      component="a"
      href={linkWhatsApp("Hola, vengo desde la web y quiero cotizar un proyecto.")}
      target="_blank"
      rel="noopener"
      aria-label="Escríbenos por WhatsApp"
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1200,
        bgcolor: "#25D366",
        color: "#fff",
        "&:hover": { bgcolor: "#1da851" },
      }}
    >
      <WhatsAppIcon />
    </Fab>
  );
}
