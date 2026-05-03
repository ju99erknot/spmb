import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SPMB Online - SDN 02 Cibadak",
    template: "%s | SPMB SDN 02 Cibadak",
  },
  description:
    "Pendaftaran Siswa Baru (SPMB) Online SDN 02 Cibadak. Formulir pendaftaran resmi untuk calon peserta didik baru tahun ajaran 2026/2027.",
  keywords: [
    "SPMB",
    "PPDB",
    "SDN 02 Cibadak",
    "Pendaftaran Siswa Baru",
    "Sekolah Dasar",
    "Cibadak",
    "PPDB Online",
  ],
  authors: [{ name: "SDN 02 Cibadak" }],
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
  },
  openGraph: {
    type: "website",
    title: "SPMB Online - SDN 02 Cibadak",
    description:
      "Pendaftaran Siswa Baru (SPMB) Online SDN 02 Cibadak. Formulir pendaftaran resmi untuk calon peserta didik.",
    siteName: "SPMB SDN 02 Cibadak",
    locale: "id_ID",
    url: "https://spmb.sdn02cibadak.sch.id",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPMB Online - SDN 02 Cibadak",
    description: "Pendaftaran Siswa Baru Online SDN 02 Cibadak.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  metadataBase: new URL("https://spmb.sdn02cibadak.sch.id"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#0f172a",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50px",
              fontSize: "12px",
              fontWeight: 700,
              padding: "8px 18px",
            },
          }}
        />
      </body>
    </html>
  );
}
