"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { AuthApiError } from "@supabase/supabase-js";

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "forbidden";

type UseAuthGuardOptions = {
  requireRole?: "admin" | "user";
};

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "user" | "admin";
  avatar_url: string | null;
};

export function useAuthGuard(options?: UseAuthGuardOptions) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setStatus("loading");

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error obteniendo sesión:", error);
        }

        if (!data.session) {
          setStatus("unauthenticated");
          router.replace("/login");
          return;
        }

        const sessionUser = data.session.user;
        setUserEmail(sessionUser.email ?? null);

        // Traemos el perfil CON avatar_url
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, full_name, role, avatar_url")
          .eq("id", sessionUser.id)
          .single();

        if (profileError) {
          console.error("Error obteniendo perfil:", profileError);
          setStatus("unauthenticated");
          router.replace("/login");
          return;
        }

        const typedProfile: Profile = {
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name,
          role: profileData.role,
          avatar_url: profileData.avatar_url ?? null,
        };

        setProfile(typedProfile);

        if (options?.requireRole && typedProfile.role !== options.requireRole) {
          setStatus("forbidden");
          router.replace("/");
          return;
        }

        setStatus("authenticated");
      } catch (err) {
        console.error("Error general en useAuthGuard:", err);
        setStatus("unauthenticated");
        router.replace("/login");
      }
    };

    checkSession();
  }, [router, options?.requireRole]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });

      if (error) {
        if (
          error instanceof AuthApiError &&
          (error.status === 403 ||
            error.message?.includes("Auth session missing"))
        ) {
          console.warn(
            "signOut: sesión ya no existe en el backend, la ignoramos."
          );
        } else {
          console.error("Error en signOut:", error);
        }
      }
    } catch (err) {
      console.error("Error inesperado en signOut:", err);
    } finally {
      setStatus("unauthenticated");
      setProfile(null);
      setUserEmail(null);
      router.replace("/login");
    }
  };

  return {
    status,
    userEmail,
    profile,
    signOut,
  };
}
