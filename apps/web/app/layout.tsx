import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import "./globals.css";

const headingFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"]
});

const bodyFont = Roboto({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: "FoxMind",
  description: "FoxMind Secundario"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
