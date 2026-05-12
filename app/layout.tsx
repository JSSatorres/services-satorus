import type { Metadata } from "next"
import "./globals.css"

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
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <div className="page-bg" />
        {children}
      </body>
    </html>
  )
}
