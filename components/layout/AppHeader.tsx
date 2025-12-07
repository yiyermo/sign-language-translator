"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { LogOut, User, Shield } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

type AppHeaderProps = {
  appLabel?: string;
  title?: string;
  subtitle?: string;
  userEmail?: string | null;
  userName?: string | null;
  userAvatarUrl?: string | null;
  onLogout?: () => void | Promise<void>;

  showProfileButton?: boolean;
  onGoToProfile?: () => void;

  showAdminButton?: boolean;
  onGoToAdmin?: () => void;
};

export const AppHeader: FC<AppHeaderProps> = ({
  appLabel = "Manos que Hablan · Traductor LSCh",
  title = "Manos que Hablan",
  subtitle = "Traductor de Lengua de Señas Chilena",
  userEmail,
  userName,
  userAvatarUrl,
  onLogout,
  showProfileButton = false,
  onGoToProfile,
  showAdminButton = false,
  onGoToAdmin,
}) => {
  const [loggingOut, setLoggingOut] = useState(false);

  const initial =
    (userName?.trim().charAt(0).toUpperCase() ??
      userEmail?.trim().charAt(0).toUpperCase() ??
      "U");

  const handleLogoutClick = async () => {
    if (!onLogout || loggingOut) return;

    try {
      setLoggingOut(true);
      await onLogout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header
      className="border-b border-border bg-muted/60 backdrop-blur-sm"
      role="banner"
      aria-label={appLabel}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {/* Left Content: link al inicio */}
        <Link
          href="/"
          className="group inline-flex flex-col gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-md px-1 -mx-1"
          aria-label="Ir a la página principal de Manos que Hablan"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
            {appLabel}
          </p>
          <p className="text-sm font-semibold group-hover:text-primary transition-colors">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        </Link>

        {/* Right Content: navegación */}
        <nav
          aria-label="Navegación principal"
          className="flex items-center gap-3"
        >
          {userEmail && (
            <div className="flex items-center gap-2">
              {/* Avatar sesión */}
              <Avatar className="h-7 w-7 border border-border">
                <AvatarImage
                  src={userAvatarUrl || undefined}
                  alt={userName || userEmail || "Usuario"}
                />
                <AvatarFallback className="text-[0.7rem] font-semibold">
                  {initial}
                </AvatarFallback>
              </Avatar>

              <span
                className="text-xs md:text-sm text-muted-foreground"
                aria-label={
                  userName
                    ? `Sesión iniciada como ${userName}, correo ${userEmail}`
                    : `Sesión iniciada con el correo ${userEmail}`
                }
              >
                Sesión:{" "}
                <strong>
                  {userName ? `${userName} (${userEmail})` : userEmail}
                </strong>
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Perfil */}
            {showProfileButton && onGoToProfile && (
              <button
                onClick={onGoToProfile}
                className="
                  flex items-center gap-1 px-3 py-1.5 rounded-md border border-border 
                  bg-card hover:bg-accent hover:text-accent-foreground 
                  text-xs md:text-sm transition-all shadow-sm active:scale-95
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                "
                aria-label="Ir a mi perfil de usuario"
              >
                <User className="h-4 w-4 opacity-70" aria-hidden="true" />
                <span>Perfil</span>
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
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                "
                aria-label="Ir al panel de administración"
              >
                <Shield className="h-4 w-4 opacity-70" aria-hidden="true" />
                <span>Panel Admin</span>
              </button>
            )}

            {/* Logout */}
            {onLogout && (
              <button
                onClick={handleLogoutClick}
                className="
                  flex items-center gap-1 px-3 py-1.5 rounded-md border 
                  border-red-400 bg-red-500 text-white 
                  hover:bg-red-600 shadow-sm text-xs md:text-sm 
                  transition-all active:scale-95
                  disabled:opacity-70 disabled:cursor-not-allowed
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400
                "
                aria-label="Cerrar sesión de la aplicación"
                disabled={loggingOut}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>{loggingOut ? "Cerrando…" : "Cerrar sesión"}</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
