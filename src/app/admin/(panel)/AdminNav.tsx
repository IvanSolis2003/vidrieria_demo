"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LogoutIcon from "@mui/icons-material/Logout";
import { cerrarSesion } from "../actions";

const links = [
  { href: "/admin/cotizaciones", label: "Cotizaciones" },
  { href: "/admin/mensajes", label: "Mensajes" },
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/antes-despues", label: "Antes/Después" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/testimonios", label: "Testimonios" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/nosotros", label: "Nosotros" },
  { href: "/admin/cuenta", label: "Mi cuenta" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: 1,
              color: "#fff",
              flexGrow: { xs: 1, lg: 0 },
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            VIDRIERÍA DEMO · Panel
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", lg: "flex" },
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
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

          <Button
            component="a"
            href="/"
            target="_blank"
            sx={{ color: "#bbb", display: { xs: "none", lg: "inline-flex" } }}
          >
            Ver sitio
          </Button>
          <Box component="form" action={cerrarSesion} sx={{ display: { xs: "none", lg: "block" } }}>
            <Button type="submit" variant="outlined" sx={{ color: "#fff", borderColor: "#555" }}>
              Cerrar sesion
            </Button>
          </Box>

          <IconButton
            onClick={() => setOpen(true)}
            sx={{ color: "#fff", display: { xs: "inline-flex", lg: "none" } }}
            aria-label="Abrir menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation">
          <List onClick={() => setOpen(false)}>
            {links.map((l) => {
              const activo = pathname.startsWith(l.href);
              return (
                <ListItem key={l.href} disablePadding>
                  <ListItemButton component={Link} href={l.href} selected={activo}>
                    <ListItemText
                      primary={l.label}
                      primaryTypographyProps={{ fontWeight: activo ? 700 : 400 }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding onClick={() => setOpen(false)}>
              <ListItemButton component="a" href="/" target="_blank">
                <ListItemText primary="Ver sitio" />
                <OpenInNewIcon fontSize="small" sx={{ color: "text.secondary" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <Box component="form" action={cerrarSesion} sx={{ width: "100%" }}>
                <ListItemButton component="button" type="submit" sx={{ width: "100%", textAlign: "left" }}>
                  <ListItemText
                    primary="Cerrar sesion"
                    primaryTypographyProps={{ color: "error.main" }}
                  />
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemButton>
              </Box>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
