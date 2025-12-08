// app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            {/* Contenido principal */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t bg-muted/40">
              <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-xs sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground">
                  © {new Date().getFullYear()} Manos que Hablan. Todos los derechos reservados.
                </p>

                <nav className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Políticas de privacidad
                  </Link>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Términos y condiciones
                  </Link>
                </nav>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
