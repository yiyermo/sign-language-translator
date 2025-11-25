"use client"

import { Badge } from "@/components/ui/badge"
import { Languages, Hand, Type, Sparkles, CircleDot } from "lucide-react"
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
  const isSignsToText = mode === "signs-to-text"
  const modeLabel = isSignsToText ? "Señas → Texto" : "Texto → Señas"

  const tips = isSignsToText
    ? [
        "Usa el teclado de manos para elegir cada letra.",
        "Observa cómo el texto se construye en el panel derecho.",
        "Si te equivocas, usa borrar o Limpiar para empezar de nuevo.",
      ]
    : [
        "Escribe una palabra o frase breve para comenzar.",
        "Desplázate horizontalmente para ver todas las señas si son muchas letras.",
        "Copia el texto si quieres guardarlo o compartirlo.",
      ]

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm",
        "shadow-sm px-3 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
        "animate-in fade-in-0 zoom-in-95 duration-150"
      )}
    >
      {/* LADO IZQUIERDO: ESTADO / MODO */}
      <div className="flex items-start gap-3">
        {/* Icono principal */}
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-pink-500 text-white shadow-sm">
          {isSignsToText ? (
            <Hand className="h-5 w-5" />
          ) : (
            <Type className="h-5 w-5" />
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Modo actual
            </span>

            <Badge
              variant="outline"
              className="gap-1 px-2 py-0.5 text-[11px] font-medium"
            >
              <Sparkles className="h-3 w-3 text-yellow-500" />
              {modeLabel}
            </Badge>

            <Badge
              variant="outline"
              className="gap-1 px-2 py-0.5 text-[11px] font-medium"
            >
              <Languages className="h-3 w-3 opacity-70" />
              {languageLabel}
            </Badge>

            <Badge
              variant={isRecording ? "default" : "outline"}
              className={cn(
                "gap-1 px-2 py-0.5 text-[11px] font-medium",
                isRecording && "bg-emerald-600 text-white border-emerald-600"
              )}
            >
              <CircleDot
                className={cn(
                  "h-3 w-3",
                  isRecording ? "animate-pulse" : "opacity-60"
                )}
              />
              {isRecording ? "Grabando..." : "Listo para usar"}
            </Badge>
          </div>

          <p className="text-[11px] text-muted-foreground">
            {isSignsToText
              ? "Construye palabras usando el teclado visual de señas."
              : "Escribe texto y obsérvalo deletreado en imágenes de señas."}
          </p>
        </div>
      </div>

      {/* LADO DERECHO: CONSEJOS RÁPIDOS */}
      <div className="border-t pt-2 mt-2 md:mt-0 md:border-t-0 md:border-l md:pl-3 md:pt-0 border-border/40">
        <p className="text-[11px] font-semibold text-muted-foreground mb-1 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-indigo-500" />
          Tips para este modo
        </p>
        <ul className="space-y-1 text-[11px] md:text-xs text-muted-foreground">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex gap-1.5">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-indigo-400/80 shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
