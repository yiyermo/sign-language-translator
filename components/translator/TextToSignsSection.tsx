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
    <Card
      className={cn(
        "h-full flex flex-col rounded-2xl",
        "bg-card/80 backdrop-blur-sm border border-border/40 shadow-sm"
      )}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">
          Texto a señas (deletreo en tiempo real)
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">

        {/* Descripción */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          Escribe cualquier palabra o frase.  
          El panel de <b>Resultado</b> mostrará automáticamente la traducción en
          señas, letra por letra.
        </p>

        {/* Área de entrada */}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe aquí para ver la traducción en señas…"
          className={cn(
            "min-h-[160px] rounded-xl",
            "transition-all duration-300",
            "focus-visible:ring-2 focus-visible:ring-primary/50",
            "shadow-inner"
          )}
        />
      </CardContent>
    </Card>
  )
}
