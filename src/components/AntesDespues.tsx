"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

type Item = {
  id: string;
  titulo: string;
  imagenAntesUrl: string;
  imagenDespuesUrl: string;
};

function Comparador({ item }: { item: Item }) {
  const [pos, setPos] = useState(50);

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          overflow: "hidden",
          borderRadius: 2,
          userSelect: "none",
        }}
      >
        <Box
          component="img"
          src={item.imagenDespuesUrl}
          alt={`${item.titulo} — después`}
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box
          component="img"
          src={item.imagenAntesUrl}
          alt={`${item.titulo} — antes`}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            clipPath: `inset(0 ${100 - pos}% 0 0)`,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            px: 1,
            py: 0.25,
            bgcolor: "rgba(0,0,0,0.6)",
            color: "#fff",
            borderRadius: 1,
            fontSize: 12,
          }}
        >
          Antes
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            px: 1,
            py: 0.25,
            bgcolor: "primary.main",
            color: "#fff",
            borderRadius: 1,
            fontSize: 12,
          }}
        >
          Después
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${pos}%`,
            width: "2px",
            bgcolor: "#fff",
            boxShadow: "0 0 4px rgba(0,0,0,0.5)",
            transform: "translateX(-1px)",
          }}
        />

        <Box
          component="input"
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number((e.target as HTMLInputElement).value))}
          aria-label={`Comparar antes y después: ${item.titulo}`}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            margin: 0,
            opacity: 0,
            cursor: "ew-resize",
          }}
        />
      </Box>
      <Typography variant="subtitle2" sx={{ mt: 1 }}>
        {item.titulo}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Arrastra para comparar
      </Typography>
    </Box>
  );
}

export default function AntesDespues({ items }: { items: Item[] }) {
  if (items.length === 0) return null;
  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
          <Comparador item={item} />
        </Grid>
      ))}
    </Grid>
  );
}
