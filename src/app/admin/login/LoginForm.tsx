"use client";

import { useActionState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { autenticar } from "./actions";

export default function LoginForm() {
  const [error, formAction, pending] = useActionState(autenticar, undefined);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#151515",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, width: "100%", maxWidth: 380 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          IMPERIO
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Panel de administracion
        </Typography>

        <Box component="form" action={formAction}>
          <Stack spacing={2}>
            <TextField name="email" type="email" label="Email" required fullWidth />
            <TextField name="password" type="password" label="Contrasena" required fullWidth />
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" size="large" disabled={pending}>
              {pending ? "Ingresando..." : "Ingresar"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
