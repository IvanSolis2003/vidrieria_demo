"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { cerrarSesion } from "../actions";

const links = [
  { href: "/admin/cotizaciones", label: "Cotizaciones" },
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/testimonios", label: "Testimonios" },
  { href: "/admin/nosotros", label: "Nosotros" },
  { href: "/admin/cuenta", label: "Mi cuenta" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1, flexWrap: "wrap" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, color: "#fff", mr: 2 }}>
            VIDRIERÍA DEMO · Panel
          </Typography>

          <Box sx={{ flexGrow: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {links.map((l) => {
              const activo = pathname.startsWith(l.href);
              return (
                <Button
                  key={l.href}
                  component={Link}
                  href={l.href}
                  sx={{
                    color: "#fff",
                    borderBottom: activo ? "2px solid" : "2px solid transparent",
                    borderColor: activo ? "primary.main" : "transparent",
                    borderRadius: 0,
                  }}
                >
                  {l.label}
                </Button>
              );
            })}
          </Box>

          <Button component="a" href="/" target="_blank" sx={{ color: "#bbb" }}>
            Ver sitio
          </Button>
          <Box component="form" action={cerrarSesion}>
            <Button type="submit" variant="outlined" sx={{ color: "#fff", borderColor: "#555" }}>
              Cerrar sesion
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
