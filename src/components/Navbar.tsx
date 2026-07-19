"use client";

import { useState } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <Typography
            component={Link}
            href="/"
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: 1,
              color: "#fff",
              textDecoration: "none",
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            IMPERIO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center", gap: 1 }}>
            {links.map((l) => (
              <Button key={l.href} component={Link} href={l.href} sx={{ color: "#fff" }}>
                {l.label}
              </Button>
            ))}
          </Box>

          <Button
            component={Link}
            href="/cotizar"
            variant="contained"
            color="primary"
            sx={{ display: { xs: "none", md: "inline-flex" } }}
          >
            Cotiza tu proyecto
          </Button>

          <IconButton
            onClick={() => setOpen(true)}
            sx={{ color: "#fff", display: { xs: "inline-flex", md: "none" } }}
            aria-label="Abrir menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 240 }} role="presentation" onClick={() => setOpen(false)}>
          <List>
            {links.map((l) => (
              <ListItem key={l.href} disablePadding>
                <ListItemButton component={Link} href={l.href}>
                  <ListItemText primary={l.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/cotizar">
                <ListItemText primary="Cotiza tu proyecto" primaryTypographyProps={{ color: "primary", fontWeight: 700 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
