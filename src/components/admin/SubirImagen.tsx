"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { comprimirAWebp } from "@/lib/comprimir";

export default function SubirImagen({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setSubiendo(true);
    try {
      const comprimido = await comprimirAWebp(file);
      const res = await upload(comprimido.name, comprimido, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
      });
      onChange(res.url);
    } catch {
      setError("No se pudo subir la imagen (revisa Vercel Blob).");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <Box>
      {value && (
        <img
          src={value}
          alt="Vista previa"
          style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
        />
      )}
      <Button variant="outlined" component="label" size="small" disabled={subiendo}>
        {subiendo ? "Subiendo..." : value ? "Cambiar imagen" : "Subir imagen"}
        <input hidden type="file" accept="image/*" onChange={onFile} />
      </Button>
      {subiendo && <CircularProgress size={18} sx={{ ml: 1, verticalAlign: "middle" }} />}
      {error && (
        <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
