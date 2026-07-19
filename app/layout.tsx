import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import QueryProvider from "@/components/QueryProvider"; // 👈 Import this

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobHub – Find Your Dream Job",
  description: "Discover thousands of job opportunities from top companies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider> {/* 👈 Wrap everything with QueryProvider */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}