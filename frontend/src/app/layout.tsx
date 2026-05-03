import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import 'leaflet/dist/leaflet.css';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OG Barbería | Estilo y Tradición",
    template: "%s | OG Barbería",
  },
  description: "La barbería con más estilo en la ciudad de Hermosillo, Sonora. Cortes de cabello premium, barba y cuidado personal para el hombre moderno.",
  keywords: ["barbería", "corte de cabello", "barba", "estilo", "OG Barbería", "grooming", "Hermosillo", "Sonora", "citas", "reservaciones", "barbería en línea", "citas en línea", "citas en Hermosillo"],
  authors: [{ name: "OG Barbería" }],
  creator: "OG Barbería",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://ogbarberia.com",
    title: "OG Barbería | Estilo y Tradición",
    description: "Cortes de cabello premium y cuidado de barba en un ambiente exclusivo.",
    siteName: "OG Barbería",
  },
  twitter: {
    card: "summary_large_image",
    title: "OG Barbería | Estilo y Tradición",
    description: "Cortes de cabello premium y cuidado de barba en un ambiente exclusivo.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-gold selection:text-black">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <footer className="bg-black border-t border-gold/10 py-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-gold font-bold mb-4 text-lg">OG BARBERÍA</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Elevando el estándar del cuidado masculino desde el corazón de la ciudad. Estilo, tradición y excelencia.
                </p>
              </div>
              <div>
                <h3 className="text-gold font-bold mb-4 text-lg">HORARIOS</h3>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li>Lunes - Sábado: 10:00 AM - 8:00 PM</li>
                  <li>Domingo: Cerrado</li>
                </ul>
              </div>
              <div>
                <h3 className="text-gold font-bold mb-4 text-lg">SÍGUENOS</h3>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-gold transition-colors">Instagram</a>
                  <a href="#" className="hover:text-gold transition-colors">Facebook</a>
                </div>
              </div>
            </div>
            <div className="text-center mt-12 pt-8 border-t border-gold/5 text-gray-500 text-xs">
              <p>© {new Date().getFullYear()} OG Barbería. Todos los derechos reservados.</p>
              <p>Desarrollado por <a href="https://nectarlabs.mx" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Nectar Labs</a>.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
