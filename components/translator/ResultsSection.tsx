"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Hand, RotateCcw, Type, Volume2, Copy } from "lucide-react"
import type { Mode } from "@/hooks/useTranslatorState"

type Props = {
  mode: Mode
  text: string
  onSpeak: () => void
  onClear: () => void
}

export default function ResultsSection({ mode, text, onSpeak, onClear }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text || "")
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (e) {
      console.error("No se pudo copiar", e)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2">
          {mode === "signs-to-text" ? (
            <>
              <Type className="h-5 w-5" />
              Texto Traducido
            </>
          ) : (
            <>
              <Hand className="h-5 w-5" />
              Señas Generadas
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="min-h-[200px] p-4 bg-muted rounded-lg">
          {text ? (
            <p className="text-lg leading-relaxed select-text whitespace-pre-wrap wrap-break-word">
              {text}
            </p>
          ) : (
            <p className="text-muted-foreground text-center">
              {mode === "signs-to-text" ? "La traducción aparecerá aquí..." : "Las señas se mostrarán aquí..."}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCopy} variant="outline" size="lg" className="flex-1 min-h-[50px] bg-transparent" disabled={!text}>
            <Copy className="mr-2 h-5 w-5" />
            {copied ? "¡Copiado!" : "Copiar"}
          </Button>
          <Button onClick={onSpeak} variant="outline" size="lg" className="flex-1 min-h-[50px] bg-transparent" disabled={!text}>
            <Volume2 className="mr-2 h-5 w-5" />
            Reproducir Audio
          </Button>
          <Button onClick={onClear} variant="outline" size="lg" className="min-h-[50px] bg-transparent" disabled={!text}>
            <RotateCcw className="mr-2 h-5 w-5" />
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
