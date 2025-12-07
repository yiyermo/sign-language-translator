"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type TextToSignsSectionProps = {
  value: string
  onChange: (value: string) => void
}

export default function TextToSignsSection({
  value,
  onChange,
}: TextToSignsSectionProps) {
  return (
    // 🔹 Sección identificable por lectores de pantalla
    <section
      aria-labelledby="text-to-signs-heading"
      className="h-full"
    >
      <Card
        className={cn(
          "h-full flex flex-col rounded-2xl",
          "bg-card/80 backdrop-blur-sm border border-border/40 shadow-sm"
        )}
      >
        <CardHeader>
          <CardTitle
            id="text-to-signs-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Texto a señas (deletreo en tiempo real)
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 flex-1">

          {/* Descripción visible */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            Escribe cualquier palabra o frase.
            El panel de <b>Resultado</b> mostrará automáticamente la traducción en
            señas, letra por letra.
          </p>

          {/* Área de entrada accesible */}
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escribe aquí para ver la traducción en señas…"
            aria-label="Texto a traducir a señas"
            aria-describedby="text-to-signs-help"
            className={cn(
              "min-h-40 rounded-xl",
              "transition-all duration-300",
              "focus-visible:ring-2 focus-visible:ring-primary/50",
              "shadow-inner"
            )}
          />

          {/* Ayuda solo para lector de pantalla */}
          <p id="text-to-signs-help" className="sr-only">
            Ingresa una palabra o frase en español. 
            La traducción en señas se mostrará en el panel de resultado de forma automática.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
