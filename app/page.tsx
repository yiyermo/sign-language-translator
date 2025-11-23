"use client"

import { useCallback } from "react"

import { useTranslatorState } from "@/hooks/useTranslatorState"
import { useSpeech } from "@/hooks/useSpeech"

import ModeToggle from "@/components/translator/ModeToggle"
import ResultsSection from "@/components/translator/ResultsSection"
import StatusBar from "@/components/translator/StatusBar"
import Instructions from "@/components/translator/Instructions"

// NUEVOS COMPONENTES
import TextToSignsSection from "@/components/translator/TextToSignsSection"
import SignsToTextSection from "@/components/translator/SignsToTextSection"

export default function SignLanguageTranslatorPage() {
  const {
    mode,
    setMode,
    translatedText,
    setTranslatedText,
    inputText,
    setInputText,
    clearTranslation,
  } = useTranslatorState()

  const { speak } = useSpeech()

  // Hablar el texto (sirve para ambos modos)
  const handleSpeak = useCallback(() => {
    const textToSpeak = translatedText || inputText
    if (!textToSpeak) return
    speak(textToSpeak, "es-CL")
  }, [speak, translatedText, inputText])

  // Limpiar textos
  const handleClear = useCallback(() => {
    clearTranslation()
  }, [clearTranslation])

  const handleModeChange = useCallback(
    (newMode: typeof mode) => {
      setMode(newMode)
    },
    [setMode]
  )

  // Qué se muestra en el panel de resultado
  const shownText = translatedText || inputText || ""

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Traductor de Lengua de Señas (Deletreo)
          </h1>
          <p className="text-muted-foreground text-lg">
            Texto ↔ Señas usando el abecedario manual, sin cámara
          </p>
        </div>

        {/* Cambiador de modo */}
        <ModeToggle mode={mode} onChange={handleModeChange} />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Columna izquierda: interacción principal */}
          {mode === "text-to-signs" ? (
            <TextToSignsSection
              value={inputText}
              onChange={(value) => {
                setInputText(value)
                // reflejamos también en translatedText para el panel de resultado y TTS
                setTranslatedText(value)
              }}
            />
          ) : (
            <SignsToTextSection
              value={translatedText}
              onChange={(value) => {
                setTranslatedText(value)
              }}
            />
          )}

          {/* Columna derecha: resultado + acciones */}
          <ResultsSection
            mode={mode}
            text={shownText}
            onSpeak={handleSpeak}
            onClear={handleClear}
          />
        </div>

        {/* Ya no hay cámara ni IA, pero podemos usar el StatusBar
            para mostrar solo el modo actual */}
        <StatusBar isRecording={false} mode={mode} />

        <Instructions />
      </div>
    </div>
  )
}
