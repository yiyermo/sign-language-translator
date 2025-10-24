"use client"

import { useEffect, useRef } from "react"

import { useTranslatorState } from "@/hooks/useTranslatorState"
import { useCamera } from "@/hooks/useCamera"
import { useSpeech } from "@/hooks/useSpeech"
import { useSignToText } from "@/hooks/useSignToText"
import { useFingerspelling } from "@/hooks/useFingerspelling"

import ModeToggle from "@/components/translator/ModeToggle"
import CameraSection from "@/components/translator/CameraSection"
import ResultsSection from "@/components/translator/ResultsSection"
import StatusBar from "@/components/translator/StatusBar"
import Instructions from "@/components/translator/Instructions"
import FingerspellingTrainer from "@/components/translator/FingerspellingTrainer"

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

  const { videoRef, cameraPermission, isRecording, startCamera, stopCamera } = useCamera()
  const { speak } = useSpeech()

  const {
    labels,
    addExample,
    predictStable,
    save: saveFS,
    reset: resetFS,
  } = useFingerspelling()

  const { start, stop, pushLetter } = useSignToText({
    onShortcut: (w) => {
      setTranslatedText((prev) => (prev ? `${prev} ${w}` : w))
    },
    onWord: (w) => {
      if (!w.trim()) return
      const fixed = autocorrectSpanish(w)
      setTranslatedText((prev) => (prev ? `${prev} ${fixed}` : fixed))
    },
  })

  // ---------- Estabilización adicional en UI ----------
  const lastCharAtRef = useRef<number>(0)
  const lastCharRef = useRef<string>("")
  const LETTER_COOLDOWN_MS = 220

  // Control para no mezclar recolección de ejemplos y predicción
  const isCollectingRef = useRef<boolean>(false)

  // Cola de “peticiones de recolección” atendidas en el streaming
  const onCollectRequest = useRef<string[]>([])

  // ---------- Registro estable del stream de frames ----------
  useEffect(() => {
    if (typeof window === "undefined") return

    // Registramos exactamente una función estable para el stream
    // @ts-ignore
    window.__FS_STREAM__ = {
      onFrame: (lm: any[] | null) => {
        if (!lm || lm.length < 21) return

        // 1) ¿Recolección de ejemplos solicitada?
        const req = onCollectRequest.current.shift()
        if (req) {
          isCollectingRef.current = true
          addExample(req, lm as any)
          // breve descanso para no mezclar con predicción
          setTimeout(() => { isCollectingRef.current = false }, 120)
        }

        // 2) Predicción (si no estamos recolectando)
        if (!isCollectingRef.current) {
          // Nota: si tu predictStable entrega 'confidence', la usamos; si no, se ignora.
          predictStable(lm as any, (ch: string, confidence?: number) => {
            const now = performance.now()

            if (typeof confidence === "number" && confidence < 0.8) return

            // Antirebote: evita repetir la misma letra en una ventana corta
            if (ch === lastCharRef.current && (now - lastCharAtRef.current) < LETTER_COOLDOWN_MS) {
              return
            }

            lastCharRef.current = ch
            lastCharAtRef.current = now

            pushLetter(ch)
            setTranslatedText((prev) => (prev ? `${prev}${ch}` : ch))
          })
        }
      }
    }

    // Limpieza segura al desmontar
    return () => {
      // @ts-ignore
      if (window.__FS_STREAM__) {
        // @ts-ignore
        window.__FS_STREAM__.onFrame = () => {}
      }
    }
  }, [addExample, predictStable, pushLetter, setTranslatedText])

  // ---------- Entrenamiento: recolección programada de ejemplos ----------
  const scheduleAdd = (label: string) => {
    let left = 5
    isCollectingRef.current = true
    const id = setInterval(() => {
      onCollectRequest.current.push(label)
      left--
      if (left <= 0) {
        clearInterval(id)
        // pequeño respiro para no mezclar con predicción
        setTimeout(() => { isCollectingRef.current = false }, 150)
      }
    }, 120)
  }

  // ---------- Cámara ----------
  const onToggleCamera = async () => {
    try {
      if (isRecording) {
        stop()
        await stopCamera()
        return
      }
      await startCamera()
      if (videoRef.current) {
        await start(videoRef.current)
        // reinicia estabilizadores para una nueva sesión
        lastCharRef.current = ""
        lastCharAtRef.current = 0
      }
    } catch (e) {
      console.error("Error al iniciar/detener cámara", e)
    }
  }

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

        <ModeToggle
          mode={mode}
          onChange={async (m) => {
            // Al salir de "signs-to-text", apagar captura y limpiar estabilizadores
            if (mode === "signs-to-text") {
              stop()
              if (isRecording) await stopCamera()
              lastCharRef.current = ""
              lastCharAtRef.current = 0
            }
            setMode(m)
          }}
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
                setTranslatedText(`Mostrando secuencia de señas para: "${txt}"`)
              }}
            />
          )}

          <ResultsSection
            mode={mode}
            text={translatedText}
            onSpeak={() => speak(translatedText, "es-CL")}
            onClear={() => {
              stop()
              lastCharRef.current = ""
              lastCharAtRef.current = 0
              clearTranslation()
            }}
          />
        </div>

        {mode === "signs-to-text" && (
          <FingerspellingTrainer
            onAdd={scheduleAdd}
            labels={labels}
            onSave={saveFS}
            onReset={() => {
              resetFS()
              lastCharRef.current = ""
              lastCharAtRef.current = 0
              clearTranslation()
            }}
          />
        )}

        <StatusBar isRecording={isRecording} mode={mode} />
        <Instructions />
      </div>
    </div>
  )
}

// Heurística simple para tildes comunes (muy básica)
function autocorrectSpanish(word: string) {
  // puedes enriquecer con un diccionario o LM
  return word
}
