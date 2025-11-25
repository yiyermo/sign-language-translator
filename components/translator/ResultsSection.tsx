"use client"

import { useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { mapTextToSignLetters } from "@/hooks/useTextToSigns"

type ResultsSectionProps = {
  mode: "text-to-signs" | "signs-to-text"
  text: string
  onSpeak?: () => void
  onClear?: () => void
}

export default function ResultsSection({
  mode,
  text,
  onSpeak,
  onClear,
}: ResultsSectionProps) {
  const isTextToSigns = mode === "text-to-signs"

  const words = useMemo(() => {
    if (!isTextToSigns || !text) return []
    const matches = text.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g)
    if (!matches) return []

    return matches.map((word, index) => {
      const cleaned = word.trim()
      return {
        id: `${cleaned}-${index}`,
        word: cleaned,
        letters: mapTextToSignLetters(cleaned),
      }
    })
  }, [isTextToSigns, text])

  const handleCopy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
    } catch (e) {
      console.error("No se pudo copiar el texto", e)
    }
  }

  // tamaño de fuente seguro (no deforma el card)
  const getWordSizeClass = (length: number) => {
    if (length > 40) return "text-[10px] md:text-xs"
    if (length > 25) return "text-xs md:text-sm"
    if (length > 16) return "text-sm md:text-base"
    return "text-base md:text-lg"
  }

  return (
    <Card className="h-full w-full max-w-full flex flex-col md:min-h-80 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">
          {isTextToSigns ? "Deletreo en señas" : "Resultado"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1 overflow-hidden">
        {isTextToSigns ? (
          <>
            <p className="text-sm text-muted-foreground">
              Deletreo en señas ({words.length} palabra
              {words.length === 1 ? "" : "s"}):
            </p>

            {/* CONTENEDOR PRINCIPAL: solo scroll vertical */}
            <div className="border rounded-lg bg-muted/40 p-3 max-h-96 overflow-y-auto space-y-3">
              {words.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Escribe texto en el panel de la izquierda para ver aquí la
                  traducción en señas, palabra por palabra.
                </p>
              ) : (
                words.map((w) => {
                  const sizeClass = getWordSizeClass(w.word.length)

                  return (
                    <div
                      key={w.id}
                      className="flex flex-col gap-2 rounded-md bg-background/60 px-2 py-2 border"
                    >
                      {/* 🔵 FILA CON SCROLL HORIZONTAL INTERNO */}
                      <div className="relative w-full max-w-full overflow-x-auto">
                        {/* Este div puede ser más ancho que el card, 
                            pero el overflow queda contenido aquí */}
                        <div className="inline-flex items-center gap-3">
                          {/* Palabra completa siempre en horizontal */}
                          <span
                            className={`
                              shrink-0 inline-block px-3 py-1
                              font-bold tracking-wide uppercase
                              whitespace-nowrap rounded-md shadow-sm
                              bg-card
                              ${sizeClass}
                            `}
                          >
                            {w.word}
                          </span>

                          {/* Letras en una sola fila */}
                          <div className="flex items-center gap-2">
                            {w.letters.map((letter) => (
                              <div
                                key={letter.index}
                                className="shrink-0 flex flex-col items-center gap-1"
                              >
                                <span className="text-[10px] font-medium">
                                  {letter.char}
                                </span>
                                <Image
                                  src={letter.imageSrc}
                                  alt={`Seña de ${letter.char}`}
                                  width={48}
                                  height={48}
                                  className="rounded-md border object-contain"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </>
        ) : (
          // =======================
          // MODO SEÑAS → TEXTO
          // =======================
          <div className="flex flex-col gap-2 flex-1">
            <p className="text-sm text-muted-foreground">Texto resultante:</p>

            <div className="border rounded-lg bg-muted/40 p-3 min-h-[120px] font-mono text-sm whitespace-pre-wrap">
              {text ? (
                <>
                  <span>{text}</span>
                  <span className="inline-block w-0.5 h-4 bg-foreground ml-0.5 align-baseline animate-pulse" />
                </>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Aquí aparecerá el texto que construyas con el deletreo en
                  señas. El cursor indica dónde se agregan nuevas letras y
                  espacios.
                </span>
              )}
            </div>
          </div>
        )}

        {/* Botones inferiores */}
        <div className="mt-auto flex flex-wrap gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!text}
          >
            Copiar texto
          </Button>

          {onSpeak && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onSpeak}
              disabled={!text}
            >
              Escuchar
            </Button>
          )}

          {onClear && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
            >
              Limpiar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
