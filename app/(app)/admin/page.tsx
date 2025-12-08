// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { supabase } from "@/utils/supabase";

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
import {
  AdminAnalyticsPanel,
  DailyTranslationsPoint,
  DailyUsagePoint,
  UsersAnalyticsSummary,
} from "@/components/admin/AdminAnalyticsPanel";

// ⬇️ IMPORTA EL NUEVO COMPONENTE
import { DatabaseExportCard } from "@/components/admin/DatabaseExportCard";

type DashboardSummary = {
  totalUsers: number;
  totalMinutes: number;
  activeUsersToday: number;
};

export default function AdminDashboardPage() {
  const { status, userEmail, profile, signOut } = useAuthGuard({
    requireRole: "admin",
  });

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [dailyTranslations, setDailyTranslations] = useState<
    DailyTranslationsPoint[]
  >([]);
  const [dailyUsage, setDailyUsage] = useState<DailyUsagePoint[]>([]);
  const [usersSummary, setUsersSummary] =
    useState<UsersAnalyticsSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

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

        const {
          data: sessionsData,
          error: sessionsError,
        } = await supabase
          .from("usage_sessions")
          .select(`
            id,
            user_id,
            session_start,
            session_end,
            duration_seconds,
            profiles:profiles!usage_sessions_user_id_fkey (
              full_name,
              email
            )
          `)
          .gte("session_start", sevenDaysAgo.toISOString())
          .order("session_start", { ascending: true });

        if (sessionsError) {
          console.error("Error obteniendo sesiones:", sessionsError);
          throw sessionsError;
        }

        const {
          data: translationsData,
          error: translationsError,
        } = await supabase
          .from("translations")
          .select("id, created_at, translation_type")
          .gte("created_at", sevenDaysAgo.toISOString())
          .order("created_at", { ascending: true });

        if (translationsError) {
          console.error("Error obteniendo traducciones:", translationsError);
          throw translationsError;
        }

        const totalSeconds = (sessionsData ?? []).reduce(
          (acc, s: any) => acc + (s.duration_seconds ?? 0),
          0
        );
        const totalMinutes = Math.round(totalSeconds / 60);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const activeTodayUserIds = new Set<string>();
        const activeLast7DaysUserIds = new Set<string>();

        const usageDayMap: Record<
          string,
          {
            sessions: number;
            totalSeconds: number;
            activeUsers: Set<string>;
          }
        > = {};

        (sessionsData ?? []).forEach((s: any) => {
          if (!s.session_start || !s.user_id) return;

          const start = new Date(s.session_start);
          const dayKey = start.toISOString().slice(0, 10);

          if (!usageDayMap[dayKey]) {
            usageDayMap[dayKey] = {
              sessions: 0,
              totalSeconds: 0,
              activeUsers: new Set<string>(),
            };
          }

          usageDayMap[dayKey].sessions += 1;
          usageDayMap[dayKey].totalSeconds += s.duration_seconds ?? 0;
          usageDayMap[dayKey].activeUsers.add(s.user_id);

          if (start >= todayStart) {
            activeTodayUserIds.add(s.user_id);
          }

          activeLast7DaysUserIds.add(s.user_id);
        });

        const translationsDayMap: Record<
          string,
          { total: number; text_to_sign: number; sign_to_text: number }
        > = {};

        (translationsData ?? []).forEach((t: any) => {
          const created = new Date(t.created_at);
          const dayKey = created.toISOString().slice(0, 10);

          if (!translationsDayMap[dayKey]) {
            translationsDayMap[dayKey] = {
              total: 0,
              text_to_sign: 0,
              sign_to_text: 0,
            };
          }

          translationsDayMap[dayKey].total += 1;

          if (t.translation_type === "text_to_sign") {
            translationsDayMap[dayKey].text_to_sign += 1;
          } else if (t.translation_type === "sign_to_text") {
            translationsDayMap[dayKey].sign_to_text += 1;
          }
        });

        const dailyUsageSeries: DailyUsagePoint[] = [];
        const dailyTranslationsSeries: DailyTranslationsPoint[] = [];

        for (let i = 0; i < 7; i++) {
          const d = new Date(sevenDaysAgo);
          d.setDate(sevenDaysAgo.getDate() + i);
          const key = d.toISOString().slice(0, 10);

          const usage = usageDayMap[key] ?? {
            sessions: 0,
            totalSeconds: 0,
            activeUsers: new Set<string>(),
          };
          const translations = translationsDayMap[key] ?? {
            total: 0,
            text_to_sign: 0,
            sign_to_text: 0,
          };

          const totalMinutesDay = Math.round(usage.totalSeconds / 60);
          const avgMinutes =
            usage.sessions > 0
              ? Math.round(totalMinutesDay / usage.sessions)
              : 0;

          dailyUsageSeries.push({
            date: key,
            sessions: usage.sessions,
            totalMinutes: totalMinutesDay,
            avgMinutesPerSession: avgMinutes,
            activeUsers: usage.activeUsers.size,
          });

          dailyTranslationsSeries.push({
            date: key,
            total: translations.total,
            text_to_sign: translations.text_to_sign,
            sign_to_text: translations.sign_to_text,
          });
        }

        const usersWithStatus: UserRow[] = (usersData ?? []).map((u: any) => ({
          ...u,
          isActive: activeTodayUserIds.has(u.id),
        }));

        setSummary({
          totalUsers: totalUsers ?? 0,
          totalMinutes,
          activeUsersToday: activeTodayUserIds.size,
        });

        setUsersSummary({
          totalUsers: totalUsers ?? 0,
          activeToday: activeTodayUserIds.size,
          activeLast7Days: activeLast7DaysUserIds.size,
        });

        setUsers(usersWithStatus);
        setSessions((sessionsData ?? []) as unknown as SessionRow[]);
        setDailyUsage(dailyUsageSeries);
        setDailyTranslations(dailyTranslationsSeries);
      } catch (error: any) {
        console.error("Error cargando dashboard:", error);
        setErrorMsg("Ocurrió un error al cargar los datos del panel.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Verificando permisos...</p>
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
              Panel de administración
            </h1>
            <p className="text-sm text-muted-foreground">
              Visualiza el uso de Manos que Hablan, las sesiones y las
              traducciones realizadas.
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

        <AdminStats
          totalUsers={summary?.totalUsers ?? 0}
          totalMinutes={summary?.totalMinutes ?? 0}
          activeUsersToday={summary?.activeUsersToday ?? 0}
        />

        {/* ⬇️ NUEVA CARD DE EXPORTACIÓN */}
        <DatabaseExportCard />

        <AdminAnalyticsPanel
          dailyTranslations={dailyTranslations}
          dailyUsage={dailyUsage}
          usersSummary={usersSummary}
          loading={loading}
        />

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="sessions">Sesiones de uso</TabsTrigger>
          </TabsList>

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

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Sesiones recientes</CardTitle>
                <CardDescription>
                  Sesiones de uso del traductor (últimos 7 días).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SessionsTable
                  sessions={sessions}
                  loading={loading}
                  limit={50}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
