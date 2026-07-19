"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import SubirImagen from "@/components/admin/SubirImagen";
import { actualizarCategoria, actualizarProducto } from "../../actions";

type Producto = { id: string; nombre: string; descripcion: string | null };
type Categoria = {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  productos: Producto[];
};

type EditCat = { id: string; nombre: string; descripcion: string; imagenUrl: string };
type EditProd = { id: string; nombre: string; descripcion: string };

export default function ProductosManager({ categorias }: { categorias: Categoria[] }) {
  const router = useRouter();
  const [cat, setCat] = useState<EditCat | null>(null);
  const [prod, setProd] = useState<EditProd | null>(null);
  const [pending, startTransition] = useTransition();

  function guardarCat() {
    if (!cat) return;
    startTransition(async () => {
      await actualizarCategoria(cat.id, {
        nombre: cat.nombre,
        descripcion: cat.descripcion,
        imagenUrl: cat.imagenUrl,
      });
      setCat(null);
      router.refresh();
    });
  }

  function guardarProd() {
    if (!prod) return;
    startTransition(async () => {
      await actualizarProducto(prod.id, { nombre: prod.nombre, descripcion: prod.descripcion });
      setProd(null);
      router.refresh();
    });
  }

  return (
    <Box>
      <Stack spacing={3}>
        {categorias.map((c) => (
          <Paper key={c.id} sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6">{c.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {c.descripcion}
                </Typography>
              </Box>
              <Button
                size="small"
                onClick={() =>
                  setCat({
                    id: c.id,
                    nombre: c.nombre,
                    descripcion: c.descripcion ?? "",
                    imagenUrl: c.imagenUrl ?? "",
                  })
                }
              >
                Editar categoria
              </Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.5}>
              {c.productos.map((p) => (
                <Stack
                  key={p.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Box>
                    <Typography variant="subtitle2">{p.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {p.descripcion}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={() => setProd({ id: p.id, nombre: p.nombre, descripcion: p.descripcion ?? "" })}
                  >
                    Editar
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Dialog open={!!cat} onClose={() => setCat(null)} fullWidth maxWidth="sm">
        <DialogTitle>Editar categoria</DialogTitle>
        <DialogContent>
          {cat && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Nombre"
                value={cat.nombre}
                onChange={(e) => setCat({ ...cat, nombre: e.target.value })}
                fullWidth
              />
              <TextField
                label="Descripcion"
                value={cat.descripcion}
                onChange={(e) => setCat({ ...cat, descripcion: e.target.value })}
                fullWidth
                multiline
                minRows={2}
              />
              <SubirImagen value={cat.imagenUrl} onChange={(url) => setCat({ ...cat, imagenUrl: url })} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCat(null)}>Cancelar</Button>
          <Button variant="contained" onClick={guardarCat} disabled={pending}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!prod} onClose={() => setProd(null)} fullWidth maxWidth="sm">
        <DialogTitle>Editar producto</DialogTitle>
        <DialogContent>
          {prod && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Nombre"
                value={prod.nombre}
                onChange={(e) => setProd({ ...prod, nombre: e.target.value })}
                fullWidth
              />
              <TextField
                label="Descripcion"
                value={prod.descripcion}
                onChange={(e) => setProd({ ...prod, descripcion: e.target.value })}
                fullWidth
                multiline
                minRows={2}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProd(null)}>Cancelar</Button>
          <Button variant="contained" onClick={guardarProd} disabled={pending}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
