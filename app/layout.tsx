import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import Navbar from "@/src/components/common/Navbar";
import StoreProvider from "@/src/components/providers/StoreProvider";
import "./globals.css";

const headingFont = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forum Hub - Dicoding Forum App",
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
