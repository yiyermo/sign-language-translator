"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useTranslatorState } from "@/hooks/useTranslatorState";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useUsageSession } from "@/hooks/useUsageSession";
import { useTranslationLogger } from "@/hooks/useTranslationLogger";

import ModeToggle from "@/components/translator/ModeToggle";
import ResultsSection from "@/components/translator/ResultsSection";
import StatusBar from "@/components/translator/StatusBar";
import Instructions from "@/components/translator/Instructions";
import TextToSignsSection from "@/components/translator/TextToSignsSection";
import SignsToTextSection from "@/components/translator/SignsToTextSection";
import { SaveTranslationButton } from "@/components/translator/SaveTranslationButton";

export default function HomePage() {
  const router = useRouter();

  // 🔐 Protección de la página
  const { status, userEmail, profile } = useAuthGuard();

  // Sesión de uso (pero SIN mostrar el ID en el UI)
  const { sessionId, incrementTranslations } = useUsageSession(profile?.id);

  // Estado del traductor
  const {
    mode,
    setMode,
    translatedText,
    setTranslatedText,
    inputText,
    setInputText,
    clearTranslation,
  } = useTranslatorState();

  // Logger de traducciones
  const { isSaving, logTranslation, logEvent } = useTranslationLogger({
    userId: profile?.id,
    incrementSessionTranslations: incrementTranslations,
  });

  // Cambiar modo
  const handleModeChange = useCallback(
    (newMode: typeof mode) => {
      logEvent("mode_changed", { from: mode, to: newMode });
      setMode(newMode);
    },
    [setMode, mode, logEvent]
  );

  const handleGoToProfile = useCallback(() => {
    router.push("/profile");
  }, [router]);

  const handleClear = useCallback(() => {
    setInputText("");
    setTranslatedText("");
    clearTranslation?.();
  }, [setInputText, setTranslatedText, clearTranslation]);

  const shownText = useMemo(
    () => (mode === "signs-to-text" ? translatedText || "" : inputText || ""),
    [mode, translatedText, inputText]
  );

  const handleSaveTranslation = useCallback(async () => {
    if (!shownText) return;

    if (mode === "text-to-signs") {
      await logTranslation({
        inputText: inputText || shownText,
        outputText: undefined,
        type: "text_to_sign",
      });
    } else {
      await logTranslation({
        inputText: shownText,
        outputText: translatedText || shownText,
        type: "sign_to_text",
      });
    }
  }, [mode, shownText, inputText, translatedText, logTranslation]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Verificando sesión...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || status === "forbidden") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* FONDO */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute top-32 right-0 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
      </div>

      {/* CONTENIDO */}
      <main className="max-w-6xl lg:max-w-7xl mx-auto px-4 py-8 md:py-10 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div>
              <h1
                className="
                  text-4xl md:text-5xl font-extrabold tracking-tight 
                  bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 
                  text-transparent bg-clip-text drop-shadow-sm
                "
              >
                Manos que Hablan
              </h1>
              <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-xl">
                Explora la Lengua de Señas Chilena (LSCh) a través de deletreo con
                texto e imágenes. Sin cámara. Sin complicaciones.
              </p>
            </div>

            {/* SOLO INFO DEL USUARIO */}
            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-card/80 border px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Sesión activa para {profile?.full_name ?? userEmail}
              </span>
            </div>
          </div>

          <div className="flex justify-start md:justify-end">
            <ModeToggle mode={mode} onChange={handleModeChange} />
          </div>
        </header>

        <section className="grid md:grid-cols-[1.15fr_0.95fr] gap-6 items-start">
          {/* Entrada */}
          <div className="space-y-4">
            <div className="bg-card/80 border rounded-2xl p-4 md:p-5 shadow-sm backdrop-blur-sm">
              {mode === "text-to-signs" ? (
                <TextToSignsSection
                  value={inputText}
                  onChange={(val) => {
                    setInputText(val);
                    setTranslatedText(val);
                  }}
                />
              ) : (
                <SignsToTextSection
                  value={translatedText}
                  onChange={(val) => setTranslatedText(val)}
                />
              )}
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-4">
            <div className="bg-card/80 border rounded-2xl p-4 md:p-5 shadow-sm backdrop-blur-sm overflow-hidden">
              <ResultsSection mode={mode} text={shownText} onClear={handleClear} />

              <div className="mt-3 flex justify-end">
                <SaveTranslationButton
                  disabled={!shownText}
                  loading={isSaving}
                  onClick={handleSaveTranslation}
                />
              </div>
            </div>

            <StatusBar isRecording={false} mode={mode} />
          </div>
        </section>
      </main>

      <Instructions />
    </div>
  );
}
