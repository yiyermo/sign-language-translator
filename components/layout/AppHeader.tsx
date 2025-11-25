"use client";

import { FC } from "react";
import { LogOut, User, Shield } from "lucide-react";

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
    <div className="border-b border-border bg-muted/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

        {/* Left Content */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {appLabel}
          </p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* Right Content */}
        <div className="flex items-center gap-3">

          {userEmail && (
            <span className="text-xs md:text-sm text-muted-foreground">
              Sesión:{" "}
              <strong>
                {userName ? `${userName} (${userEmail})` : userEmail}
              </strong>
            </span>
          )}

          {/* Perfil */}
          {showProfileButton && onGoToProfile && (
            <button
              onClick={onGoToProfile}
              className="
                flex items-center gap-1 px-3 py-1.5 rounded-md border border-border 
                bg-card hover:bg-accent hover:text-accent-foreground 
                text-xs md:text-sm transition-all shadow-sm active:scale-95
              "
            >
              <User className="h-4 w-4 opacity-70" />
              Perfil
            </button>
          )}

          {/* Admin */}
          {showAdminButton && onGoToAdmin && (
            <button
              onClick={onGoToAdmin}
              className="
                flex items-center gap-1 px-3 py-1.5 rounded-md border border-border 
                bg-card hover:bg-accent hover:text-accent-foreground 
                text-xs md:text-sm transition-all shadow-sm active:scale-95
              "
            >
              <Shield className="h-4 w-4 opacity-70" />
              Panel Admin
            </button>
          )}

          {/* Logout */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="
                flex items-center gap-1 px-3 py-1.5 rounded-md border 
                border-red-400 bg-red-500 text-white 
                hover:bg-red-600 shadow-sm text-xs md:text-sm 
                transition-all active:scale-95
              "
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
