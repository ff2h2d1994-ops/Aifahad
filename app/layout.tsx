import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ToastProvider } from "@/components/ToastProvider";
import { getThemeColors } from "@/lib/data/fetch";
import { hexToRgbTriplet, lightenHex } from "@/lib/color";

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "فهد المشعان | خدمات الذكاء الاصطناعي والحلول الرقمية",
    template: "%s | فهد المشعان",
  },
  description:
    "فهد المشعان — مهندس برمجيات وخبير في عالم الذكاء الاصطناعي. خدمات ذكاء اصطناعي، معالجة صور، تصميم جرافيك، فيديو، صوت، مواقع وبرمجة، تحليل بيانات، وأكثر.",
  keywords: [
    "خدمات الذكاء الاصطناعي",
    "تصميم جرافيك",
    "تصميم مواقع",
    "معالجة الصور",
    "مونتاج فيديو",
    "تحليل البيانات",
    "صناعة المحتوى",
    "خدمات AI",
    "برمجة",
    "تصميم شعارات",
    "Fahad Almishan",
  ],
  alternates: { canonical: "/", languages: { ar: "/", en: "/" } },
  openGraph: {
    title: "فهد المشعان | كل ما تحتاجه في مكان واحد",
    description: "خدمات احترافية بقوة الذكاء الاصطناعي.",
    url: siteUrl,
    siteName: "Fahad Almishan",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "فهد المشعان | كل ما تحتاجه في مكان واحد",
    description: "خدمات احترافية بقوة الذكاء الاصطناعي.",
    images: ["/logo.png"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getThemeColors();
  const softElectric = lightenHex(theme.electric);

  const themeCss = `:root {
    --color-electric: ${hexToRgbTriplet(theme.electric)} !important;
    --color-electric-soft: ${hexToRgbTriplet(softElectric)} !important;
    --color-violet: ${hexToRgbTriplet(theme.violet)} !important;
    --color-cyan: ${hexToRgbTriplet(theme.cyan)} !important;
    --color-ember: ${hexToRgbTriplet(theme.ember)} !important;
    --color-electric-hex: ${theme.electric} !important;
    --color-electric-soft-hex: ${softElectric} !important;
    --color-violet-hex: ${theme.violet} !important;
    --color-cyan-hex: ${theme.cyan} !important;
  }`;

  return (
    <html lang="ar" dir="rtl" className={`${arabic.variable} ${display.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className="font-arabic antialiased bg-base text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Fahad Almishan",
              url: siteUrl,
              image: `${siteUrl}/logo.png`,
              description: "خدمات احترافية بقوة الذكاء الاصطناعي",
              areaServed: "SA",
            }),
          }}
        />
        <LanguageProvider>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
