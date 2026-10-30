import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "TM - Migração",
  description: "Sistema de migração Trinus",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-[#F5F5F5] text-[#191A1C] font-sans">
        {children}
      </body>
    </html>
  );
}

