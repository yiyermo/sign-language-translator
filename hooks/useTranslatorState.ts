"use client"

import { useState } from "react"

export type Mode = "signs-to-text" | "text-to-signs"

export function useTranslatorState() {
  const [mode, setMode] = useState<Mode>("signs-to-text")
  const [translatedText, setTranslatedText] = useState("")
  const [inputText, setInputText] = useState("")

  const simulateTranslation = () => {
    if (mode === "signs-to-text") {
      setTranslatedText("Hola, ¿cómo estás? Me alegra verte.")
    } else {
      setTranslatedText(`Mostrando secuencia de señas para: "${inputText}"`)
    }
  }

  const clearTranslation = () => {
    setTranslatedText("")
    setInputText("")
  }

  return {
    mode,
    setMode,
    translatedText,
    setTranslatedText,
    inputText,
    setInputText,
    simulateTranslation,
    clearTranslation,
  }
}
