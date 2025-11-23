import { useMemo, useState } from "react"

export type SignLetter = {
  /** Letra original (A–Z o Ñ) */
  char: string
  /** Ruta de la imagen en /public */
  imageSrc: string
  /** Posición de la letra dentro del texto (0, 1, 2, …) */
  index: number
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
 * Normaliza el texto:
 * - Mayúsculas
 * - Elimina tildes (á, é, í, ó, ú → a, e, i, o, u)
 * - Conserva la Ñ
 */
function normalizeInput(text: string): string {
  if (!text) return ""

  // Pasamos la ñ a mayúscula antes, para que sea consistente
  const withNormalizedÑ = text.replace(/ñ/g, "Ñ")

  // NFD separa letras y acentos. Luego quitamos marcas de acento,
  // pero la Ñ no se ve afectada porque es un carácter independiente.
  const noAccents = withNormalizedÑ
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  // Convertimos a mayúsculas
  return noAccents.toUpperCase()
}

/**
 * Convierte un texto normalizado en una lista de letras válidas (A–Z, Ñ).
 */
function textToLetterChars(text: string): LetterChar[] {
  const normalized = normalizeInput(text)
  const result: LetterChar[] = []

  for (const char of normalized) {
    if (LETTER_SET.has(char)) {
      result.push(char as LetterChar)
    }
  }

  return result
}

/**
 * Hook principal: maneja el texto de entrada y devuelve
 * la lista de letras con su imagen asociada.
 */
export function useTextToSigns(initialText = "") {
  const [text, setText] = useState(initialText)

  const letters: SignLetter[] = useMemo(() => {
    const chars = textToLetterChars(text)

    return chars.map((char, index) => ({
      char,
      imageSrc: `/signs/letters/${char}.png`,
      index,
    }))
  }, [text])

  return {
    /** Texto actual escrito por el usuario */
    text,
    /** Setter para actualizar el texto (ej. onChange de un input) */
    setText,
    /** Letras resultantes con su imagen */
    letters,
  }
}

/**
 * Versión utilitaria sin estado (por si la quieres usar fuera de React).
 */
export function mapTextToSignLetters(text: string): SignLetter[] {
  const chars = textToLetterChars(text)

  return chars.map((char, index) => ({
    char,
    imageSrc: `/signs/letters/${char}.png`,
    index,
  }))
}
