// app/layout.tsx
import type { ReactNode } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}   // 👈 fuerza light
          disableTransitionOnChange
        >
          {/* 🔹 Enlace para saltar directo al contenido principal */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground"
          >
            Saltar al contenido principal
          </a>

          <div className="min-h-screen flex flex-col">
            {/* Si tienes un header global, podría ir aquí arriba */}

            {/* 🔹 Landmark principal accesible */}
            <main
              id="main-content"
              role="main"
              className="flex-1 focus:outline-none"
            >
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
