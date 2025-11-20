"use client"

import { useState, useCallback } from "react"

import { useTranslatorState } from "@/hooks/useTranslatorState"
import { useCamera } from "@/hooks/useCamera"
import { useSpeech } from "@/hooks/useSpeech"
import { useSignToText } from "@/hooks/useSignToText"

import ModeToggle from "@/components/translator/ModeToggle"
import CameraSection from "@/components/translator/CameraSection"
import ResultsSection from "@/components/translator/ResultsSection"
import StatusBar from "@/components/translator/StatusBar"
import Instructions from "@/components/translator/Instructions"

export default function SignLanguageTranslatorPage() {
  // Estado global (modo, texto traducido, etc.)
  const {
    mode,
    setMode,
    translatedText,
    setTranslatedText,
    inputText,
    setInputText,
    clearTranslation,
  } = useTranslatorState()

  // Cámara: viene con su propio videoRef interno
  const { videoRef, cameraPermission, isRecording, startCamera, stopCamera } = useCamera()

  // Texto a voz
  const { speak } = useSpeech()

  // Buffers internos para mostrar la experiencia de escritura en vivo
  // liveLetters = lo que voy deletreando ahora mismo (A M O ...)
  // finalWords  = palabras ya "cerradas" cuando dejo de hacer seña ~1.2s
  const [liveLetters, setLiveLetters] = useState("")
  const [finalWords, setFinalWords] = useState("")

  // Hook de IA (modelo tfjs + mediapipe)
  const { isRunning, start, stop } = useSignToText({
    onLetter: (ch) => {
      // Se detectó una letra en el frame actual
      setLiveLetters((prev) => prev + ch)

      // También lo reflejamos inmediatamente en el texto global
      setTranslatedText((prev) => (prev ? prev + ch : ch))
    },

    onWord: (word) => {
      // Se detectó una "pausa", entonces esa secuencia es una palabra completa
      const clean = word.trim()
      if (!clean) return

      // Agregar al historial de palabras finales
      setFinalWords((prev) => (prev ? `${prev} ${clean}` : clean))

      // Reflejarlo en el texto global visible
      setTranslatedText((prev) =>
        prev ? `${prev} ${clean}` : clean
      )

      // Vaciar las letras en vivo (empieza nueva palabra)
      setLiveLetters("")
    },

    onShortcut: (shortcutWord) => {
      // Gestos especiales tipo HOLA / OK / GRACIAS
      setFinalWords((prev) =>
        prev ? `${prev} ${shortcutWord}` : shortcutWord
      )

      setTranslatedText((prev) =>
        prev ? `${prev} ${shortcutWord}` : shortcutWord
      )

      setLiveLetters("")
    },
  })

  // Reproducir audio
  const handleSpeak = useCallback(() => {
    const textToSpeak = translatedText || finalWords
    if (!textToSpeak) return
    speak(textToSpeak, "es-CL")
  }, [speak, translatedText, finalWords])

  // Limpiar texto y detener reconocimiento
  const handleClear = useCallback(() => {
    stop()               // detener IA
    setLiveLetters("")   // limpiar buffer actual
    setFinalWords("")    // limpiar texto consolidado
    clearTranslation()   // limpiar global
  }, [stop, clearTranslation])

  // Encender / apagar cámara + IA
  const onToggleCamera = useCallback(async () => {
    try {
      if (isRecording) {
        // estaba encendida → apaga todo
        stop()          // detiene el loop de reconocimiento IA
        await stopCamera()
        return
      }

      // estaba apagada → enciendo
      await startCamera()

      if (videoRef.current) {
        // iniciar el loop de reconocimiento pasándole el <video>
        await start(videoRef.current)
      }

      // reiniciar buffer de letras en vivo para una nueva sesión
      setLiveLetters("")
    } catch (e) {
      console.error("Error al iniciar/detener cámara", e)
    }
  }, [isRecording, startCamera, stopCamera, videoRef, start, stop])

  // Cambiar de modo (signs-to-text / text-to-signs)
  const handleModeChange = useCallback(
    async (newMode: typeof mode) => {
      // Si salgo del modo "signs-to-text", apago cámara e IA
      if (mode === "signs-to-text") {
        stop()
        if (isRecording) {
          await stopCamera()
        }
      }
      setMode(newMode)
    },
    [mode, stop, isRecording, stopCamera, setMode]
  )

  // Lo que mostramos en el cuadro de resultado:
  // prioridad: letra en vivo > palabras consolidadas > translatedText global
  const shownText =
    liveLetters || finalWords || translatedText || ""

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Traductor de Lenguaje de Señas
          </h1>
          <p className="text-muted-foreground text-lg">
            Señas → Texto usando dactilología (alfabeto manual) + atajos
          </p>
        </div>

        {/* Cambiador de modo (signs-to-text / text-to-signs) */}
        <ModeToggle
          mode={mode}
          onChange={handleModeChange}
        />

        <div className="grid md:grid-cols-2 gap-6">
          {mode === "signs-to-text" ? (
            <CameraSection
              mode="signs-to-text"
              videoRef={videoRef}
              isRecording={isRecording}
              cameraPermission={cameraPermission}
              onToggleCamera={onToggleCamera}
            />
          ) : (
            <CameraSection
              mode="text-to-signs"
              inputText={inputText}
              onInputChange={setInputText}
              onTranslate={() => {
                const txt = inputText.trim()
                if (!txt) return
                // Por ahora solo mostramos un placeholder.
                // Aquí más adelante va el avatar/secuencia en señas.
                setTranslatedText(`Mostrando secuencia de señas para: "${txt}"`)
              }}
            />
          )}

          <ResultsSection
            mode={mode}
            text={shownText}
            onSpeak={handleSpeak}
            onClear={handleClear}
          />
        </div>

        <StatusBar isRecording={isRecording || isRunning} mode={mode} />
        <Instructions />
      </div>
    </div>
  )
}
