"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import SubirImagen from "@/components/admin/SubirImagen";
import {
  crearAntesDespues,
  actualizarAntesDespues,
  eliminarAntesDespues,
} from "../../actions";

type Item = {
  id: string;
  titulo: string;
  imagenAntesUrl: string;
  imagenDespuesUrl: string;
};

const vacio: Item = { id: "", titulo: "", imagenAntesUrl: "", imagenDespuesUrl: "" };

export default function AntesDespuesManager({ items }: { items: Item[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Item | null>(null);
  const [pending, startTransition] = useTransition();

  function guardar() {
    if (!form || !form.titulo.trim() || !form.imagenAntesUrl || !form.imagenDespuesUrl) return;
    const data = {
      titulo: form.titulo,
      imagenAntesUrl: form.imagenAntesUrl,
      imagenDespuesUrl: form.imagenDespuesUrl,
    };
    startTransition(async () => {
      if (form.id) {
        await actualizarAntesDespues(form.id, data);
      } else {
        await crearAntesDespues(data);
      }
      setForm(null);
      router.refresh();
    });
  }

  function borrar(item: Item) {
    if (!confirm(`Eliminar "${item.titulo}"?`)) return;
    startTransition(async () => {
      await eliminarAntesDespues(item.id);
      router.refresh();
    });
  }

  return (
    <Box>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => setForm({ ...vacio })}
      >
        Nueva comparación
      </Button>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Box
                  component="img"
                  src={item.imagenAntesUrl}
                  alt="Antes"
                  sx={{ width: "50%", height: 120, objectFit: "cover", borderRadius: 1 }}
                />
                <Box
                  component="img"
                  src={item.imagenDespuesUrl}
                  alt="Después"
                  sx={{ width: "50%", height: 120, objectFit: "cover", borderRadius: 1 }}
                />
              </Stack>
              <Typography variant="subtitle2">{item.titulo}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button size="small" onClick={() => setForm(item)}>
                  Editar
                </Button>
                <Button size="small" color="error" onClick={() => borrar(item)}>
                  Eliminar
                </Button>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!form} onClose={() => setForm(null)} fullWidth maxWidth="sm">
        <DialogTitle>{form?.id ? "Editar comparación" : "Nueva comparación"}</DialogTitle>
        <DialogContent>
          {form && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Título"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                fullWidth
              />
              <Typography variant="body2" color="text.secondary">
                Imagen ANTES
              </Typography>
              <SubirImagen
                value={form.imagenAntesUrl}
                onChange={(url) => setForm({ ...form, imagenAntesUrl: url })}
              />
              <Typography variant="body2" color="text.secondary">
                Imagen DESPUÉS
              </Typography>
              <SubirImagen
                value={form.imagenDespuesUrl}
                onChange={(url) => setForm({ ...form, imagenDespuesUrl: url })}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForm(null)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={guardar}
            disabled={
              pending || !form?.titulo.trim() || !form?.imagenAntesUrl || !form?.imagenDespuesUrl
            }
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
