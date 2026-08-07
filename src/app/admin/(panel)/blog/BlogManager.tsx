"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import AddIcon from "@mui/icons-material/Add";
import SubirImagen from "@/components/admin/SubirImagen";
import { crearBlogPost, actualizarBlogPost, eliminarBlogPost } from "../../actions";

type Post = {
  id: string;
  titulo: string;
  slug: string;
  resumen: string;
  contenido: string;
  imagenUrl: string | null;
  publicado: boolean;
};

type Form = {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  imagenUrl: string;
  publicado: boolean;
};

const vacio: Form = {
  id: "",
  titulo: "",
  resumen: "",
  contenido: "",
  imagenUrl: "",
  publicado: true,
};

export default function BlogManager({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [pending, startTransition] = useTransition();

  function guardar() {
    if (!form || !form.titulo.trim() || !form.contenido.trim()) return;
    const data = {
      titulo: form.titulo,
      resumen: form.resumen,
      contenido: form.contenido,
      imagenUrl: form.imagenUrl,
      publicado: form.publicado,
    };
    startTransition(async () => {
      if (form.id) {
        await actualizarBlogPost(form.id, data);
      } else {
        await crearBlogPost(data);
      }
      setForm(null);
      router.refresh();
    });
  }

  function borrar(p: Post) {
    if (!confirm(`Eliminar el articulo "${p.titulo}"?`)) return;
    startTransition(async () => {
      await eliminarBlogPost(p.id);
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
        Nuevo artículo
      </Button>

      <Stack spacing={2}>
        {posts.map((p) => (
          <Paper key={p.id} sx={{ p: 2.5 }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
              <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="subtitle1">{p.titulo}</Typography>
                  <Chip
                    size="small"
                    label={p.publicado ? "Publicado" : "Borrador"}
                    color={p.publicado ? "success" : "default"}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {p.resumen}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
                <Button
                  size="small"
                  onClick={() =>
                    setForm({
                      id: p.id,
                      titulo: p.titulo,
                      resumen: p.resumen,
                      contenido: p.contenido,
                      imagenUrl: p.imagenUrl ?? "",
                      publicado: p.publicado,
                    })
                  }
                >
                  Editar
                </Button>
                <Button size="small" color="error" onClick={() => borrar(p)}>
                  Eliminar
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Dialog open={!!form} onClose={() => setForm(null)} fullWidth maxWidth="sm">
        <DialogTitle>{form?.id ? "Editar artículo" : "Nuevo artículo"}</DialogTitle>
        <DialogContent>
          {form && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Título"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                fullWidth
              />
              <TextField
                label="Resumen"
                value={form.resumen}
                onChange={(e) => setForm({ ...form, resumen: e.target.value })}
                fullWidth
                multiline
                minRows={2}
                helperText="Se muestra en las tarjetas del blog"
              />
              <TextField
                label="Contenido"
                value={form.contenido}
                onChange={(e) => setForm({ ...form, contenido: e.target.value })}
                fullWidth
                multiline
                minRows={8}
                helperText="Cada línea en blanco separa un párrafo"
              />
              <SubirImagen
                value={form.imagenUrl}
                onChange={(url) => setForm({ ...form, imagenUrl: url })}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.publicado}
                    onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
                  />
                }
                label="Publicado (visible en el sitio)"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForm(null)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={guardar}
            disabled={pending || !form?.titulo.trim() || !form?.contenido.trim()}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
