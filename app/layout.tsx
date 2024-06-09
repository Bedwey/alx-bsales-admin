import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModalProvider } from "@/providers/modal-provider";

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/providers/theme-provider";


const font = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BSales - Dashboard",
  description: "BSales Dashboard for All Your Needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <TooltipProvider>
            <ModalProvider />
            {children}
          </TooltipProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
