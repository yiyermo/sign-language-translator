"use client"

import { useCallback, useState, useRef } from "react"
import type { HandLandmarks } from "@/hooks/useFingerspelling"

type UseSignToTextOptions = {
  onWord?: (word: string) => void
  onLetter?: (ch: string) => void
  // atajos tipo gesto→palabra ("HOLA", "OK", "GRACIAS")
  onShortcut?: (word: string) => void
}

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

export function useSignToText({ onWord, onLetter, onShortcut }: UseSignToTextOptions = {}) {
  const [isRunning, setIsRunning] = useState(false)
  const handsRef = useRef<any>(null)
  const rafRef = useRef<number | null>(null)
  const runningRef = useRef(false)

  // buffer de la palabra (construido por pushLetter)
  const lastSeenRef = useRef<number>(0)
  const currentWordRef = useRef<string>("")

  // ---- Anti-spam / estabilidad para ATAJOS ----
  const STABLE_FRAMES_FOR_SHORTCUT = 5      // frames necesarios para considerar estable
  const RESET_NULL_FRAMES = 4               // frames nulos para "soltar" el gesto
  const SHORTCUT_COOLDOWN_MS = 1200         // no reemitir mismo atajo durante este período
  const WORD_COOLDOWN_MS = 800              // no reemitir misma palabra muy seguido

  const shortcutLabelRef = useRef<string | null>(null)  // label que estamos viendo
  const shortcutStableCountRef = useRef<number>(0)      // cuántos frames seguidos
  const nullFramesRef = useRef<number>(0)               // conteo de frames sin gesto
  const shortcutArmedRef = useRef<boolean>(true)        // solo emite si está "armado"
  const lastShortcutEmitAtRef = useRef<number>(0)

  const lastEmittedWordRef = useRef<string>("")
  const lastEmittedWordAtRef = useRef<number>(0)

  // ===== atajos de gestos (muy simple, ajusta a tu LSCh real) =====
  const countExtendedFingers = (lm: LM[]) => {
    const dist = (a: LM, b: LM) => Math.hypot(a.x - b.x, a.y - b.y)
    const thumb = dist(lm[4], lm[2]) > 0.1
    const idx = dist(lm[8], lm[7]) > 0.07
    const mid = dist(lm[12], lm[11]) > 0.07
    const ring = dist(lm[16], lm[15]) > 0.07
    const pky = dist(lm[20], lm[19]) > 0.07
    const extended = [thumb, idx, mid, ring, pky]
    const count = extended.filter(Boolean).length
    return { extended, count }
  }

  const classifyShortcut = (lm: LM[]): string | null => {
    const { extended, count } = countExtendedFingers(lm)
    if (count >= 4) return "HOLA"
    if (count === 0) return "OK"
    if (extended[1] && extended[2] && !extended[3] && !extended[4]) return "GRACIAS"
    return null
  }

  const ensureHands = useCallback(async () => {
    if (handsRef.current) return handsRef.current
    await loadHandsScript()
    const HandsCtor = (window as any).Hands
    if (typeof HandsCtor !== "function") throw new Error("Hands constructor not found (global)")

    const hands = new HandsCtor({
      locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
    })
    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
      modelComplexity: 1,
      selfieMode: true,
    })
    handsRef.current = hands
    return hands
  }, [])

  const handleShortcutStability = (sc: string | null, now: number) => {
    // conteo de frames nulos para "soltar" el gesto
    if (sc === null) {
      nullFramesRef.current += 1
      shortcutStableCountRef.current = 0
      // si soltamos suficiente, re-armamos la emisión
      if (nullFramesRef.current >= RESET_NULL_FRAMES) {
        shortcutArmedRef.current = true
        shortcutLabelRef.current = null
      }
      return
    }

    // hay un gesto detectado en este frame
    nullFramesRef.current = 0

    if (sc === shortcutLabelRef.current) {
      // seguimos con el mismo gesto
      shortcutStableCountRef.current += 1
    } else {
      // gesto cambió: resetear contador
      shortcutLabelRef.current = sc
      shortcutStableCountRef.current = 1
    }

    // ¿ya es estable y estamos "armados"?
    const stable = shortcutStableCountRef.current >= STABLE_FRAMES_FOR_SHORTCUT
    const cooldownOk = now - lastShortcutEmitAtRef.current >= SHORTCUT_COOLDOWN_MS

    if (stable && shortcutArmedRef.current && cooldownOk) {
      if (onShortcut) onShortcut(sc)
      lastShortcutEmitAtRef.current = now
      shortcutArmedRef.current = false // desarmar hasta que se suelte (frames nulos)
      // evitamos emitir otra vez hasta que el gesto desaparezca
    }
  }

  const runLoop = useCallback(
    async (videoEl: HTMLVideoElement) => {
      const hands = await ensureHands()

      hands.onResults((res: MPResults) => {
        const now = performance.now()
        const lms = res.multiHandLandmarks?.[0] as HandLandmarks | undefined

        if (lms && lms.length >= 21) {
          lastSeenRef.current = now

          // Atajo con estabilidad/cooldown
          handleShortcutStability(classifyShortcut(lms as LM[]), now)

          // Las letras (dactilología) se empujan desde fuera con pushLetter()
          // Aquí solo gestionamos el cierre de palabra por inactividad.
        } else {
          // Sin mano visible este frame
          nullFramesRef.current += 1
          if (nullFramesRef.current >= RESET_NULL_FRAMES) {
            shortcutArmedRef.current = true
            shortcutLabelRef.current = null
            shortcutStableCountRef.current = 0
          }
        }

        // Cierre de palabra por inactividad (1.2s sin ver mano)
        if (onWord && currentWordRef.current) {
          const idle = now - lastSeenRef.current
          if (idle > 1200) {
            const word = currentWordRef.current
            currentWordRef.current = ""

            // cooldown por palabra: no repetir "hola" 20 veces seguidas
            const sameAsLast = word === lastEmittedWordRef.current
            const sinceLast = now - lastEmittedWordAtRef.current
            if (!(sameAsLast && sinceLast < WORD_COOLDOWN_MS)) {
              onWord(word)
              lastEmittedWordRef.current = word
              lastEmittedWordAtRef.current = now
            }
          }
        }
      })

      const loop = async () => {
        if (!runningRef.current) return
        if (videoEl.readyState >= 2 && videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
          await hands.send({ image: videoEl })
        }
        rafRef.current = requestAnimationFrame(loop)
      }
      loop()
    },
    [ensureHands, onWord, onShortcut]
  )

  const start = useCallback(async (videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return
    if (runningRef.current) return
    runningRef.current = true
    setIsRunning(true)

    // reset de estados
    lastSeenRef.current = performance.now()
    currentWordRef.current = ""
    shortcutLabelRef.current = null
    shortcutStableCountRef.current = 0
    nullFramesRef.current = 0
    shortcutArmedRef.current = true

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

  // API para ir agregando letras al “word buffer”
  const pushLetter = (ch: string) => {
    currentWordRef.current += ch
    if (onLetter) onLetter(ch)
  }

  return { isRunning, start, stop, pushLetter }
}
