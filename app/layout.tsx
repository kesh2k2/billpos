import type { Metadata } from "next";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { PreloaderProvider } from "@/components/preloader-provider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "BillPOS.lk | Smart POS Solutions",
  description:
    "Modern POS solutions for restaurants, retail shops, supermarkets, salons and growing businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <PreloaderProvider>
          {children}
        </PreloaderProvider>
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
