"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type LM = { x: number; y: number; z?: number }
export type HandLandmarks = LM[] // 21 puntos

export type FSClass = string // "A", "B", ... "Ñ", etc.

type Sample = { label: FSClass; vec: number[] }

function normalizeLandmarks(lm: HandLandmarks): number[] {
  // Vectoriza 21*(x,y,z?) y normaliza por tamaño de la mano (distancia palma-index MCP)
  // Para robustez, centra en la muñeca (lm[0])
  const hasZ = typeof lm[0].z === "number"
  const base = lm[0]
  const mcpIndex = lm[5]

  const scale = Math.hypot(mcpIndex.x - base.x, mcpIndex.y - base.y) || 1
  const vec: number[] = []
  for (const p of lm) {
    vec.push((p.x - base.x) / scale)
    vec.push((p.y - base.y) / scale)
    if (hasZ) vec.push(((p.z ?? 0) - (base.z ?? 0)) / scale)
  }
  return vec
}

function distance(a: number[], b: number[]) {
  let s = 0
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i]
    s += d * d
  }
  return Math.sqrt(s)
}

export function useFingerspelling() {
  const [isReady, setIsReady] = useState(true) // no carga pesada
  const [labels, setLabels] = useState<FSClass[]>([])
  const datasetRef = useRef<Sample[]>([])
  const lastPredRef = useRef<string>("")
  const stableCountRef = useRef(0)

  // Persistencia
  const STORAGE_KEY = "fs_knn_v1"

  const save = useCallback(() => {
    try {
      const data = JSON.stringify(datasetRef.current)
      localStorage.setItem(STORAGE_KEY, data)
    } catch (e) {
      console.warn("[fs] save failed", e)
    }
  }, [])

  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const arr = JSON.parse(raw) as Sample[]
      datasetRef.current = arr
      setLabels([...new Set(arr.map((s) => s.label))].sort())
    } catch (e) {
      console.warn("[fs] load failed", e)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const reset = () => {
    datasetRef.current = []
    setLabels([])
    localStorage.removeItem(STORAGE_KEY)
  }

  // Añadir ejemplos
  const addExample = (label: FSClass, lm: HandLandmarks) => {
    const vec = normalizeLandmarks(lm)
    datasetRef.current.push({ label, vec })
    setLabels((prev) => Array.from(new Set([...prev, label])).sort())
  }

  // K-NN (k=3)
  const predict = (lm: HandLandmarks, k = 3): string | null => {
    const vec = normalizeLandmarks(lm)
    const ds = datasetRef.current
    if (ds.length === 0) return null
    const dists = ds.map((s) => ({ l: s.label, d: distance(vec, s.vec) }))
    dists.sort((a, b) => a.d - b.d)
    const top = dists.slice(0, Math.min(k, dists.length))
    // voto mayoritario
    const count: Record<string, number> = {}
    for (const t of top) count[t.l] = (count[t.l] ?? 0) + 1
    const best = Object.entries(count).sort((a, b) => b[1] - a[1])[0]
    return best?.[0] ?? null
  }

  // Estabilización de letra (evita ruido cuadro a cuadro)
  const predictStable = (lm: HandLandmarks, onLetter: (ch: string) => void, frames = 4) => {
    const p = predict(lm)
    if (!p) {
      lastPredRef.current = ""
      stableCountRef.current = 0
      return
    }
    if (p === lastPredRef.current) {
      stableCountRef.current++
    } else {
      lastPredRef.current = p
      stableCountRef.current = 1
    }
    if (stableCountRef.current >= frames) {
      onLetter(p)
      stableCountRef.current = 0
      lastPredRef.current = ""
    }
  }

  return {
    isReady,
    labels,
    addExample,
    predict,
    predictStable,
    save,
    load,
    reset,
  }
}
