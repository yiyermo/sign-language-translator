"use client"

import { useMemo, useState } from "react"

export type SignLetter = {
  char: string
  imageSrc: string
  index: number
  isSpace: boolean
}

// 🔠 Letras soportadas
const LETTERS = [
  "A","B","C","D","E","F","G","H","I","J",
  "K","L","M","N","Ñ","O","P","Q","R","S",
  "T","U","V","W","X","Y","Z"
] as const

// 🔢 Números soportados
const NUMBERS = ["0","1","2","3","4","5","6","7","8","9"] as const

const LETTER_SET = new Set<string>(LETTERS)
const NUMBER_SET = new Set<string>(NUMBERS)

/** Normaliza caracteres (mayúsculas, sin tildes, mantiene Ñ) */
function normalizeChar(char: string): string {
  if (!char) return ""

  const normalizedÑ = char === "ñ" ? "Ñ" : char
  const noAccents = normalizedÑ
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  return noAccents.toUpperCase()
}

export function mapTextToSignLetters(text: string): SignLetter[] {
  if (!text) return []

  const result: SignLetter[] = []

  for (let index = 0; index < text.length; index++) {
    const rawChar = text[index]

    // ␣ Espacio
    if (rawChar === " ") {
      result.push({
        index,
        char: "␣",
        imageSrc: "/signs/space.png",
        isSpace: true,
      })
      continue
    }

    const normalized = normalizeChar(rawChar)

    // 🔠 Si es letra A–Z o Ñ
    if (LETTER_SET.has(normalized)) {
      result.push({
        index,
        char: normalized,
        imageSrc: `/signs/letters/${normalized}.png`,
        isSpace: false,
      })
      continue
    }

    // 🔢 Si es número 0–9
    if (NUMBER_SET.has(normalized)) {
      result.push({
        index,
        char: normalized,
        imageSrc: `/signs/numbers/${normalized}.png`,
        isSpace: false,
      })
      continue
    }

    // 🛑 Cualquier otro carácter se ignora
  }

  return result
}

export function useTextToSigns(initialText = "") {
  const [text, setText] = useState(initialText)

  const letters = useMemo(
    () => mapTextToSignLetters(text),
    [text]
  )

  return {
    text,
    setText,
    letters,
  }
}
