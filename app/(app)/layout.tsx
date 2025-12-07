// app/(app)/layout.tsx
"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { AppHeader } from "@/components/layout/AppHeader";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, userEmail, profile, signOut } = useAuthGuard();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Verificando sesión...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || status === "forbidden") {
    // useAuthGuard ya redirige, solo no rendereamos nada
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Fondo decorativo sutil */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute top-32 right-0 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
      </div>

      <AppHeader
        userEmail={userEmail}
        userName={profile?.full_name ?? null}
        userAvatarUrl={profile?.avatar_url ?? null}
        onLogout={signOut}
        showProfileButton
        onGoToProfile={() => router.push("/profile")}
        showAdminButton={profile?.role === "admin"}
        onGoToAdmin={() => router.push("/admin")}
      />

      <main className="max-w-6xl lg:max-w-7xl mx-auto px-4 py-8 md:py-10 space-y-8">
        {children}
      </main>
    </div>
  );
}
