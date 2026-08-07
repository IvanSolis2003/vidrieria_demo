"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import MensajeRow from "./MensajeRow";
import { exportarCSV } from "@/lib/csv";

type Mensaje = {
  id: string;
  nombre: string;
  email: string;
  tipoConsulta: string;
  mensaje: string;
  leido: boolean;
  createdAt: string;
};

export default function MensajesLista({ mensajes }: { mensajes: Mensaje[] }) {
  function exportar() {
    exportarCSV(
      `mensajes-contacto-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Nombre", "Email", "Tipo de consulta", "Mensaje", "Leido", "Fecha"],
      mensajes.map((m) => [
        m.nombre,
        m.email,
        m.tipoConsulta,
        m.mensaje,
        m.leido ? "Si" : "No",
        m.createdAt,
      ]),
    );
  }

  if (mensajes.length === 0) {
    return <Typography color="text.secondary">Todavía no hay mensajes.</Typography>;
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={exportar}>
          Exportar CSV
        </Button>
      </Stack>
      <Stack spacing={2}>
        {mensajes.map((m) => (
          <MensajeRow key={m.id} {...m} />
        ))}
      </Stack>
    </Box>
  );
}
