"use client";

import { useState, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upload } from "@vercel/blob/client";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { cotizacionSchema, type CotizacionInput } from "@/lib/schemas";
import { comprimirAWebp } from "@/lib/comprimir";
import { crearCotizacion } from "./actions";

type Categoria = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagenUrl: string | null;
  precioM2: number | null;
};

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

function estimarPrecio(vanos: { alto: number; ancho: number }[], precioM2: number | null) {
  if (!precioM2) return null;
  const m2 = vanos.reduce((acc, v) => acc + (v.alto * v.ancho) / 10000, 0);
  if (m2 <= 0) return null;
  const base = m2 * precioM2;
  const redondear = (n: number) => Math.round(n / 1000) * 1000;
  return {
    m2: Math.round(m2 * 100) / 100,
    min: redondear(base * 0.9),
    max: redondear(base * 1.15),
  };
}

const pasos = ["Tipo de trabajo", "Medidas", "Fotos", "Contacto", "Resumen"];

export default function Cotizador({
  categorias,
  categoriaInicial,
}: {
  categorias: Categoria[];
  categoriaInicial?: string;
}) {
  const inicial = categorias.find((c) => c.slug === categoriaInicial);

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CotizacionInput>({
    resolver: zodResolver(cotizacionSchema),
    defaultValues: {
      categoriaId: inicial?.id ?? "",
      vanos: [{ alto: 0, ancho: 0 }],
      imagenes: [],
      nombre: "",
      telefono: "",
      comuna: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "vanos" });

  const [paso, setPaso] = useState(0);
  const [subiendo, setSubiendo] = useState(false);
  const [errorFoto, setErrorFoto] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const categoriaId = watch("categoriaId");
  const imagenes = watch("imagenes");
  const valores = watch();
  const categoriaSel = categorias.find((c) => c.id === categoriaId);
  const estimacion = estimarPrecio(valores.vanos, categoriaSel?.precioM2 ?? null);

  const camposPorPaso: (keyof CotizacionInput)[][] = [
    ["categoriaId"],
    ["vanos"],
    [],
    ["nombre", "telefono"],
    [],
  ];

  async function siguiente() {
    const campos = camposPorPaso[paso];
    const ok = campos.length === 0 ? true : await trigger(campos);
    if (ok) setPaso((p) => Math.min(p + 1, pasos.length - 1));
  }

  function anterior() {
    setPaso((p) => Math.max(p - 1, 0));
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setErrorFoto(null);
    setSubiendo(true);
    try {
      const urls: string[] = [];
      for (const f of files) {
        const comprimido = await comprimirAWebp(f);
        const res = await upload(comprimido.name, comprimido, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
        });
        urls.push(res.url);
      }
      setValue("imagenes", [...getValues("imagenes"), ...urls]);
    } catch {
      setErrorFoto(
        "No se pudieron subir las fotos (revisa la configuracion de Vercel Blob). Puedes continuar sin fotos.",
      );
    } finally {
      setSubiendo(false);
    }
  }

  function quitarFoto(url: string) {
    setValue(
      "imagenes",
      getValues("imagenes").filter((u) => u !== url),
    );
  }

  async function onSubmit(data: CotizacionInput) {
    setEnviando(true);
    setErrorEnvio(null);
    const res = await crearCotizacion(data, honeypotRef.current?.value ?? "");
    setEnviando(false);
    if (res.ok) {
      setExito(res.whatsappUrl);
    } else {
      setErrorEnvio(res.error);
    }
  }

  if (exito) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 72, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Cotizacion enviada
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Recibimos tu solicitud y te contactaremos pronto. Si quieres, puedes enviarnos
          el resumen por WhatsApp para agilizar (y adjuntar fotos ahi mismo).
        </Typography>
        <Stack spacing={2} alignItems="center">
          <Button
            component="a"
            href={exito}
            target="_blank"
            rel="noopener"
            variant="contained"
            size="large"
            startIcon={<WhatsAppIcon />}
            sx={{ bgcolor: "#25D366", "&:hover": { bgcolor: "#1da851" } }}
          >
            Enviar resumen por WhatsApp
          </Button>
          <Button href="/">Volver al inicio</Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Cotiza tu proyecto
      </Typography>

      <Stepper activeStep={paso} alternativeLabel sx={{ my: 4 }}>
        {pasos.map((p) => (
          <Step key={p}>
            <StepLabel>{p}</StepLabel>
          </Step>
        ))}
      </Stepper>

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
        {paso === 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Que tipo de trabajo necesitas?
            </Typography>
            <Controller
              control={control}
              name="categoriaId"
              render={({ field }) => (
                <Grid container spacing={2}>
                  {categorias.map((c) => (
                    <Grid key={c.id} size={{ xs: 12, sm: 6 }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderColor: field.value === c.id ? "primary.main" : undefined,
                          borderWidth: field.value === c.id ? 2 : 1,
                        }}
                      >
                        <CardActionArea onClick={() => field.onChange(c.id)}>
                          {c.imagenUrl && (
                            <CardMedia component="img" height="120" image={c.imagenUrl} alt={c.nombre} />
                          )}
                          <CardContent>
                            <Typography variant="subtitle1">{c.nombre}</Typography>
                            {c.descripcion && (
                              <Typography variant="body2" color="text.secondary">
                                {c.descripcion}
                              </Typography>
                            )}
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            />
            {errors.categoriaId && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {errors.categoriaId.message}
              </Typography>
            )}
          </>
        )}

        {paso === 1 && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Medidas de cada vano (en centimetros)
            </Typography>
            <Stack spacing={2}>
              {fields.map((f, i) => (
                <Stack key={f.id} direction="row" spacing={2} alignItems="flex-start">
                  <Controller
                    control={control}
                    name={`vanos.${i}.alto`}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Alto (cm)"
                        fullWidth
                        error={!!errors.vanos?.[i]?.alto}
                        helperText={errors.vanos?.[i]?.alto?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`vanos.${i}.ancho`}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Ancho (cm)"
                        fullWidth
                        error={!!errors.vanos?.[i]?.ancho}
                        helperText={errors.vanos?.[i]?.ancho?.message}
                      />
                    )}
                  />
                  <IconButton
                    onClick={() => remove(i)}
                    disabled={fields.length === 1}
                    aria-label="Quitar medida"
                    sx={{ mt: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
            <Button
              startIcon={<AddIcon />}
              onClick={() => append({ alto: 0, ancho: 0 })}
              sx={{ mt: 2 }}
            >
              Agregar otra medida
            </Button>
          </>
        )}

        {paso === 2 && (
          <>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Fotos del lugar (opcional)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ayudan a cotizar mas rapido. Se optimizan antes de subir.
            </Typography>
            {errorFoto && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {errorFoto}
              </Alert>
            )}
            <Button variant="outlined" component="label" disabled={subiendo}>
              {subiendo ? "Subiendo..." : "Seleccionar fotos"}
              <input hidden type="file" accept="image/*" multiple onChange={onFiles} />
            </Button>
            {subiendo && <CircularProgress size={22} sx={{ ml: 2, verticalAlign: "middle" }} />}
            {imagenes.length > 0 && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {imagenes.map((url) => (
                  <Grid key={url} size={{ xs: 6, sm: 4, md: 3 }}>
                    <Box sx={{ position: "relative" }}>
                      <img
                        src={url}
                        alt="Foto adjunta"
                        style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 8 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => quitarFoto(url)}
                        sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(0,0,0,0.6)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.8)" } }}
                        aria-label="Quitar foto"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {paso === 3 && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Tus datos de contacto
            </Typography>
            <Stack spacing={2}>
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
                name="telefono"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Telefono / WhatsApp"
                    fullWidth
                    error={!!errors.telefono}
                    helperText={errors.telefono?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="comuna"
                render={({ field }) => (
                  <TextField {...field} label="Comuna (opcional)" fullWidth />
                )}
              />
            </Stack>
          </>
        )}

        {paso === 4 && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Revisa tu cotizacion
            </Typography>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Resumen label="Tipo de trabajo" valor={categoriaSel?.nombre ?? "-"} />
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" color="text.secondary">
                Medidas
              </Typography>
              {valores.vanos.map((v, i) => (
                <Typography key={i} variant="body1">
                  {i + 1}. {v.alto} x {v.ancho} cm
                </Typography>
              ))}
              <Divider sx={{ my: 1.5 }} />
              <Resumen label="Nombre" valor={valores.nombre} />
              <Resumen label="Telefono" valor={valores.telefono} />
              <Resumen label="Comuna" valor={valores.comuna || "-"} />
              <Resumen label="Fotos adjuntas" valor={String(imagenes.length)} />
            </Paper>

            {estimacion && (
              <Paper
                variant="outlined"
                sx={{ p: 3, mt: 2, borderColor: "primary.main", bgcolor: "rgba(200,16,46,0.04)" }}
              >
                <Typography variant="body2" color="text.secondary">
                  Precio referencial estimado ({estimacion.m2} m² aprox.)
                </Typography>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 800, my: 0.5 }}>
                  {clp.format(estimacion.min)} — {clp.format(estimacion.max)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Valor estimado según medidas. El precio final se confirma tras la visita
                  técnica y la elección de terminaciones.
                </Typography>
              </Paper>
            )}
            {errorEnvio && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorEnvio}
              </Alert>
            )}
          </>
        )}

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
          <Button onClick={anterior} disabled={paso === 0 || enviando}>
            Atras
          </Button>
          {paso < pasos.length - 1 ? (
            <Button variant="contained" onClick={siguiente} disabled={subiendo}>
              Siguiente
            </Button>
          ) : (
            <Button type="submit" variant="contained" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar cotizacion"}
            </Button>
          )}
        </Stack>
      </Box>
    </Container>
  );
}

function Resumen({ label, valor }: { label: string; valor: string }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.3 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{valor}</Typography>
    </Box>
  );
}
