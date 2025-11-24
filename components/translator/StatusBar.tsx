"use client"

import { Badge } from "@/components/ui/badge"
import { Languages, Hand, Type } from "lucide-react"
import type { Mode } from "@/hooks/useTranslatorState"
import { cn } from "@/lib/utils"

type Props = {
  isRecording: boolean
  mode: Mode
  languageLabel?: string
}

export default function StatusBar({
  isRecording,
  mode,
  languageLabel = "Español (CL)",
}: Props) {
  const modeLabel =
    mode === "signs-to-text" ? "Señas → Texto" : "Texto → Señas"

  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-card/70 backdrop-blur-sm",
        "shadow-sm px-3 py-2 flex flex-col gap-2",
        "animate-in fade-in duration-150"
      )}
    >

      {/* ============================
         VERSION COMPACTA (MOBILE)
         Visible SOLO en pantallas < 640px
      ============================= */}
      <div className="flex flex-col gap-1 sm:hidden">

        {/* Badges Mini */}
        <div className="flex flex-wrap justify-center gap-1">
          <Badge
            variant="outline"
            className="gap-1 px-1.5 py-0.5 text-[10px] font-medium"
          >
            <Hand className="h-3 w-3 opacity-60" />
            Señas
          </Badge>

          <Badge
            variant="outline"
            className="gap-1 px-1.5 py-0.5 text-[10px] font-medium"
          >
            <Type className="h-3 w-3 opacity-60" />
            {modeLabel}
          </Badge>

          <Badge
            variant="outline"
            className="gap-1 px-1.5 py-0.5 text-[10px] font-medium"
          >
            <Languages className="h-3 w-3 opacity-60" />
            {languageLabel}
          </Badge>
        </div>

        <p className="text-[10px] text-center text-muted-foreground leading-tight">
          Sin cámara. Deletreo mediante teclado visual.
        </p>
      </div>

      {/* ============================
         VERSION COMPLETA (DESKTOP)
         Visible SOLO en pantallas ≥ 640px
      ============================= */}
      <div className="hidden sm:flex flex-col gap-2">

        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="outline" className="gap-1 px-2 py-1">
            <Hand className="h-4 w-4 opacity-70" />
            Interacción: Teclado de señas + imágenes
          </Badge>

          <Badge variant="outline" className="gap-1 px-2 py-1">
            <Type className="h-4 w-4 opacity-70" />
            Modo: {modeLabel}
          </Badge>

          <Badge variant="outline" className="gap-1 px-2 py-1">
            <Languages className="h-4 w-4 opacity-70" />
            Idioma: {languageLabel}
          </Badge>
        </div>

        <p className="text-[11px] text-center text-muted-foreground">
          Este traductor funciona sin cámara. El deletreo se realiza mediante texto
          y un teclado visual basado en imágenes.
        </p>

      </div>

    </div>
  )
}
