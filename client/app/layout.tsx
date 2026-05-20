import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReSync",
  description:
    "Smart Research Collaboration Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html
  lang="en"
  suppressHydrationWarning
>

  <head />

  <body
    className="min-h-full overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]"
    suppressHydrationWarning
  >

    {children}

  </body>

</html>
  );
}