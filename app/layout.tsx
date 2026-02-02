import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { clsx } from "clsx"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Desarrollo de Software a Medida y ERPs para Pymes en España",
  description:
    "Digitaliza tu empresa con software a medida. Especialistas en ERPs compatibles con Verifactu, sistemas de pedidos para hostelería y diseño web profesional.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={clsx(
          inter.className,
          "antialiased min-h-screen flex flex-col",
        )}
      >
        {children}
      </body>
    </html>
  )
}
