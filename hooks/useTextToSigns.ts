"use client"

import { useMemo, useState } from "react"

export type SignLetter = {
  /** Letra original (A–Z o Ñ) o símbolo de espacio */
  char: string
  /** Ruta de la imagen en /public */
  imageSrc: string
  /** Posición de la letra dentro del texto (0, 1, 2, …) */
  index: number
  /** Indica si este elemento representa un espacio */
  isSpace: boolean
}

/**
 * Conjunto de letras soportadas.
 * Incluimos la Ñ porque es importante en el contexto local.
 */
const LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const

type LetterChar = (typeof LETTERS)[number]

const LETTER_SET = new Set<string>(LETTERS)

/**
 * Normaliza un carácter aislado:
 * - Convierte ñ → Ñ
 * - Elimina tildes (á, é, í, ó, ú → a, e, i, o, u)
 * - Devuelve mayúsculas
 */
function normalizeChar(char: string): string {
  if (!char) return ""

  // Aseguramos que ñ pase a Ñ antes de normalizar
  const withNormalizedÑ = char === "ñ" ? "Ñ" : char

  // Quitamos marcas de acento (no afecta a Ñ)
  const noAccents = withNormalizedÑ
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  return noAccents.toUpperCase()
}

/**
 * Mapea un texto a una lista de letras con imagen, incluyendo espacios.
 */
export function mapTextToSignLetters(text: string): SignLetter[] {
  if (!text) return []

  const result: SignLetter[] = []

  for (let index = 0; index < text.length; index++) {
    const rawChar = text[index]

    // 🔹 Espacio: devolvemos un objeto especial
    if (rawChar === " ") {
      result.push({
        index,
        char: "␣",
        imageSrc: "/signs/space.png", // crea este archivo o cambia la ruta
        isSpace: true,
      })
      continue
    }

    const normalized = normalizeChar(rawChar)

    // Si no es una letra soportada (A–Z, Ñ), lo ignoramos
    if (!LETTER_SET.has(normalized)) {
      continue
    }

    result.push({
      index,
      char: normalized,
      imageSrc: `/signs/letters/${normalized}.png`,
      isSpace: false,
    })
  }

  return result
}

/**
 * Hook principal: maneja el texto de entrada y devuelve
 * la lista de letras con su imagen asociada.
 */
export function useTextToSigns(initialText = "") {
  const [text, setText] = useState(initialText)

  const letters: SignLetter[] = useMemo(
    () => mapTextToSignLetters(text),
    [text]
  )

  return {
    /** Texto actual escrito por el usuario */
    text,
    /** Setter para actualizar el texto (ej. onChange de un input) */
    setText,
    /** Letras resultantes con su imagen (incluye espacios) */
    letters,
  }
}
