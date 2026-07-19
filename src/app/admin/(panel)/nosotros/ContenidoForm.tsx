"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { actualizarContenido } from "../../actions";

type Contenido = {
  nosotrosIntro: string;
  aniosExperiencia: string;
  proyectos: string;
  coberturaZona: string;
  garantia: string;
  coberturaTexto: string;
};

export default function ContenidoForm({ contenido }: { contenido: Contenido }) {
  const router = useRouter();
  const [form, setForm] = useState<Contenido>(contenido);
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk] = useState(false);

  function set<K extends keyof Contenido>(key: K, value: string) {
    setForm({ ...form, [key]: value });
    setOk(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    await actualizarContenido(form);
    setGuardando(false);
    setOk(true);
    router.refresh();
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 720 }}>
      <Stack component="form" spacing={2.5} onSubmit={onSubmit}>
        <TextField
          label="Texto de presentación"
          value={form.nosotrosIntro}
          onChange={(e) => set("nosotrosIntro", e.target.value)}
          fullWidth
          multiline
          minRows={3}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Años de experiencia"
            value={form.aniosExperiencia}
            onChange={(e) => set("aniosExperiencia", e.target.value)}
            fullWidth
          />
          <TextField
            label="Proyectos instalados"
            value={form.proyectos}
            onChange={(e) => set("proyectos", e.target.value)}
            fullWidth
          />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Zona de cobertura (etiqueta)"
            value={form.coberturaZona}
            onChange={(e) => set("coberturaZona", e.target.value)}
            fullWidth
          />
          <TextField
            label="Garantía"
            value={form.garantia}
            onChange={(e) => set("garantia", e.target.value)}
            fullWidth
          />
        </Stack>
        <TextField
          label="Detalle de zona de cobertura"
          value={form.coberturaTexto}
          onChange={(e) => set("coberturaTexto", e.target.value)}
          fullWidth
          multiline
          minRows={2}
        />
        {ok && <Alert severity="success">Contenido actualizado.</Alert>}
        <Button type="submit" variant="contained" disabled={guardando} sx={{ alignSelf: "flex-start" }}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </Button>
      </Stack>
    </Paper>
  );
}
