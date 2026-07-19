import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Analytics } from "@vercel/analytics/next";
import theme, { roboto } from "@/theme";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const titulo = "Vidriería Demo — Aluminio, PVC y Vidrios";
const descripcion =
  "Ventanas de PVC, termopanel, vidrios dimensionados y shower door. Cotiza tu proyecto en línea.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: titulo,
  description: descripcion,
  openGraph: {
    title: titulo,
    description: descripcion,
    type: "website",
    locale: "es_CL",
    siteName: "Vidriería Demo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={roboto.className}>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
        <Analytics />
      </body>
    </html>
  );
}
