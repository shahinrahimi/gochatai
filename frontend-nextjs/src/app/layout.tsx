import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProviderWrapper } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"]})

export const metadata: Metadata = {
  title: "AI Assisstant",
  description: "Your Personal AI assistant for chat messaged compeletion",
}

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProviderWrapper>
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
