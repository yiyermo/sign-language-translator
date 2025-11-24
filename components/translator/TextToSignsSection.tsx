"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type TextToSignsSectionProps = {
  value: string
  onChange: (value: string) => void
}

export default function TextToSignsSection({
  value,
  onChange,
}: TextToSignsSectionProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">
          Texto a señas (deletreo, en tiempo real)
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        <p className="text-sm text-muted-foreground">
          Escribe el texto que quieres traducir.  
          La conversión a señas aparecerá en el panel de <b>Resultado</b>.
        </p>

        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe aquí..."
          className="min-h-[160px]"
        />
      </CardContent>
    </Card>
  )
}
