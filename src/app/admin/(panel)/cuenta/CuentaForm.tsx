"use client";

import { useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { cambiarPassword } from "../../actions";

export default function CuentaForm({ email }: { email: string }) {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetir, setRepetir] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensaje(null);
    if (nueva !== repetir) {
      setMensaje({ tipo: "error", texto: "Las contrasenas nuevas no coinciden." });
      return;
    }
    setEnviando(true);
    const res = await cambiarPassword({ actual, nueva });
    setEnviando(false);
    if (res.ok) {
      setMensaje({ tipo: "success", texto: "Contrasena actualizada correctamente." });
      setActual("");
      setNueva("");
      setRepetir("");
    } else {
      setMensaje({ tipo: "error", texto: res.error ?? "No se pudo actualizar." });
    }
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 460 }}>
      <Stack spacing={1} sx={{ mb: 2 }}>
        <TextField label="Usuario" value={email} fullWidth disabled />
      </Stack>
      <Stack component="form" spacing={2} onSubmit={onSubmit}>
        <TextField
          type="password"
          label="Contrasena actual"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
          required
          fullWidth
        />
        <TextField
          type="password"
          label="Nueva contrasena"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          required
          fullWidth
          helperText="Minimo 6 caracteres"
        />
        <TextField
          type="password"
          label="Repetir nueva contrasena"
          value={repetir}
          onChange={(e) => setRepetir(e.target.value)}
          required
          fullWidth
        />
        {mensaje && <Alert severity={mensaje.tipo}>{mensaje.texto}</Alert>}
        <Button type="submit" variant="contained" disabled={enviando}>
          {enviando ? "Guardando..." : "Cambiar contrasena"}
        </Button>
      </Stack>
    </Paper>
  );
}
