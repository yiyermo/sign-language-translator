import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* Encabezado minimal */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Manos que Hablan
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Traductor en Lengua de Señas
          </p>
        </div>

        {/* Contenido (login/register) */}
        <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-4">
          {children}
        </div>

        {/* Footer mínimo */}
        <p className="text-center text-[11px] text-muted-foreground mt-4">
          Proyecto académico — 2025
        </p>
      </div>
    </div>
  )
}
