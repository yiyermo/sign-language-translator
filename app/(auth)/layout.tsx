import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="bg-card border border-border shadow-sm rounded-2xl p-6 space-y-4">
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-heading font-bold tracking-tight">
                Yiyermo · Sign Language Translator
              </h1>
              <p className="text-sm text-muted-foreground">
                Crea tu cuenta o inicia sesión para guardar tu historial
                de traducciones y ver tu progreso.
              </p>
            </div>

            {/* Aquí se pintan /login y /register */}
            {children}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Proyecto académico · Próximas actualizaciones: historial, analíticas
            y mejoras de accesibilidad.
          </p>
        </div>
      </div>
    </div>
  )
}
