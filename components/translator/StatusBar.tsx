"use client"

import { Badge } from "@/components/ui/badge"
import type { Mode } from "@/hooks/useTranslatorState"

type Props = {
  isRecording: boolean // ya no se usa para cámara, se deja por compatibilidad
  mode: Mode
  languageLabel?: string
}

export default function StatusBar({
  isRecording,
  mode,
  languageLabel = "Español (Chile)",
}: Props) {
  const modeLabel =
    mode === "signs-to-text" ? "Señas → Texto" : "Texto → Señas"

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="outline">
          Interacción: Teclado de señas + imágenes
        </Badge>
        <Badge variant="outline">Modo: {modeLabel}</Badge>
        <Badge variant="outline">Idioma: {languageLabel}</Badge>
      </div>
      <p className="text-[11px] text-center text-muted-foreground">
        Este traductor funciona sin cámara. Todo el deletreo se realiza mediante
        texto y un teclado visual de señas.
      </p>
    </div>
  )
}
