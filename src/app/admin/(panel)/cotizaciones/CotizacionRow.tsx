"use client";

import { useState, useTransition } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import { cambiarEstado } from "../../actions";

type Props = {
  id: string;
  nombre: string;
  telefono: string;
  comuna: string | null;
  categoria: string;
  estado: string;
  createdAt: string;
  vanos: { alto: number; ancho: number }[];
  imagenes: string[];
};

const colores: Record<string, "error" | "warning" | "success"> = {
  nueva: "error",
  contactado: "warning",
  cerrada: "success",
};

export default function CotizacionRow(p: Props) {
  const [estado, setEstado] = useState(p.estado);
  const [pending, startTransition] = useTransition();

  function onCambio(nuevo: string) {
    setEstado(nuevo);
    startTransition(() => cambiarEstado(p.id, nuevo));
  }

  return (
    <Paper sx={{ p: 2.5 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="h6">{p.nombre}</Typography>
            <Chip size="small" label={estado} color={colores[estado] ?? "default"} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {p.categoria} · {p.comuna || "Sin comuna"} · {p.createdAt}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Tel:{" "}
            <Link href={`tel:${p.telefono}`} underline="hover">
              {p.telefono}
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Medidas:{" "}
            {p.vanos.map((v) => `${v.alto}x${v.ancho}`).join(", ")} cm
          </Typography>

          {p.imagenes.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
              {p.imagenes.map((url) => (
                <a key={url} href={url} target="_blank" rel="noopener">
                  <img
                    src={url}
                    alt="Foto"
                    style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6 }}
                  />
                </a>
              ))}
            </Stack>
          )}
        </Box>

        <Box sx={{ minWidth: 180 }}>
          <FormControl fullWidth size="small" disabled={pending}>
            <InputLabel id={`estado-${p.id}`}>Estado</InputLabel>
            <Select
              labelId={`estado-${p.id}`}
              label="Estado"
              value={estado}
              onChange={(e) => onCambio(e.target.value)}
            >
              <MenuItem value="nueva">Nueva</MenuItem>
              <MenuItem value="contactado">Contactado</MenuItem>
              <MenuItem value="cerrada">Cerrada</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Paper>
  );
}
