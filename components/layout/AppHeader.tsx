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
    <header
      className="border-b border-border bg-muted/60 backdrop-blur-sm"
      role="banner"
      aria-label={appLabel}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

        {/* Left Content */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {appLabel}
          </p>
          <p className="text-sm font-semibold">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {/* Right Content: navegación */}
        <nav
          aria-label="Navegación principal"
          className="flex items-center gap-3"
        >
          {userEmail && (
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
                onClick={onLogout}
                className="
                  flex items-center gap-1 px-3 py-1.5 rounded-md border 
                  border-red-400 bg-red-500 text-white 
                  hover:bg-red-600 shadow-sm text-xs md:text-sm 
                  transition-all active:scale-95
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400
                "
                aria-label="Cerrar sesión de la aplicación"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>Cerrar sesión</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
