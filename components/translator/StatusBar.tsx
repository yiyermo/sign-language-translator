"use client"

import { Badge } from "@/components/ui/badge"
import type { Mode } from "@/hooks/useTranslatorState"

type Props = {
  isRecording: boolean
  mode: Mode
  languageLabel?: string
}

export default function StatusBar({ isRecording, mode, languageLabel = "Español Castellano" }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Badge variant={isRecording ? "default" : "secondary"}>
        {isRecording ? "Cámara Activa" : "Cámara Inactiva"}
      </Badge>
      <Badge variant="outline">Modo: {mode === "signs-to-text" ? "Señas → Texto" : "Texto → Señas"}</Badge>
      <Badge variant="outline">Idioma: {languageLabel}</Badge>
    </div>
  )
}
