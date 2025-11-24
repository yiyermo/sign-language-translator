"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase";

type UseUsageSessionResult = {
  sessionId: string | null;
  incrementTranslations: () => Promise<void>;
};

export function useUsageSession(userId: string | undefined | null): UseUsageSessionResult {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionStartRef = useRef<Date | null>(null);
  const isCreatingRef = useRef(false);

  useEffect(() => {
    if (!userId) return;

    const createSession = async () => {
      try {
        if (isCreatingRef.current || sessionId) return;
        isCreatingRef.current = true;

        const now = new Date();
        sessionStartRef.current = now;

        const { data, error } = await supabase
          .from("usage_sessions")
          .insert({
            user_id: userId,
            session_start: now.toISOString(),
            page_views: 1,
            translations_count: 0,
          })
          .select("id")
          .single();

        if (error) {
          console.error("Error creando sesión de uso:", error);
          return;
        }

        setSessionId(data.id);
      } catch (err) {
        console.error("Error general en useUsageSession:", err);
      } finally {
        isCreatingRef.current = false;
      }
    };

    createSession();

    const handleBeforeUnload = () => {
      if (!sessionId || !sessionStartRef.current) return;

      const end = new Date();
      const durationSeconds = Math.round(
        (end.getTime() - sessionStartRef.current.getTime()) / 1000
      );

      supabase
        .from("usage_sessions")
        .update({
          session_end: end.toISOString(),
          duration_seconds: durationSeconds,
        })
        .eq("id", sessionId)
        .then(
          () => {
            // noop
          },
          (e) => {
            console.error("Error actualizando sesión al cerrar:", e);
          }
        );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userId, sessionId]);

  const incrementTranslations = async () => {
    if (!sessionId) return;

    try {
      const { data, error } = await supabase
        .from("usage_sessions")
        .select("translations_count")
        .eq("id", sessionId)
        .single();

      if (error) {
        console.error("Error obteniendo translations_count:", error);
        return;
      }

      const current = data?.translations_count ?? 0;

      const { error: updateError } = await supabase
        .from("usage_sessions")
        .update({
          translations_count: current + 1,
        })
        .eq("id", sessionId);

      if (updateError) {
        console.error("Error actualizando translations_count:", updateError);
      }
    } catch (err) {
      console.error("Error incrementTranslations:", err);
    }
  };

  return {
    sessionId,
    incrementTranslations,
  };
}
