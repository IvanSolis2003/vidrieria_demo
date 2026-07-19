"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import { crearTestimonio, actualizarTestimonio, eliminarTestimonio } from "../../actions";

type Testimonio = {
  id: string;
  nombre: string;
  comuna: string | null;
  servicio: string | null;
  rating: number;
  texto: string;
};

type Form = {
  id: string;
  nombre: string;
  comuna: string;
  servicio: string;
  rating: number;
  texto: string;
};

const vacio: Form = { id: "", nombre: "", comuna: "", servicio: "", rating: 5, texto: "" };

export default function TestimoniosManager({ testimonios }: { testimonios: Testimonio[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [pending, startTransition] = useTransition();

  function guardar() {
    if (!form || !form.nombre.trim() || !form.texto.trim()) return;
    const data = {
      nombre: form.nombre,
      comuna: form.comuna,
      servicio: form.servicio,
      rating: form.rating,
      texto: form.texto,
    };
    startTransition(async () => {
      if (form.id) {
        await actualizarTestimonio(form.id, data);
      } else {
        await crearTestimonio(data);
      }
      setForm(null);
      router.refresh();
    });
  }

  function borrar(t: Testimonio) {
    if (!confirm(`Eliminar la resena de ${t.nombre}?`)) return;
    startTransition(async () => {
      await eliminarTestimonio(t.id);
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
        Nueva resena
      </Button>

      <Stack spacing={2}>
        {testimonios.map((t) => (
          <Paper key={t.id} sx={{ p: 2.5 }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
              <Box sx={{ flexGrow: 1 }}>
                <Rating value={t.rating} readOnly size="small" />
                <Typography variant="subtitle1">{t.nombre}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {[t.comuna, t.servicio].filter(Boolean).join(" · ")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t.texto}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
                <Button
                  size="small"
                  onClick={() =>
                    setForm({
                      id: t.id,
                      nombre: t.nombre,
                      comuna: t.comuna ?? "",
                      servicio: t.servicio ?? "",
                      rating: t.rating,
                      texto: t.texto,
                    })
                  }
                >
                  Editar
                </Button>
                <Button size="small" color="error" onClick={() => borrar(t)}>
                  Eliminar
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Dialog open={!!form} onClose={() => setForm(null)} fullWidth maxWidth="sm">
        <DialogTitle>{form?.id ? "Editar resena" : "Nueva resena"}</DialogTitle>
        <DialogContent>
          {form && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Nombre del cliente"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Comuna"
                  value={form.comuna}
                  onChange={(e) => setForm({ ...form, comuna: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Servicio"
                  value={form.servicio}
                  onChange={(e) => setForm({ ...form, servicio: e.target.value })}
                  fullWidth
                />
              </Stack>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Calificacion
                </Typography>
                <Rating
                  value={form.rating}
                  onChange={(_, v) => setForm({ ...form, rating: v ?? 5 })}
                />
              </Box>
              <TextField
                label="Resena"
                value={form.texto}
                onChange={(e) => setForm({ ...form, texto: e.target.value })}
                fullWidth
                multiline
                minRows={3}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForm(null)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={guardar}
            disabled={pending || !form?.nombre.trim() || !form?.texto.trim()}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
