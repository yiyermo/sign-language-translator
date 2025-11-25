"use client"

import { Button } from "@/components/ui/button"
import { Hand, Type } from "lucide-react"
import type { Mode } from "@/hooks/useTranslatorState"

type Props = {
  mode: Mode
  onChange: (m: Mode) => void
}

export default function ModeToggle({ mode, onChange }: Props) {
  const isSignsToText = mode === "signs-to-text"
  const isTextToSigns = mode === "text-to-signs"

  return (
    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
      {/* Etiqueta pequeña (opcional) */}
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
  )
}
