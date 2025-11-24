"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "forbidden";

type UseAuthGuardOptions = {
  requireRole?: "admin" | "user";
};

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "user" | "admin";
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

        // Traemos el perfil para saber el rol
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, full_name, role")
          .eq("id", sessionUser.id)
          .single();

        if (profileError) {
          console.error("Error obteniendo perfil:", profileError);
          // si falla el perfil, igual mejor sacar al usuario a login
          setStatus("unauthenticated");
          router.replace("/login");
          return;
        }

        const typedProfile: Profile = {
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name,
          role: profileData.role,
        };

        setProfile(typedProfile);

        // Si se requiere rol específico (ej: admin)
        if (options?.requireRole && typedProfile.role !== options.requireRole) {
          setStatus("forbidden");
          // puedes mandarlo al home público o lo que quieras
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
    await supabase.auth.signOut();
    setStatus("unauthenticated");
    setProfile(null);
    setUserEmail(null);
    router.replace("/login");
  };

  return {
    status,
    userEmail,
    profile,
    signOut,
  };
}
