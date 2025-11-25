// components/translator/ModeToggle.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Hand, Type } from "lucide-react"
import type { Mode } from "@/hooks/useTranslatorState"
import { Card, CardContent } from "../ui/card"

type Props = {
  mode: Mode
  onChange: (m: Mode) => void
}

export default function ModeToggle({ mode, onChange }: Props) {
  const isSignsToText = mode === "signs-to-text"
  const isTextToSigns = mode === "text-to-signs"

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4 md:p-5 space-y-3">
        <p className="text-xs md:text-sm text-muted-foreground text-center">
          Elige cómo quieres usar el traductor: escribir texto para ver el deletreo
          en señas, o practicar el deletreo construyendo palabras con el teclado.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-center">
          <Button
            variant={isSignsToText ? "default" : "outline"}
            size="lg"
            onClick={() => onChange("signs-to-text")}
            className="w-full sm:w-auto min-h-[52px] text-sm md:text-base justify-center"
            aria-pressed={isSignsToText}
          >
            <Hand className="mr-2 h-5 w-5" />
            Señas a texto
          </Button>

          <Button
            variant={isTextToSigns ? "default" : "outline"}
            size="lg"
            onClick={() => onChange("text-to-signs")}
            className="w-full sm:w-auto min-h-[52px] text-sm md:text-base justify-center"
            aria-pressed={isTextToSigns}
          >
            <Type className="mr-2 h-5 w-5" />
            Texto a señas
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
