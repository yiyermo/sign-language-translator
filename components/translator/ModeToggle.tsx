// components/translator/ModeToggle.tsx
"use client"

import { Button } from "@/components/ui/button"
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
<<<<<<< HEAD
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
              "hover:-translate-y-0.5 active:scale-[0.97]",
              isSignsToText &&
                "bg-linear-to-br from-primary/90 to-primary text-primary-foreground shadow-md border-primary"
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
              "hover:-translate-y-0.5 active:scale-[0.97]",
              isTextToSigns &&
                "bg-linear-to-br from-secondary/70 to-secondary text-secondary-foreground shadow-md border-secondary"
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
=======
    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
      {/* Etiqueta pequeña, si quieres la puedes borrar */}
      <span className="text-[11px] text-muted-foreground">
        Modo de uso
      </span>

      {/* Toggle tipo “pastilla” */}
      <div className="inline-flex items-center rounded-full border bg-card p-1 shadow-sm">
        <Button
          type="button"
          variant={isSignsToText ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange("signs-to-text")}
          className={`rounded-full px-3 py-1 text-xs md:text-sm flex items-center gap-1 ${
            isSignsToText ? "" : "hover:bg-muted/70"
          }`}
          aria-pressed={isSignsToText}
        >
          <Hand className="h-4 w-4" />
          <span>Señas a texto</span>
        </Button>

        <Button
          type="button"
          variant={isTextToSigns ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange("text-to-signs")}
          className={`rounded-full px-3 py-1 text-xs md:text-sm flex items-center gap-1 ${
            isTextToSigns ? "" : "hover:bg-muted/70"
          }`}
          aria-pressed={isTextToSigns}
        >
          <Type className="h-4 w-4" />
          <span>Texto a señas</span>
        </Button>
      </div>
    </div>
>>>>>>> b5d1a6a (Fameando aura)
  )
}
