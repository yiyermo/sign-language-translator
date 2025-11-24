"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useTranslatorState } from "@/hooks/useTranslatorState"

import ModeToggle from "@/components/translator/ModeToggle"
import ResultsSection from "@/components/translator/ResultsSection"
import StatusBar from "@/components/translator/StatusBar"
import Instructions from "@/components/translator/Instructions"
import TextToSignsSection from "@/components/translator/TextToSignsSection"
import SignsToTextSection from "@/components/translator/SignsToTextSection"

import { supabase } from "@/utils/supabase"

type AuthState = "loading" | "authenticated" | "unauthenticated"

export default function SignLanguageTranslatorPage() {
  const router = useRouter()

  // HOOKS – siempre se ejecutan
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
  const [authState, setAuthState] = useState<AuthState>("loading")

  // Verificar sesión
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        setAuthState("unauthenticated")
        router.replace("/login")
        return
      }

      setAuthState("authenticated")
      setUserEmail(data.session.user.email ?? null)
    }

    checkSession()
  }, [router])

  // CLEAN UP Y OTROS HANDLERS (TODOS ESTOS VAN ARRIBA)
  const handleModeChange = useCallback(
    (newMode: typeof mode) => setMode(newMode),
    [setMode]
  )

  const handleClear = useCallback(() => {
    setInputText("")
    setTranslatedText("")
    clearTranslation?.()
  }, [setInputText, setTranslatedText, clearTranslation])

  const shownText =
    mode === "signs-to-text" ? translatedText || "" : inputText || ""

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    setAuthState("unauthenticated")
    router.replace("/login")
  }, [router])

  // NO hacemos return aquí.  
  // Solo mostramos una UI distinta según el estado.

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* === LOADING SCREEN === */}
      {authState === "loading" && (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      )}

      {/* === NO AUTENTICADO (ya está redirigiendo) === */}
      {authState === "unauthenticated" && <></>}

      {/* === AUTENTICADO: MOSTRAR EL TRADUCTOR === */}
      {authState === "authenticated" && (
        <>
          {/* HEADER */}
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

              <div className="flex items-center gap-3">
                <span className="text-xs md:text-sm">
                  Sesión: <strong>{userEmail}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs md:text-sm text-destructive hover:underline"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Traductor de Lengua de Señas (Deletreo)
                </h1>

                <p className="text-sm text-muted-foreground max-w-xl">
                  Escribe texto para verlo en el abecedario manual, o arma
                  palabras con señas usando el teclado visual.
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <ModeToggle mode={mode} onChange={handleModeChange} />
              </div>
            </header>

            <section className="grid md:grid-cols-[1.2fr_1fr] gap-6 items-start">
              <div className="space-y-4">
                <div className="bg-card border rounded-xl p-4 md:p-5">
                  {mode === "text-to-signs" ? (
                    <TextToSignsSection
                      value={inputText}
                      onChange={(val) => {
                        setInputText(val)
                        setTranslatedText(val)
                      }}
                    />
                  ) : (
                    <SignsToTextSection
                      value={translatedText}
                      onChange={(val) => setTranslatedText(val)}
                    />
                  )}
                </div>

                <div className="bg-muted/60 border rounded-xl p-4">
                  <Instructions />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-card border rounded-xl p-4 md:p-5">
                  <ResultsSection
                    mode={mode}
                    text={shownText}
                    onClear={handleClear}
                  />
                </div>

                <div className="bg-muted/60 border rounded-xl p-3">
                  <StatusBar isRecording={false} mode={mode} />
                </div>
              </div>
            </section>
          </main>
        </>
      )}
    </div>
  )
}
