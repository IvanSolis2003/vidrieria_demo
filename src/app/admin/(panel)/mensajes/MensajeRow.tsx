"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { marcarMensajeLeido, eliminarMensaje } from "../../actions";

type Props = {
  id: string;
  nombre: string;
  email: string;
  tipoConsulta: string;
  mensaje: string;
  leido: boolean;
  createdAt: string;
};

export default function MensajeRow(p: Props) {
  const router = useRouter();
  const [leido, setLeido] = useState(p.leido);
  const [pending, startTransition] = useTransition();

  function toggleLeido() {
    const nuevo = !leido;
    setLeido(nuevo);
    startTransition(() => marcarMensajeLeido(p.id, nuevo));
  }

  function borrar() {
    if (!confirm(`Eliminar el mensaje de ${p.nombre}?`)) return;
    startTransition(async () => {
      await eliminarMensaje(p.id);
      router.refresh();
    });
  }

  return (
    <Paper sx={{ p: 2.5, opacity: leido ? 0.7 : 1 }}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
            <Typography variant="h6">{p.nombre}</Typography>
            <Chip size="small" label={p.tipoConsulta} color="primary" variant="outlined" />
            {!leido && <Chip size="small" label="Nuevo" color="error" />}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            <Link href={`mailto:${p.email}`} underline="hover">
              {p.email}
            </Link>{" "}
            · {p.createdAt}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
            {p.mensaje}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
          <Button size="small" onClick={toggleLeido} disabled={pending}>
            {leido ? "Marcar no leído" : "Marcar leído"}
          </Button>
          <Button size="small" color="error" onClick={borrar} disabled={pending}>
            Eliminar
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
