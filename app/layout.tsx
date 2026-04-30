import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { I18nProvider } from "./i18n/provider";
import { API_ROOT } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Xavier Arbat | Fullstack Developer & Part-time Artist',
  description: 'Explora mi portfolio: obras artísticas, blog de reflexiones y proyectos de programación con frontend y backend públicos en GitHub.',
  openGraph: {
    title: 'Xavier Arbat | Tech & Art',
    description: 'Arquitectura de software, código abierto y galería de arte personal.',
    url: 'https://xavierarbat.com',
    siteName: 'Xavier Arbat',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: `${API_ROOT}/uploads/projects/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Previsualización del Portfolio de Xavier Arbat',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xavier Arbat | Fullstack Developer & Artist',
    description: 'Desarrollo de software y obras de arte.',
    images: [`${API_ROOT}/uploads/projects/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <I18nProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
