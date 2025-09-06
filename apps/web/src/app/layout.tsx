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
  title: "SysAndMe - System Design Tool",
  description: "Interactive system design and diagramming tool powered by TLdraw",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full m-0 p-0 bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
