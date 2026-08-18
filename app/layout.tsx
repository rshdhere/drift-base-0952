import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snakes & Ladders",
  description: "Classic Snakes and Ladders board game built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
