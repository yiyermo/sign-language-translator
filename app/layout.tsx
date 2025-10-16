import type React from "react"
import type { Metadata } from "next"
import { Open_Sans, Work_Sans } from "next/font/google"
import "./globals.css"

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "Traductor de Lenguaje de Señas",
  description: "Aplicación web para traducir lenguaje de señas español castellano a texto y viceversa",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${openSans.variable} ${workSans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
