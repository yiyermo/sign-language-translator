"use client";

import { useEffect, useState } from "react";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { supabase } from "@/utils/supabase";

import { ProfileInfoCard, ProfileDetails } from "@/components/profile/ProfileInfoCard";
import { ProfileStats } from "@/components/profile/ProfileStats";
import {
  TranslationsHistory,
  UserTranslationRow,
} from "@/components/profile/TranslationsHistory";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ProfilePage() {
  const { status, userEmail, profile, signOut } = useAuthGuard();

  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(
    null
  );
  const [translations, setTranslations] = useState<UserTranslationRow[]>([]);
  const [totalTranslations, setTotalTranslations] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [lastActiveAt, setLastActiveAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !profile?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        // 1. Perfil completo (INCLUYE avatar_url)
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(
            "id, email, full_name, avatar_url, role, created_at, updated_at"
          )
          .eq("id", profile.id)
          .single();

        if (profileError) {
          console.error("Error obteniendo perfil:", profileError);
          throw profileError;
        }

        setProfileDetails(profileData as ProfileDetails);

        // 2. Traducciones (historial + total)
        const {
          data: translationsData,
          error: translationsError,
          count,
        } = await supabase
          .from("translations")
          .select(
            "id, input_text, output_text, translation_type, created_at",
            { count: "exact" }
          )
          .eq("user_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(30);

        if (translationsError) {
          console.error("Error obteniendo traducciones:", translationsError);
          throw translationsError;
        }

        setTranslations((translationsData ?? []) as UserTranslationRow[]);
        setTotalTranslations(count ?? translationsData?.length ?? 0);

        // 3. Sesiones de uso (usage_sessions)
        const {
          data: sessionsData,
          error: sessionsError,
        } = await supabase
          .from("usage_sessions")
          .select(
            "id, session_start, session_end, duration_seconds, translations_count"
          )
          .eq("user_id", profile.id)
          .order("session_start", { ascending: false });

        if (sessionsError) {
          console.error("Error obteniendo sesiones:", sessionsError);
          throw sessionsError;
        }

        const totalSeconds = (sessionsData ?? []).reduce(
          (acc, s: any) => acc + (s.duration_seconds ?? 0),
          0
        );
        setTotalMinutes(Math.round(totalSeconds / 60));
        setTotalSessions(sessionsData?.length ?? 0);

        if (sessionsData && sessionsData.length > 0) {
          setLastActiveAt(sessionsData[0].session_start);
        } else {
          setLastActiveAt(null);
        }
      } catch (err) {
        console.error("Error cargando datos de perfil:", err);
        setErrorMsg("Ocurrió un error al cargar tu perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, profile?.id]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">
          Verificando sesión...
        </p>
      </div>
    );
  }

  if (status === "unauthenticated" || status === "forbidden") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Mi perfil
            </h1>
            <p className="text-sm text-muted-foreground">
              Revisa tu información, tu historial y tus estadísticas de uso.
            </p>
          </div>
        </div>

        {errorMsg && (
          <Card className="border-destructive/40 bg-destructive/10 text-destructive mt-2">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{errorMsg}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {profileDetails && (
          <>
            {/* Info de perfil y stats */}
            <div className="space-y-4">
              <ProfileInfoCard
                profile={profileDetails}
                // 👇 cuando se guarde, actualizamos el estado local
                onProfileUpdated={(data) =>
                  setProfileDetails((prev) =>
                    prev ? { ...prev, ...data } : prev
                  )
                }
              />
              <ProfileStats
                totalTranslations={totalTranslations}
                totalMinutes={totalMinutes}
                totalSessions={totalSessions}
                lastActiveAt={lastActiveAt}
              />
            </div>

            {/* Historial de traducciones */}
            <TranslationsHistory
              translations={translations}
              loading={loading}
            />
          </>
        )}

        {!profileDetails && !loading && !errorMsg && (
          <p className="text-sm text-muted-foreground">
            No se encontró información de tu perfil.
          </p>
        )}
      </main>
    </div>
  );
}
