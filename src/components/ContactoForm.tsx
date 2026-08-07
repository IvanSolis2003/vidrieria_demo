"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { contactoSchema, tiposConsulta, type ContactoInput } from "@/lib/schemas";
import { enviarContacto } from "@/lib/actions/contacto";

export default function ContactoForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactoInput>({
    resolver: zodResolver(contactoSchema),
    defaultValues: { nombre: "", email: "", tipoConsulta: "Cotización", mensaje: "" },
  });

  const honeypotRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  async function onSubmit(data: ContactoInput) {
    setEnviando(true);
    setError(null);
    const res = await enviarContacto(data, honeypotRef.current?.value ?? "");
    setEnviando(false);
    if (res.ok) {
      setExito(true);
      reset();
    } else {
      setError(res.error);
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 } }}>
      <Typography variant="h6" gutterBottom>
        Escríbenos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Envíanos tu consulta y te responderemos a la brevedad.
      </Typography>

      {exito ? (
        <Stack alignItems="center" spacing={1} sx={{ py: 3 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 48 }} />
          <Typography variant="subtitle1">¡Mensaje enviado!</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            Gracias por escribirnos, te contactaremos pronto.
          </Typography>
          <Button onClick={() => setExito(false)}>Enviar otro mensaje</Button>
        </Stack>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
          />
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                control={control}
                name="nombre"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre"
                    fullWidth
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="email"
                    label="Email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Stack>
            <Controller
              control={control}
              name="tipoConsulta"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Tipo de consulta"
                  fullWidth
                  error={!!errors.tipoConsulta}
                  helperText={errors.tipoConsulta?.message}
                >
                  {tiposConsulta.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              control={control}
              name="mensaje"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mensaje"
                  fullWidth
                  multiline
                  minRows={4}
                  error={!!errors.mensaje}
                  helperText={errors.mensaje?.message}
                />
              )}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" size="large" disabled={enviando} sx={{ alignSelf: "flex-start" }}>
              {enviando ? "Enviando..." : "Enviar mensaje"}
            </Button>
          </Stack>
        </Box>
      )}
    </Paper>
  );
}
