import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import AuthProvider from "@/components/auth/Providers";
config.autoAddCss = false


const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Reader blogging platform",
  description: "A modern blogging platform built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className}  antialiased`}
      >
        <AuthProvider>
        {children}
        <Toaster position="bottom-right" reverseOrder={false}/>
        </AuthProvider>
      </body>
    </html>
  );
}
