import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ProviderQuery from "@/lib/queryClient";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Chat with AI",
  description: "Analysis your pdf with the help of AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ProviderQuery>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
          >
            {children}
            <Toaster />
          </body>
        </html>
      </ProviderQuery>
    </ClerkProvider>
  );
}
