const MAX_LADO = 1600;
const CALIDAD = 0.8;

export async function comprimirAWebp(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/heic") {
    return file;
  }

  const dataUrl = await leerComoDataUrl(file);
  const img = await cargarImagen(dataUrl);

  let { width, height } = img;
  if (width > MAX_LADO || height > MAX_LADO) {
    const escala = MAX_LADO / Math.max(width, height);
    width = Math.round(width * escala);
    height = Math.round(height * escala);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", CALIDAD),
  );
  if (!blob) return file;

  const nombre = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], nombre, { type: "image/webp" });
}

function leerComoDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
