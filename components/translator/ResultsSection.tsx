"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Hand, RotateCcw, Type, Copy } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mapTextToSignLetters, SignLetter } from "@/hooks/useTextToSigns"
import type { Mode } from "@/hooks/useTranslatorState"

type Props = {
  mode: Mode
  text: string
  onClear: () => void
}

export default function ResultsSection({ mode, text, onClear }: Props) {
  const [copied, setCopied] = useState(false)

  // Letras (con soporte para espacios) solo en modo TEXTO → SEÑAS
  const letters: SignLetter[] = useMemo(
    () => (mode === "text-to-signs" ? mapTextToSignLetters(text) : []),
    [mode, text]
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text || "")
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (e) {
      console.error("No se pudo copiar", e)
    }
  }

  // Consideramos vacío si no hay texto (para botón Copiar / Limpiar)
  const isEmpty =
    mode === "text-to-signs" ? !text || text.trim().length === 0 : !text

  const titleIcon =
    mode === "signs-to-text" ? (
      <Type className="h-5 w-5" />
    ) : (
      <Hand className="h-5 w-5" />
    )

  const titleText =
    mode === "signs-to-text" ? "Texto construido" : "Deletreo en señas"

  const placeholder =
    mode === "signs-to-text"
      ? "Aquí verás el texto que construyes seleccionando señas en el teclado."
      : "Escribe texto en la columna izquierda para ver aquí el deletreo con imágenes."

  return (
    <Card className="h-full flex flex-col border border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-heading flex items-center gap-2 text-lg md:text-xl">
          {titleIcon}
          {titleText}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* CONTENIDO PRINCIPAL SOLO PARA SEÑAS → TEXTO */}
        {mode === "signs-to-text" && (
          <div className="min-h-[140px] rounded-lg border border-border bg-muted/60 p-4">
            {text ? (
              <p className="text-base md:text-lg leading-relaxed select-text whitespace-pre-wrap wrap-break-word">
                {text}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                {placeholder}
              </p>
            )}
          </div>
        )}

        {/* SOLO EN TEXTO → SEÑAS: MOSTRAR IMÁGENES (CON ESPACIOS) */}
        {mode === "text-to-signs" && text && letters.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Deletreo en señas ({letters.length}{" "}
              {letters.length === 1 ? "seña" : "señas"}):
            </p>
            <ScrollArea className="max-h-64 rounded-md border border-border bg-muted/40 p-3">
              <div className="flex flex-wrap gap-3">
                {letters.map((letter) => (
                  <div
                    key={letter.index}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-xs font-semibold">
                      {letter.char}
                    </span>

                    {letter.isSpace ? (
                      <div className="w-16 h-16 rounded-md border border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground bg-background">
                        espacio
                      </div>
                    ) : (
                      <div className="relative w-16 h-16">
                        <Image
                          src={letter.imageSrc}
                          alt={`Seña de la letra ${letter.char}`}
                          fill
                          sizes="64px"
                          className="rounded-md border border-border object-contain bg-background"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* ACCIONES */}
        <div className="flex flex-col gap-2 md:flex-row md:gap-3 mt-auto">
          {/* COPIAR */}
          <Button
            type="button"
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex-1 min-h-11"
            disabled={isEmpty}
          >
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "¡Copiado!" : "Copiar texto"}
          </Button>

          {/* LIMPIAR */}
          <Button
            type="button"
            onClick={onClear}
            variant="outline"
            size="sm"
            className="flex-1 min-h-11"
            disabled={isEmpty}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
