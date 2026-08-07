"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import CotizacionRow from "./CotizacionRow";
import { exportarCSV } from "@/lib/csv";

type Cotizacion = {
  id: string;
  nombre: string;
  telefono: string;
  comuna: string | null;
  categoria: string;
  detalle: string | null;
  estado: string;
  createdAt: string;
  vanos: { alto: number; ancho: number }[];
  imagenes: string[];
};

const POR_PAGINA = 8;

export default function CotizacionesLista({ cotizaciones }: { cotizaciones: Cotizacion[] }) {
  const [filtro, setFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const conteos = useMemo(
    () => ({
      todas: cotizaciones.length,
      nueva: cotizaciones.filter((c) => c.estado === "nueva").length,
      contactado: cotizaciones.filter((c) => c.estado === "contactado").length,
      cerrada: cotizaciones.filter((c) => c.estado === "cerrada").length,
    }),
    [cotizaciones],
  );

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return cotizaciones.filter((c) => {
      const okEstado = filtro === "todas" || c.estado === filtro;
      const okBusqueda =
        !q || c.nombre.toLowerCase().includes(q) || c.telefono.includes(q);
      return okEstado && okBusqueda;
    });
  }, [cotizaciones, filtro, busqueda]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtradas.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA,
  );

  function cambiarFiltro(nuevo: string) {
    setFiltro(nuevo);
    setPagina(1);
  }

  function exportar() {
    exportarCSV(
      `cotizaciones-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Nombre", "Telefono", "Comuna", "Categoria", "Detalle", "Medidas (cm)", "Estado", "Fecha", "Fotos"],
      filtradas.map((c) => [
        c.nombre,
        c.telefono,
        c.comuna || "",
        c.categoria,
        c.detalle || "",
        c.vanos.map((v) => `${v.alto}x${v.ancho}`).join(" / "),
        c.estado,
        c.createdAt,
        c.imagenes.length,
      ]),
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ mb: 3 }}
      >
        <Tabs
          value={filtro}
          onChange={(_, v) => cambiarFiltro(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="todas" label={`Todas (${conteos.todas})`} />
          <Tab value="nueva" label={`Nuevas (${conteos.nueva})`} />
          <Tab value="contactado" label={`Contactado (${conteos.contactado})`} />
          <Tab value="cerrada" label={`Cerradas (${conteos.cerrada})`} />
        </Tabs>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <TextField
            size="small"
            placeholder="Buscar por nombre o telefono"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
            sx={{ minWidth: { md: 280 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            size="small"
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportar}
            disabled={filtradas.length === 0}
          >
            Exportar CSV
          </Button>
        </Stack>
      </Stack>

      {visibles.length === 0 ? (
        <Typography color="text.secondary">
          No hay cotizaciones que coincidan con el filtro.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {visibles.map((c) => (
            <CotizacionRow key={c.id} {...c} />
          ))}
        </Stack>
      )}

      {totalPaginas > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPaginas}
            page={paginaActual}
            onChange={(_, v) => setPagina(v)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
