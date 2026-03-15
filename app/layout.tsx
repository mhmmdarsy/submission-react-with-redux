import type { Metadata } from "next";
import {
  Fraunces as fraunces,
  Space_Grotesk as spaceGrotesk,
} from "next/font/google";
import Navbar from "@/src/components/common/Navbar";
import StoreProvider from "@/src/components/providers/StoreProvider";
import "./globals.css";

const headingFont = fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = spaceGrotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Difohub - Dicoding Forum Hub",
  description: "Discussion forum application powered by Dicoding Forum API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} app-body`}>
        <StoreProvider>
          <Navbar />
          <main className="container-main">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
