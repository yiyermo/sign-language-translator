"use client";

import { FC } from "react";

type AppHeaderProps = {
  appLabel?: string;
  title?: string;
  subtitle?: string;
  userEmail?: string | null;
  userName?: string | null;
  onLogout?: () => void;

  // Perfil
  showProfileButton?: boolean;
  onGoToProfile?: () => void;

  // Admin
  showAdminButton?: boolean;
  onGoToAdmin?: () => void;
};

export const AppHeader: FC<AppHeaderProps> = ({
  appLabel = "Manos que Hablan · Traductor LSCh",
  title = "Manos que Hablan",
  subtitle = "Traductor de Lengua de Señas Chilena",
  userEmail,
  userName,
  onLogout,
  showProfileButton = false,
  onGoToProfile,
  showAdminButton = false,
  onGoToAdmin,
}) => {
  return (
    <div className="border-b border-border bg-muted/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {appLabel}
          </p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="text-xs md:text-sm">
              Sesión:{" "}
              <strong>
                {userName ? `${userName} (${userEmail})` : userEmail}
              </strong>
            </span>
          )}

          {showProfileButton && onGoToProfile && (
            <button
              onClick={onGoToProfile}
              className="text-xs md:text-sm border border-border rounded-md px-3 py-1 hover:bg-muted transition"
            >
              Perfil
            </button>
          )}

          {showAdminButton && onGoToAdmin && (
            <button
              onClick={onGoToAdmin}
              className="text-xs md:text-sm border border-border rounded-md px-3 py-1 hover:bg-muted transition"
            >
              Panel admin
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="text-xs md:text-sm text-destructive hover:underline"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
