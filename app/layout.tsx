import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "drift-base-0952",
  description: "make me a snake and ladder game using nextjs please",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
