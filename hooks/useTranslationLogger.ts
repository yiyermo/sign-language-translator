"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";

type TranslationType = "text_to_sign" | "sign_to_text";

type UseTranslationLoggerOptions = {
  userId?: string | null;
  onTranslationSaved?: () => void;
  incrementSessionTranslations?: () => Promise<void>;
};

export function useTranslationLogger(options?: UseTranslationLoggerOptions) {
  const [isSaving, setIsSaving] = useState(false);

  const logEvent = async (eventType: string, eventData: Record<string, any> = {}) => {
    try {
      const user_id = options?.userId ?? null;
      const { error } = await supabase.from("analytics_events").insert({
        user_id,
        event_type: eventType,
        event_data: eventData,
      });

      if (error) {
        console.error("Error registrando analytics_events:", error);
      }
    } catch (err) {
      console.error("Error general en logEvent:", err);
    }
  };

  const logTranslation = async (params: {
    inputText: string;
    outputText?: string;
    type: TranslationType;
  }) => {
    const { inputText, outputText, type } = params;

    if (!inputText && !outputText) return;

    try {
      setIsSaving(true);

      const user_id = options?.userId ?? null;

      const { error } = await supabase.from("translations").insert({
        user_id,
        input_text: inputText || outputText || "",
        output_text: outputText ?? null,
        translation_type: type,
      });

      if (error) {
        console.error("Error guardando traducción:", error);
        return;
      }

      await logEvent("translation_performed", {
        type,
        length: (inputText || outputText || "").length,
      });

      if (options?.incrementSessionTranslations) {
        await options.incrementSessionTranslations();
      }

      options?.onTranslationSaved?.();
    } catch (err) {
      console.error("Error general en logTranslation:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    logTranslation,
    logEvent,
  };
}
