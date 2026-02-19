import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { clsx } from "clsx"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Satorus: Software a Medida y ERPs para Pymes en España | VeriFactu",
  description:
    "Desarrollamos aplicaciones web y móviles a medida, ERPs personalizados y soluciones de automatización IA para Pymes. Cumplimiento VeriFactu garantizado. Consultoría gratuita.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body
        className={clsx(
          inter.className,
          "antialiased min-h-screen flex flex-col bg-dark-900"
        )}
      >
        {children}
      </body>
    </html>
  )
}
