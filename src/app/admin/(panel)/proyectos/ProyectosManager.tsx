"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import SubirImagen from "@/components/admin/SubirImagen";
import { crearProyecto, actualizarProyecto, eliminarProyecto } from "../../actions";

type Proyecto = {
  id: string;
  titulo: string;
  imagenUrl: string;
  destacado: boolean;
};

const vacio = { id: "", titulo: "", imagenUrl: "", destacado: false };

export default function ProyectosManager({ proyectos }: { proyectos: Proyecto[] }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState<Proyecto>(vacio);
  const [pending, startTransition] = useTransition();

  function abrirNuevo() {
    setForm(vacio);
    setAbierto(true);
  }

  function abrirEditar(p: Proyecto) {
    setForm(p);
    setAbierto(true);
  }

  function guardar() {
    if (!form.titulo || !form.imagenUrl) return;
    startTransition(async () => {
      if (form.id) {
        await actualizarProyecto(form.id, {
          titulo: form.titulo,
          imagenUrl: form.imagenUrl,
          destacado: form.destacado,
        });
      } else {
        await crearProyecto({
          titulo: form.titulo,
          imagenUrl: form.imagenUrl,
          destacado: form.destacado,
        });
      }
      setAbierto(false);
      router.refresh();
    });
  }

  function borrar(id: string) {
    if (!confirm("Eliminar este proyecto?")) return;
    startTransition(async () => {
      await eliminarProyecto(id);
      router.refresh();
    });
  }

  return (
    <Box>
      <Button startIcon={<AddIcon />} variant="contained" onClick={abrirNuevo} sx={{ mb: 3 }}>
        Nuevo proyecto
      </Button>

      <Grid container spacing={3}>
        {proyectos.map((p) => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardMedia component="img" height="180" image={p.imagenUrl} alt={p.titulo} />
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">{p.titulo}</Typography>
                  {p.destacado && <Chip size="small" color="primary" label="Destacado" />}
                </Stack>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => abrirEditar(p)}>
                  Editar
                </Button>
                <Button size="small" color="error" onClick={() => borrar(p.id)} disabled={pending}>
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={abierto} onClose={() => setAbierto(false)} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? "Editar proyecto" : "Nuevo proyecto"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Titulo"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              fullWidth
            />
            <SubirImagen value={form.imagenUrl} onChange={(url) => setForm({ ...form, imagenUrl: url })} />
            <FormControlLabel
              control={
                <Switch
                  checked={form.destacado}
                  onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                />
              }
              label="Destacado en la home"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAbierto(false)}>Cancelar</Button>
          <Button variant="contained" onClick={guardar} disabled={pending || !form.titulo || !form.imagenUrl}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
