"use client"

export function useSpeech() {
  const speak = (text: string, lang = "es-ES") => {
    if (!text) return
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang
      speechSynthesis.speak(u)
    }
  }
  return { speak }
}
