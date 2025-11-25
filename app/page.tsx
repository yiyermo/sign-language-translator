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

import { AppHeader } from "@/components/layout/AppHeader";

export default function HomePage() {
  const router = useRouter();

  // 🔐 Protección de la página (requiere usuario autenticado)
  const { status, userEmail, profile, signOut } = useAuthGuard();

  // Sesión de uso (usage_sessions)
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

  // Logger de traducciones + analytics
  const { isSaving, logTranslation, logEvent } = useTranslationLogger({
    userId: profile?.id,
    incrementSessionTranslations: incrementTranslations,
  });

  // Cambiar modo
  const handleModeChange = useCallback(
    (newMode: typeof mode) => {
      // registrar evento de cambio de modo
      logEvent("mode_changed", {
        from: mode,
        to: newMode,
      });
      setMode(newMode);
    },
    [setMode, mode, logEvent]
  );
  const handleGoToProfile = useCallback(() => {
  router.push("/profile");
}, [router]);
  // Limpiar texto
  const handleClear = useCallback(() => {
    setInputText("");
    setTranslatedText("");
    clearTranslation?.();
  }, [setInputText, setTranslatedText, clearTranslation]);

  // Texto mostrado en ResultsSection
  const shownText = useMemo(
    () => (mode === "signs-to-text" ? translatedText || "" : inputText || ""),
    [mode, translatedText, inputText]
  );

  // Guardar en historial
  const handleSaveTranslation = useCallback(async () => {
    if (!shownText) return;

    if (mode === "text-to-signs") {
      await logTranslation({
        inputText: inputText || shownText,
        outputText: undefined, // las señas son visuales, guardamos solo el texto de entrada
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

  // Ir al panel admin
  const handleGoToAdmin = useCallback(() => {
    router.push("/admin");
  }, [router]);

  // Estados de carga / sin auth
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Verificando sesión...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || status === "forbidden") {
    // Ya se redirigió en el hook
    return null;
  }

  // ✅ Usuario autenticado
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER GENERAL */}
      <AppHeader
        appLabel="Manos que Hablan · Traductor LSCh"
        subtitle="Traductor de Lengua de Señas Chilena"
        userEmail={userEmail}
        userName={profile?.full_name ?? null}
        onLogout={signOut}
        showProfileButton={true}
        onGoToProfile={handleGoToProfile}
        showAdminButton={profile?.role === "admin"}
        onGoToAdmin={handleGoToAdmin}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Encabezado de la página */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-4">
        {/* IZQUIERDA — TÍTULO + SUBTÍTULO DECORATIVO */}
        <div className="space-y-2">
          <h1 className="
            text-4xl md:text-5xl font-extrabold tracking-tight 
            bg-linear-to-r from-indigo-600 to-pink-600 
            text-transparent bg-clip-text
            drop-shadow-sm
          ">
            Manos que Hablan
          </h1>

          <p className="
            text-xs md:text-sm text-muted-foreground uppercase tracking-[0.15em]
            bg-muted/30 inline-block px-3 py-1 rounded-full border border-border
          ">
            Lengua de Señas Chilena · LSCh
          </p>
        </div>

        {/* DERECHA — TOGGLE DE MODO (lo que ya tienes) */}
        <div className="flex justify-end">
          <ModeToggle mode={mode} onChange={handleModeChange} />
        </div>
      </header>


        {/* Layout principal: entrada / salida */}
        <section className="grid md:grid-cols-[1.2fr_1fr] gap-6 items-start">
          {/* Columna izquierda: entrada + instrucciones */}
          <div className="space-y-4">
            <div className="bg-card border rounded-xl p-4 md:p-5">
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

            <div className="bg-muted/60 border rounded-xl p-4">
              <Instructions />
            </div>
          </div>

          {/* Columna derecha: resultados + barra de estado + guardar */}
          <div className="space-y-4">
            <div className="bg-card border rounded-xl p-4 md:p-5 overflow-hidden">
              <ResultsSection
                mode={mode}
                text={shownText}
                onClear={handleClear}
              />

              <SaveTranslationButton
                disabled={!shownText}
                loading={isSaving}
                onClick={handleSaveTranslation}
              />
            </div>

            <div className="bg-muted/60 border rounded-xl p-3">
              <StatusBar isRecording={false} mode={mode} />
              {sessionId && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Sesión de uso activa · ID: {sessionId.slice(0, 8)}…
                </p>
              )}
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
