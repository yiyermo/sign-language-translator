"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"

type UseSignToTextOptions = {
  onWord?: (word: string) => void
  onLetter?: (ch: string) => void
}

// El orden TIENE que ser el mismo con el que entrenaste
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

export function useSignToText({ onWord, onLetter }: UseSignToTextOptions = {}) {
  const [isRunning, setIsRunning] = useState(false)

  // refs persistentes
  const modelRef = useRef<tf.LayersModel | null>(null)
  const handsRef = useRef<any>(null)
  const rafRef = useRef<number | null>(null)
  const runningRef = useRef(false)

  // buffer de palabra en construcción
  const lastSeenRef = useRef<number>(0)
  const currentWordRef = useRef<string>("")

  // anti-spam de letras
  const lastLetterRef = useRef<string>("")
  const lastLetterAtRef = useRef<number>(0)
  const LETTER_COOLDOWN_MS = 180

  // cooldown para no repetir la misma palabra altiro
  const lastEmittedWordRef = useRef<string>("")
  const lastEmittedWordAtRef = useRef<number>(0)
  const WORD_COOLDOWN_MS = 800

  // frames sin mano
  const nullFramesRef = useRef<number>(0)
  const RESET_NULL_FRAMES = 4

  // canvas oculto para capturar frame del video
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // cargar el modelo tfjs UNA vez
  useEffect(() => {
    let cancelled = false

    const loadModelOnce = async () => {
      try {
        console.log("[LSC] Cargando modelo /model/model.json ...")
        const loaded = await tf.loadLayersModel("/model/model.json")
        if (cancelled) return
        modelRef.current = loaded

        // warmup para quitar el lag inicial
        const warm = tf.zeros([1, 224, 224, 3])
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

  // predecir letra desde frame actual
  const predictFromVideoFrame = useCallback((videoEl: HTMLVideoElement) => {
    const model = modelRef.current
    if (!model) return null

    // crear canvas una sola vez
    if (!canvasRef.current) {
      const c = document.createElement("canvas")
      c.width = 224
      c.height = 224
      c.style.display = "none"
      document.body.appendChild(c)
      canvasRef.current = c
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    // dibujar frame escalado a 224x224
    ctx.drawImage(videoEl, 0, 0, 224, 224)

    const imageData = ctx.getImageData(0, 0, 224, 224)
    const imgTensor = tf.browser.fromPixels(imageData)
      .toFloat()
      .div(255)
      .expandDims(0) // [1,224,224,3]

    const pred = model.predict(imgTensor) as tf.Tensor
    const probs = pred.dataSync() as Float32Array

    // argmax
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
    return letter
  }, [])

  // loop principal: mediapipe -> predicción -> buffer
  const runLoop = useCallback(
    async (videoEl: HTMLVideoElement) => {
      // asegurar mediapipe Hands cargado
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

        if (lms && lms.length >= 21) {
          // mano visible
          lastSeenRef.current = now
          nullFramesRef.current = 0

          // predecir letra
          const letter = predictFromVideoFrame(videoEl)
          if (letter) {
            const lastL = lastLetterRef.current
            const lastT = lastLetterAtRef.current
            const diff = now - lastT

            if (letter !== lastL || diff > LETTER_COOLDOWN_MS) {
              lastLetterRef.current = letter
              lastLetterAtRef.current = now

              currentWordRef.current += letter
              if (onLetter) onLetter(letter)
            }
          }
        } else {
          // sin mano visible en este frame
          nullFramesRef.current += 1
        }

        // si llevo ~1.2s sin mano -> cierro palabra
        if (onWord && currentWordRef.current) {
          const idle = now - lastSeenRef.current
          if (idle > 1200) {
            const word = currentWordRef.current
            currentWordRef.current = ""

            const sameAsLast = word === lastEmittedWordRef.current
            const sinceLast = now - lastEmittedWordAtRef.current
            const tooSoon = sameAsLast && sinceLast < WORD_COOLDOWN_MS

            if (!tooSoon) {
              onWord(word)
              lastEmittedWordRef.current = word
              lastEmittedWordAtRef.current = now
            }
          }
        }

        // capea nullFramesRef.current para que no crezca infinito
        if (nullFramesRef.current > RESET_NULL_FRAMES) {
          nullFramesRef.current = RESET_NULL_FRAMES
        }
      })

      // bucle de frames
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

  // API pública del hook
  const start = useCallback(async (videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return
    if (runningRef.current) return

    runningRef.current = true
    setIsRunning(true)

    // reset buffers
    lastSeenRef.current = performance.now()
    currentWordRef.current = ""
    lastLetterRef.current = ""
    lastLetterAtRef.current = 0
    nullFramesRef.current = 0

    await runLoop(videoEl)
  }, [runLoop])

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
