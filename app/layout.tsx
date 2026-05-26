import type { Metadata } from "next"
import { Syne, Manrope, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
})

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Satorus · Software a Medida y Automatización IA",
  description:
    "Expertos en desarrollo de software a medida, ERPs y automatización inteligente para pymes. Centralizamos tu gestión y cumplimos con VeriFactu. ¡Pide presupuesto!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${syne.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <div className="page-bg" />
        {children}
      </body>
    </html>
  )
}
