import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import theme, { roboto } from "@/theme";
import { siteUrl, siteTitulo, siteDescripcion } from "@/lib/site";
import { whatsappNumero } from "@/lib/whatsapp";
import "./globals.css";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "Vidriería Demo",
  description: siteDescripcion,
  url: siteUrl,
  telephone: `+${whatsappNumero}`,
  priceRange: "$$",
  areaServed: {
    "@type": "State",
    name: "Región del Maule",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Talca",
    addressRegion: "Región del Maule",
    addressCountry: "CL",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitulo, template: "%s" },
  description: siteDescripcion,
  keywords: [
    "ventanas PVC Talca",
    "vidrios Talca",
    "termopanel Talca",
    "shower door Talca",
    "ventanas aluminio Region del Maule",
  ],
  openGraph: {
    title: siteTitulo,
    description: siteDescripcion,
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
        <Script
          id="local-business-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
        <Analytics />
        <Script
          src="https://iasm-pulse.vercel.app/track.js"
          data-site="vidrieria-demo-xi.vercel.app"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
