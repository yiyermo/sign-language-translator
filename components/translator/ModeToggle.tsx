"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Hand, Type } from "lucide-react"
import type { Mode } from "@/hooks/useTranslatorState"
import { cn } from "@/lib/utils"

type Props = {
  mode: Mode
  onChange: (m: Mode) => void
}

export default function ModeToggle({ mode, onChange }: Props) {
  const isSignsToText = mode === "signs-to-text"
  const isTextToSigns = mode === "text-to-signs"

  return (
    <Card className="bg-card/80 border border-border/40 rounded-2xl shadow-sm backdrop-blur-sm">
      <CardContent className="p-5 space-y-4">
        
        {/* Descripción */}
        <p className="text-xs md:text-sm text-muted-foreground text-center leading-relaxed">
          Selecciona el modo de uso del traductor:  
          convierte señas en texto con la cámara o escribe palabras para ver su 
          representación en señas.
        </p>

        {/* Contenedor de botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch">
          
          {/* Botón: Señas → Texto */}
          <Button
            onClick={() => onChange("signs-to-text")}
            aria-pressed={isSignsToText}
            size="lg"
            variant="outline"
            className={cn(
              "w-full sm:w-auto min-h-[52px] text-sm md:text-base rounded-xl",
              "flex items-center justify-center gap-2 transition-all",
              "hover:-translate-y-[2px] active:scale-[0.97]",
              isSignsToText &&
                "bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-md border-primary"
            )}
          >
            <Hand
              className={cn(
                "h-5 w-5 transition-colors",
                isSignsToText ? "text-primary-foreground" : "text-primary"
              )}
            />
            Señas a texto
          </Button>

          {/* Botón: Texto → Señas */}
          <Button
            onClick={() => onChange("text-to-signs")}
            aria-pressed={isTextToSigns}
            size="lg"
            variant="outline"
            className={cn(
              "w-full sm:w-auto min-h-[52px] text-sm md:text-base rounded-xl",
              "flex items-center justify-center gap-2 transition-all",
              "hover:-translate-y-[2px] active:scale-[0.97]",
              isTextToSigns &&
                "bg-gradient-to-br from-secondary/70 to-secondary text-secondary-foreground shadow-md border-secondary"
            )}
          >
            <Type
              className={cn(
                "h-5 w-5 transition-colors",
                isTextToSigns ? "text-secondary-foreground" : "text-secondary"
              )}
            />
            Texto a señas
          </Button>

        </div>
      </CardContent>
    </Card>
  )
}
