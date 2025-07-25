import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import  {Header}  from "../composants/Header"
import '../styles/globals.css'
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html  lang="fr" className="">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <div>
          
        <Header />
        {children}
          </div>
      </body>
    </html>
  );
}
