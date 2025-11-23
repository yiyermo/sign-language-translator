"use client"

import { useMemo } from "react"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mapTextToSignLetters } from "@/hooks/useTextToSigns"

type TextToSignsSectionProps = {
  value: string
  onChange: (value: string) => void
}

export default function TextToSignsSection({
  value,
  onChange,
}: TextToSignsSectionProps) {
  const letters = useMemo(() => mapTextToSignLetters(value), [value])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">
          Texto a señas (deletreo)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe aquí el texto que quieres ver en señas..."
          className="min-h-[120px]"
        />

        {letters.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Escribe un texto para ver la secuencia de letras en el alfabeto de señas.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {letters.map((letter) => (
              <div
                key={letter.index}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-sm font-semibold">{letter.char}</span>
                <Image
                  src={letter.imageSrc}
                  alt={`Seña de la letra ${letter.char}`}
                  width={64}
                  height={64}
                  className="rounded-md border"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
