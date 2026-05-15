import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Pertanyaan Umum",
  description:
    "Temukan jawaban untuk pertanyaan yang sering diajukan seputar SPMB SDN 02 Cibadak. Informasi pendaftaran, berkas, zonasi, jadwal, dan kontak.",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
