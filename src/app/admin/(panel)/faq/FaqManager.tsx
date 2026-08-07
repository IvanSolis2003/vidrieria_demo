"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
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
import { crearFaq, actualizarFaq, eliminarFaq } from "../../actions";

type Faq = { id: string; pregunta: string; respuesta: string; orden: number };
type Form = { id: string; pregunta: string; respuesta: string; orden: string };

const vacio: Form = { id: "", pregunta: "", respuesta: "", orden: "0" };

export default function FaqManager({ faqs }: { faqs: Faq[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [pending, startTransition] = useTransition();

  function guardar() {
    if (!form || !form.pregunta.trim() || !form.respuesta.trim()) return;
    const data = {
      pregunta: form.pregunta,
      respuesta: form.respuesta,
      orden: Number(form.orden) || 0,
    };
    startTransition(async () => {
      if (form.id) {
        await actualizarFaq(form.id, data);
      } else {
        await crearFaq(data);
      }
      setForm(null);
      router.refresh();
    });
  }

  function borrar(f: Faq) {
    if (!confirm(`Eliminar la pregunta "${f.pregunta}"?`)) return;
    startTransition(async () => {
      await eliminarFaq(f.id);
      router.refresh();
    });
  }

  return (
    <Box>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => setForm({ ...vacio, orden: String(faqs.length + 1) })}
      >
        Nueva pregunta
      </Button>

      <Stack spacing={2}>
        {faqs.map((f) => (
          <Paper key={f.id} sx={{ p: 2.5 }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">{f.pregunta}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {f.respuesta}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
                <Button
                  size="small"
                  onClick={() =>
                    setForm({
                      id: f.id,
                      pregunta: f.pregunta,
                      respuesta: f.respuesta,
                      orden: String(f.orden),
                    })
                  }
                >
                  Editar
                </Button>
                <Button size="small" color="error" onClick={() => borrar(f)}>
                  Eliminar
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Dialog open={!!form} onClose={() => setForm(null)} fullWidth maxWidth="sm">
        <DialogTitle>{form?.id ? "Editar pregunta" : "Nueva pregunta"}</DialogTitle>
        <DialogContent>
          {form && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Pregunta"
                value={form.pregunta}
                onChange={(e) => setForm({ ...form, pregunta: e.target.value })}
                fullWidth
              />
              <TextField
                label="Respuesta"
                value={form.respuesta}
                onChange={(e) => setForm({ ...form, respuesta: e.target.value })}
                fullWidth
                multiline
                minRows={3}
              />
              <TextField
                label="Orden"
                type="number"
                value={form.orden}
                onChange={(e) => setForm({ ...form, orden: e.target.value })}
                fullWidth
                helperText="Número más bajo aparece primero"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForm(null)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={guardar}
            disabled={pending || !form?.pregunta.trim() || !form?.respuesta.trim()}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
