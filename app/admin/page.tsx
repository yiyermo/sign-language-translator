"use client";

import { useEffect, useState } from "react";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { supabase } from "@/utils/supabase";

import { AppHeader } from "@/components/layout/AppHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { AdminStats } from "@/components/admin/AdminStats";
import { UsersTable, UserRow } from "@/components/admin/UsersTable";
import {
  SessionsTable,
  SessionRow,
} from "@/components/admin/SessionsTable";

type DashboardSummary = {
  totalUsers: number;
  totalMinutes: number;
  activeUsersToday: number;
};

export default function AdminDashboardPage() {
  // 🔐 Sólo admins pueden entrar
  const { status, userEmail, profile, signOut } = useAuthGuard({
    requireRole: "admin",
  });

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        // === 1. Usuarios totales ===
        const {
          count: totalUsers,
          error: usersCountError,
        } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        if (usersCountError) {
          console.error("Error contando usuarios:", usersCountError);
          throw usersCountError;
        }

        // === 2. Usuarios recientes ===
        const {
          data: usersData,
          error: usersError,
        } = await supabase
          .from("profiles")
          .select("id, email, full_name, role, created_at")
          .order("created_at", { ascending: false })
          .limit(10);

        if (usersError) {
          console.error("Error obteniendo usuarios:", usersError);
          throw usersError;
        }

        // === 3. Sesiones ===
        const {
          data: sessionsData,
          error: sessionsError,
        } = await supabase
          .from("usage_sessions")
          .select(
            "id, user_id, session_start, session_end, duration_seconds"
          )
          .order("session_start", { ascending: false })
          .limit(20);

        if (sessionsError) {
          console.error("Error obteniendo sesiones:", sessionsError);
          throw sessionsError;
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const totalSeconds = (sessionsData ?? []).reduce(
          (acc, s: any) => acc + (s.duration_seconds ?? 0),
          0
        );
        const totalMinutes = Math.round(totalSeconds / 60);

        const activeTodayUserIds = new Set<string>();
        (sessionsData ?? []).forEach((s: any) => {
          if (!s.session_start) return;
          const d = new Date(s.session_start);
          if (d >= todayStart && s.user_id) {
            activeTodayUserIds.add(s.user_id);
          }
        });

        setSummary({
          totalUsers: totalUsers ?? 0,
          totalMinutes,
          activeUsersToday: activeTodayUserIds.size,
        });

        setUsers((usersData ?? []) as UserRow[]);
        setSessions((sessionsData ?? []) as SessionRow[]);
      } catch (error: any) {
        console.error("Error cargando dashboard:", error);
        setErrorMsg("Ocurrió un error al cargar los datos del panel.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [status]);

  // Estados de auth
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Verificando permisos...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || status === "forbidden") {
    // useAuthGuard ya redirigió
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader
        appLabel="Manos que Hablan · Panel Admin"
        subtitle="Panel de administración"
        userEmail={userEmail}
        userName={profile?.full_name ?? null}
        onLogout={signOut}
        showAdminButton={false}
      />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Título principal */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Panel de administración
            </h1>
            <p className="text-sm text-muted-foreground">
              Visualiza el uso de Manos que Hablan y las sesiones de práctica.
            </p>
          </div>
        </div>

        {errorMsg && (
          <Card className="border-destructive/40 bg-destructive/10 text-destructive">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{errorMsg}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Métricas principales */}
        <AdminStats
          totalUsers={summary?.totalUsers ?? 0}
          totalMinutes={summary?.totalMinutes ?? 0}
          activeUsersToday={summary?.activeUsersToday ?? 0}
        />

        {/* Secciones en tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="sessions">Sesiones de uso</TabsTrigger>
          </TabsList>

          {/* TAB: Usuarios */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Usuarios recientes</CardTitle>
                <CardDescription>
                  Últimos usuarios registrados en Manos que Hablan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsersTable users={users} loading={loading} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: Sesiones */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Sesiones recientes</CardTitle>
                <CardDescription>
                  Sesiones de uso del traductor (últimas 20).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SessionsTable sessions={sessions} loading={loading} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
