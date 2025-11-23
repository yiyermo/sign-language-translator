"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"

import { useTranslatorState } from "@/hooks/useTranslatorState"

import ModeToggle from "@/components/translator/ModeToggle"
import ResultsSection from "@/components/translator/ResultsSection"
import StatusBar from "@/components/translator/StatusBar"
import Instructions from "@/components/translator/Instructions"
import TextToSignsSection from "@/components/translator/TextToSignsSection"
import SignsToTextSection from "@/components/translator/SignsToTextSection"

import { supabase } from "@/utils/supabase"

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

  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser()
      setUserEmail(data.user?.email ?? null)
    }
    getSession()
  }, [])

  // Cambiar modo
  const handleModeChange = useCallback(
    (newMode: typeof mode) => {
      setMode(newMode)
    },
    [setMode]
  )

  // Limpiar textos + estado del hook
  const handleClear = useCallback(() => {
    setInputText("")
    setTranslatedText("")
    if (clearTranslation) {
      clearTranslation()
    }
  }, [setInputText, setTranslatedText, clearTranslation])

  // Qué texto se muestra en el panel derecho
  const shownText =
    mode === "signs-to-text"
      ? translatedText || ""
      : inputText || ""

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Cinta superior clara */}
      <div className="border-b border-border bg-muted/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Yiyermo · Sign Language Translator
            </p>
            <p className="text-sm text-muted-foreground">
              Traductor de deletreo en Lengua de Señas Chilena
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            {userEmail ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  setUserEmail(null)
                }}
                className="text-xs md:text-sm text-destructive hover:underline"
              >
                Cerrar sesión
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs md:text-sm px-3 py-1 rounded-full border border-border bg-card hover:bg-accent/40 text-foreground transition"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="text-xs md:text-sm px-3 py-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header principal */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
              Traductor de Lengua de Señas (Deletreo)
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              Escribe texto para verlo letra por letra en el abecedario manual, o arma
              palabras seleccionando señas. Sin cámara, pensado para práctica y apoyo
              educativo.
            </p>

            <p className="text-xs md:text-sm text-muted-foreground">
              {userEmail ? (
                <>
                  Sesión iniciada como{" "}
                  <span className="font-semibold">{userEmail}</span>.
                  {" "}Próximamente: historial, estadísticas y progreso.
                </>
              ) : (
                <>
                  Estás en modo invitado.{" "}
                  <span className="italic">
                    Crea una cuenta para guardar tus traducciones y ver tu progreso ✨
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <ModeToggle mode={mode} onChange={handleModeChange} />
            <span className="text-xs text-muted-foreground">
              Modo actual:{" "}
              <span className="font-medium">
                {mode === "text-to-signs"
                  ? "Texto → Señas"
                  : "Señas → Texto"}
              </span>
            </span>
          </div>
        </header>

        {/* Panel principal */}
        <section className="grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6 items-start">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl shadow-sm p-4 md:p-5">
              {mode === "text-to-signs" ? (
                <TextToSignsSection
                  value={inputText}
                  onChange={(value) => {
                    setInputText(value)
                    setTranslatedText(value)
                  }}
                />
              ) : (
                <SignsToTextSection
                  value={translatedText}
                  onChange={(value) => {
                    setTranslatedText(value)
                  }}
                />
              )}
            </div>

            <div className="bg-muted/60 border border-border rounded-xl p-4">
              <Instructions />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl shadow-sm p-4 md:p-5">
              <ResultsSection
                mode={mode}
                text={shownText}
                onClear={handleClear}
              />
            </div>

            <div className="bg-muted/60 border border-border rounded-xl p-3">
              <StatusBar isRecording={false} mode={mode} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
