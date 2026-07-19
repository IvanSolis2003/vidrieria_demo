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
import AddIcon from "@mui/icons-material/Add";
import SubirImagen from "@/components/admin/SubirImagen";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  actualizarProducto,
  crearProducto,
  eliminarProducto,
} from "../../actions";

type Producto = { id: string; nombre: string; descripcion: string | null };
type Categoria = {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  productos: Producto[];
};

type CatForm = { id: string; nombre: string; descripcion: string; imagenUrl: string };
type ProdForm = { id: string; categoriaId: string; nombre: string; descripcion: string };

export default function ProductosManager({ categorias }: { categorias: Categoria[] }) {
  const router = useRouter();
  const [cat, setCat] = useState<CatForm | null>(null);
  const [prod, setProd] = useState<ProdForm | null>(null);
  const [pending, startTransition] = useTransition();

  function guardarCat() {
    if (!cat || !cat.nombre.trim()) return;
    startTransition(async () => {
      if (cat.id) {
        await actualizarCategoria(cat.id, {
          nombre: cat.nombre,
          descripcion: cat.descripcion,
          imagenUrl: cat.imagenUrl,
        });
      } else {
        await crearCategoria({
          nombre: cat.nombre,
          descripcion: cat.descripcion,
          imagenUrl: cat.imagenUrl,
        });
      }
      setCat(null);
      router.refresh();
    });
  }

  function borrarCat(c: Categoria) {
    if (!confirm(`Eliminar la categoria "${c.nombre}" y sus ${c.productos.length} productos?`)) return;
    startTransition(async () => {
      await eliminarCategoria(c.id);
      router.refresh();
    });
  }

  function guardarProd() {
    if (!prod || !prod.nombre.trim()) return;
    startTransition(async () => {
      if (prod.id) {
        await actualizarProducto(prod.id, { nombre: prod.nombre, descripcion: prod.descripcion });
      } else {
        await crearProducto({
          categoriaId: prod.categoriaId,
          nombre: prod.nombre,
          descripcion: prod.descripcion,
        });
      }
      setProd(null);
      router.refresh();
    });
  }

  function borrarProd(id: string, nombre: string) {
    if (!confirm(`Eliminar el producto "${nombre}"?`)) return;
    startTransition(async () => {
      await eliminarProducto(id);
      router.refresh();
    });
  }

  return (
    <Box>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => setCat({ id: "", nombre: "", descripcion: "", imagenUrl: "" })}
      >
        Nueva categoria
      </Button>

      <Stack spacing={3}>
        {categorias.map((c) => (
          <Paper key={c.id} sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box>
                <Typography variant="h6">{c.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {c.descripcion}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
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
                  Editar
                </Button>
                <Button size="small" color="error" onClick={() => borrarCat(c)}>
                  Eliminar
                </Button>
              </Stack>
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
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={() =>
                        setProd({
                          id: p.id,
                          categoriaId: c.id,
                          nombre: p.nombre,
                          descripcion: p.descripcion ?? "",
                        })
                      }
                    >
                      Editar
                    </Button>
                    <Button size="small" color="error" onClick={() => borrarProd(p.id, p.nombre)}>
                      Eliminar
                    </Button>
                  </Stack>
                </Stack>
              ))}
            </Stack>

            <Button
              size="small"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
              onClick={() => setProd({ id: "", categoriaId: c.id, nombre: "", descripcion: "" })}
            >
              Agregar producto
            </Button>
          </Paper>
        ))}
      </Stack>

      <Dialog open={!!cat} onClose={() => setCat(null)} fullWidth maxWidth="sm">
        <DialogTitle>{cat?.id ? "Editar categoria" : "Nueva categoria"}</DialogTitle>
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
          <Button variant="contained" onClick={guardarCat} disabled={pending || !cat?.nombre.trim()}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!prod} onClose={() => setProd(null)} fullWidth maxWidth="sm">
        <DialogTitle>{prod?.id ? "Editar producto" : "Nuevo producto"}</DialogTitle>
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
          <Button variant="contained" onClick={guardarProd} disabled={pending || !prod?.nombre.trim()}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
