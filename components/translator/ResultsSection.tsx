"use client"

import { useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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

  // Solo calculamos palabras → señas cuando estamos en modo texto → señas
  const words = useMemo(() => {
    if (!isTextToSigns || !text) return []
    const matches = text.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g)
    if (!matches) return []
    return matches.map((word, index) => ({
      id: `${word}-${index}`,
      word,
      letters: mapTextToSignLetters(word),
    }))
  }, [isTextToSigns, text])

  const handleCopy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
    } catch (e) {
      console.error("No se pudo copiar el texto", e)
    }
  }

  return (
    <Card className="h-full flex flex-col md:min-h-[320px]">
      <CardHeader>
        <CardTitle className="text-xl">
          {isTextToSigns ? "Deletreo en señas" : "Resultado"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        {isTextToSigns ? (
          // =======================
          // MODO TEXTO → SEÑAS
          // SOLO mostramos el deletreo en señas
          // =======================
          <>
            <p className="text-sm text-muted-foreground">
              Deletreo en señas ({words.length} palabra
              {words.length === 1 ? "" : "s"}):
            </p>

            <div className="border rounded-lg bg-muted/40 p-3 max-h-96 overflow-y-auto space-y-4">
              {words.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Escribe texto en el panel de la izquierda para ver aquí la
                  traducción en señas, palabra por palabra.
                </p>
              ) : (
                words.map((w) => (
                  <div key={w.id} className="flex flex-col gap-2">
                    {/* Palabra */}
                    <span className="text-sm font-semibold">{w.word}</span>

                    {/* Letras con scroll horizontal */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {w.letters.map((letter) => (
                        <div
                          key={letter.index}
                          className="flex-shrink-0 w-16 flex flex-col items-center gap-1"
                        >
                          <span className="text-[10px] font-medium">
                            {letter.char}
                          </span>
                          <Image
                            src={letter.imageSrc}
                            alt={`Seña de la letra ${letter.char}`}
                            width={56}
                            height={56}
                            className="rounded-md border"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          // =======================
          // MODO SEÑAS → TEXTO
          // Mostramos solo texto resultante
          // =======================
          <div className="flex flex-col gap-2 flex-1">
            <p className="text-sm text-muted-foreground">Texto resultante:</p>
            <Textarea
              readOnly
              value={text}
              className="min-h-[120px] resize-none"
              placeholder="Aquí aparecerá el texto que construyas con el deletreo en señas."
            />
          </div>
        )}

        {/* Botones inferiores */}
        <div className="mt-auto flex flex-wrap gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
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
