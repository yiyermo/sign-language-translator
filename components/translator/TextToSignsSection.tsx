"use client"

import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type TextToSignsSectionProps = {
  value: string
  onChange: (value: string) => void
}

export default function TextToSignsSection({
  value,
  onChange,
}: TextToSignsSectionProps) {
  const length = value.trim().length

  return (
    <Card className="h-full flex flex-col border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg md:text-xl">
              Texto a señas (deletreo)
            </CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground">
              Escribe una palabra o frase. En la columna derecha verás cada letra
              representada con su seña correspondiente.
            </p>
          </div>
          {length > 0 && (
            <span className="text-xs text-muted-foreground">
              {length} {length === 1 ? "carácter" : "caracteres"}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe aquí el texto que quieres ver en señas..."
          className="min-h-[140px] bg-background"
        />
        <p className="text-[11px] text-muted-foreground">
          Consejo: comienza con palabras cortas para familiarizarte con el alfabeto manual.
        </p>
      </CardContent>
    </Card>
  )
}
