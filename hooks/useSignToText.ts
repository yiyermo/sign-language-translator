"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"

type UseSignToTextOptions = {
  onWord?: (word: string) => void
  onLetter?: (ch: string) => void
}

const CLASS_NAMES = [
  "A","B","C","D","E","F","H","I","K","L",
  "M","N","O","P","Q","R","T","U","V","W","Y"
]

type LM = { x: number; y: number; z?: number }
type MPResults = {
  multiHandLandmarks?: Array<LM[]>
}

function loadHandsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("SSR"))
    if ((window as any).Hands) return resolve()
    const el = document.createElement("script")
    el.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"
    el.async = true
    el.onload = () => resolve()
    el.onerror = (e) => reject(e)
    document.body.appendChild(el)
  })
}

type RecognitionState = "IDLE" | "LOCKED"

export function useSignToText({ onWord, onLetter }: UseSignToTextOptions = {}) {
  const [isRunning, setIsRunning] = useState(false)

  const modelRef = useRef<tf.LayersModel | null>(null)
  const handsRef = useRef<any>(null)
  const rafRef = useRef<number | null>(null)
  const runningRef = useRef(false)

  const lastSeenRef = useRef<number>(0)
  const currentWordRef = useRef<string>("")

  // Palabras
  const lastEmittedWordRef = useRef<string>("")
  const lastEmittedWordAtRef = useRef<number>(0)
  const WORD_COOLDOWN_MS = 800

  // Canvas oculto
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // --- PARÁMETROS DE RECONOCIMIENTO ---
  const MIN_CONFIDENCE = 0.4           // confianza mínima para considerar una letra
  const WINDOW_SIZE = 6                // nº máx de predicciones en la ventana
  const MIN_STABLE_FRAMES = 3          // nº de apariciones de la misma letra dentro de la ventana
  const CHANGE_FRAMES = 4              // nº de frames distintos para considerar que la mano cambió de seña
  const NO_CONF_RESET_FRAMES = 5       // nº de frames sin predicción confiable para liberar la letra
  const IDLE_WORD_GAP_MS = 1200        // tiempo sin mano para cerrar palabra

  // Estado de la máquina
  const stateRef = useRef<RecognitionState>("IDLE")
  const lockedLetterRef = useRef<string | null>(null)

  // Ventana de predicciones recientes (solo letra + confianza)
  const predictionWindowRef = useRef<{ letter: string; confidence: number }[]>(
    []
  )

  // Contadores
  const diffFromLockedFramesRef = useRef<number>(0)
  const noConfFramesRef = useRef<number>(0)

  // Para evitar duplicar letras por si acaso
  const lastLetterRef = useRef<string>("")
  const lastLetterAtRef = useRef<number>(0)
  const LETTER_MIN_GAP_MS = 300

  // 1) Cargar modelo una vez
  useEffect(() => {
    let cancelled = false

    const loadModelOnce = async () => {
      try {
        console.log("[LSC] Cargando modelo /model/model.json ...")
        const loaded = await tf.loadLayersModel("/model/model.json")
        if (cancelled) return
        modelRef.current = loaded

        // Warmup
        const warm = tf.zeros([1, 128, 128, 3])
        ;(loaded.predict(warm) as tf.Tensor).dispose()
        warm.dispose()

        console.log("[LSC] Modelo cargado OK")
      } catch (err) {
        console.error("[LSC] Error cargando modelo TFJS:", err)
      }
    }

    loadModelOnce()
    return () => {
      cancelled = true
    }
  }, [])

  // 2) Predicción desde el frame actual → { letter, confidence }
  const predictFromVideoFrame = useCallback((videoEl: HTMLVideoElement) => {
    const model = modelRef.current
    if (!model) return null

    if (!canvasRef.current) {
      const c = document.createElement("canvas")
      c.width = 128
      c.height = 128
      c.style.display = "none"
      document.body.appendChild(c)
      canvasRef.current = c
    }

    const canvas = canvasRef.current
    const ctx =
      (canvas.getContext("2d", { willReadFrequently: true } as any) ||
      canvas.getContext("2d")) as CanvasRenderingContext2D | null
    if (!ctx) return null

    ctx.drawImage(videoEl, 0, 0, 128, 128)
    const imageData = ctx.getImageData(0, 0, 128, 128)

    const imgTensor = tf.browser
      .fromPixels(imageData)
      .toFloat()
      .expandDims(0)

    const pred = model.predict(imgTensor) as tf.Tensor
    const probs = pred.dataSync() as Float32Array

    let bestIdx = 0
    let bestVal = probs[0]
    for (let i = 1; i < probs.length; i++) {
      if (probs[i] > bestVal) {
        bestVal = probs[i]
        bestIdx = i
      }
    }

    imgTensor.dispose()
    pred.dispose()

    const letter = CLASS_NAMES[bestIdx] ?? null
    if (!letter) return null

    // Log de debug suelto
    if (Math.random() < 0.1) {
      console.log(
        `[LSC] pred letter=${letter} conf=${bestVal.toFixed(2)}`
      )
    }

    return { letter, confidence: bestVal }
  }, [])

  // 3) Lógica para calcular la letra estable dentro de la ventana
  const getStableLetterFromWindow = () => {
    const window = predictionWindowRef.current
    if (window.length === 0) return null

    const counts: Record<string, { count: number; sumConf: number }> = {}

    for (const { letter, confidence } of window) {
      if (!counts[letter]) {
        counts[letter] = { count: 0, sumConf: 0 }
      }
      counts[letter].count += 1
      counts[letter].sumConf += confidence
    }

    let bestLetter: string | null = null
    let bestCount = 0
    let bestAvgConf = 0

    for (const [letter, { count, sumConf }] of Object.entries(counts)) {
      const avg = sumConf / count
      if (
        count > bestCount ||
        (count === bestCount && avg > bestAvgConf)
      ) {
        bestLetter = letter
        bestCount = count
        bestAvgConf = avg
      }
    }

    if (!bestLetter) return null
    if (bestCount < MIN_STABLE_FRAMES) return null
    if (bestAvgConf < MIN_CONFIDENCE) return null

    return { letter: bestLetter, avgConfidence: bestAvgConf, count: bestCount }
  }

  // 4) Loop principal con MediaPipe
  const runLoop = useCallback(
    async (videoEl: HTMLVideoElement) => {
      const hands = await (async () => {
        if (handsRef.current) return handsRef.current

        await loadHandsScript()

        const HandsCtor = (window as any).Hands
        if (typeof HandsCtor !== "function") {
          console.error("[LSC] Hands constructor no encontrado")
          throw new Error("Hands constructor not found")
        }

        const h = new HandsCtor({
          locateFile: (f: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
        })
        h.setOptions({
          maxNumHands: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
          modelComplexity: 1,
          selfieMode: true,
        })
        handsRef.current = h
        return h
      })()

      hands.onResults((res: MPResults) => {
        const now = performance.now()
        const lms = res.multiHandLandmarks?.[0]
        const hasHand = !!(lms && lms.length >= 21)

        if (hasHand) {
          lastSeenRef.current = now
        }

        // Estado actual
        const state = stateRef.current

        // --- SI HAY MANO ---
        if (hasHand) {
          const pred = predictFromVideoFrame(videoEl)

          if (!pred || pred.confidence < MIN_CONFIDENCE) {
            // mano pero predicción poco confiable
            noConfFramesRef.current += 1

            if (state === "LOCKED" && noConfFramesRef.current >= NO_CONF_RESET_FRAMES) {
              // "soltó" la seña (no hay señal clara)
              stateRef.current = "IDLE"
              lockedLetterRef.current = null
              predictionWindowRef.current = []
              diffFromLockedFramesRef.current = 0
              noConfFramesRef.current = 0
              console.log("[LSC] Liberando letra por falta de confianza")
            }

            return
          }

          noConfFramesRef.current = 0

          const { letter, confidence } = pred

          // --- ESTADO IDLE: buscando nueva letra ---
          if (state === "IDLE") {
            // agregamos a la ventana
            predictionWindowRef.current.push({ letter, confidence })
            if (predictionWindowRef.current.length > WINDOW_SIZE) {
              predictionWindowRef.current.shift()
            }

            const stable = getStableLetterFromWindow()
            if (stable) {
              const locked = stable.letter
              const nowMs = performance.now()

              // evitar duplicar exactamente la misma letra muy seguido
              if (
                locked !== lastLetterRef.current ||
                nowMs - lastLetterAtRef.current > LETTER_MIN_GAP_MS
              ) {
                lockedLetterRef.current = locked
                stateRef.current = "LOCKED"
                predictionWindowRef.current = []

                lastLetterRef.current = locked
                lastLetterAtRef.current = nowMs

                currentWordRef.current += locked
                console.log("[LSC] Letra emitida:", locked)
                onLetter?.(locked)
              } else {
                // si cayó en la misma letra muy rápido, simplemente ignoramos
                predictionWindowRef.current = []
              }
            }
          }

          // --- ESTADO LOCKED: ya se emitió una letra, esperamos cambio ---
          else if (state === "LOCKED") {
            const locked = lockedLetterRef.current

            if (!locked) {
              // algo raro, reseteamos
              stateRef.current = "IDLE"
              predictionWindowRef.current = []
              diffFromLockedFramesRef.current = 0
              return
            }

            if (letter === locked) {
              // misma letra que la bloqueada → todo bien, no contamos cambio
              diffFromLockedFramesRef.current = 0
            } else {
              // posible nueva seña: contamos frames distintos
              diffFromLockedFramesRef.current += 1

              if (diffFromLockedFramesRef.current >= CHANGE_FRAMES) {
                // ahora liberamos para que se pueda detectar una nueva letra
                stateRef.current = "IDLE"
                lockedLetterRef.current = null
                predictionWindowRef.current = []
                diffFromLockedFramesRef.current = 0
                console.log("[LSC] Cambio de seña detectado, listo para nueva letra")
              }
            }
          }
        }

        // --- SIN MANO ---
        if (!hasHand) {
          noConfFramesRef.current += 1

          // si no hay mano por un rato, reseteamos a IDLE
          if (noConfFramesRef.current >= NO_CONF_RESET_FRAMES) {
            if (stateRef.current === "LOCKED") {
              console.log("[LSC] Mano fuera de cuadro, liberando letra")
            }
            stateRef.current = "IDLE"
            lockedLetterRef.current = null
            predictionWindowRef.current = []
            diffFromLockedFramesRef.current = 0
          }

          // detección de fin de palabra por inactividad
          if (onWord && currentWordRef.current) {
            const idle = now - lastSeenRef.current
            if (idle > IDLE_WORD_GAP_MS) {
              const word = currentWordRef.current
              currentWordRef.current = ""

              const sameAsLast = word === lastEmittedWordRef.current
              const sinceLast = now - lastEmittedWordAtRef.current
              const tooSoon = sameAsLast && sinceLast < WORD_COOLDOWN_MS

              if (!tooSoon) {
                console.log("[LSC] Palabra emitida:", word)
                onWord(word)
                lastEmittedWordRef.current = word
                lastEmittedWordAtRef.current = now
              }
            }
          }
        }
      })

      const loop = async () => {
        if (!runningRef.current) return

        if (
          videoEl.readyState >= 2 &&
          videoEl.videoWidth > 0 &&
          videoEl.videoHeight > 0
        ) {
          try {
            await hands.send({ image: videoEl })
          } catch {
            // ignorar mientras hands inicializa
          }
        }

        rafRef.current = requestAnimationFrame(loop)
      }

      loop()
    },
    [predictFromVideoFrame, onWord, onLetter]
  )

  const start = useCallback(
    async (videoEl: HTMLVideoElement | null) => {
      if (!videoEl) return
      if (runningRef.current) return

      runningRef.current = true
      setIsRunning(true)

      // reset de todos los refs
      lastSeenRef.current = performance.now()
      currentWordRef.current = ""

      lastLetterRef.current = ""
      lastLetterAtRef.current = 0

      stateRef.current = "IDLE"
      lockedLetterRef.current = null
      predictionWindowRef.current = []
      diffFromLockedFramesRef.current = 0
      noConfFramesRef.current = 0

      await runLoop(videoEl)
    },
    [runLoop]
  )

  const stop = useCallback(() => {
    if (!runningRef.current) return
    runningRef.current = false
    setIsRunning(false)

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  return { isRunning, start, stop }
}
