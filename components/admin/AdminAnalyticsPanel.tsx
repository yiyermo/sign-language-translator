// components/admin/AdminAnalyticsPanel.tsx
"use client";

import { FC, useState, KeyboardEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { cn } from "@/lib/utils";

export type DailyTranslationsPoint = {
  date: string; // YYYY-MM-DD
  total: number;
  text_to_sign: number;
  sign_to_text: number;
};

export type DailyUsagePoint = {
  date: string; // YYYY-MM-DD
  sessions: number;
  totalMinutes: number;
  avgMinutesPerSession: number;
  activeUsers: number;
};

export type UsersAnalyticsSummary = {
  totalUsers: number;
  activeToday: number;
  activeLast7Days: number;
};

type AdminAnalyticsPanelProps = {
  dailyTranslations: DailyTranslationsPoint[];
  dailyUsage: DailyUsagePoint[];
  usersSummary: UsersAnalyticsSummary | null;
  loading?: boolean;
};

type AnalyticsView = "translations" | "users" | "usage";

export const AdminAnalyticsPanel: FC<AdminAnalyticsPanelProps> = ({
  dailyTranslations,
  dailyUsage,
  usersSummary,
  loading,
}) => {
  const [activeView, setActiveView] = useState<AnalyticsView>("translations");

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Cargando gráficos analíticos...
      </p>
    );
  }

  const hasTranslations = dailyTranslations.some((d) => d.total > 0);
  const hasUsage = dailyUsage.some((d) => d.sessions > 0);

  const totalTranslations7d = dailyTranslations.reduce(
    (acc, d) => acc + d.total,
    0
  );
  const totalMinutes7d = dailyUsage.reduce(
    (acc, d) => acc + d.totalMinutes,
    0
  );
  const avgDailyMinutes =
    dailyUsage.length > 0 ? Math.round(totalMinutes7d / dailyUsage.length) : 0;

  const handleCardActivate = (view: AnalyticsView) => {
    setActiveView(view);
  };

  const handleCardKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    view: AnalyticsView
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveView(view);
    }
  };

  // Datos derivados para cada gráfica
  const userActivitySeries = dailyUsage.map((d) => ({
    date: d.date,
    activeUsers: d.activeUsers,
  }));

  const usageTimeSeries = dailyUsage.map((d) => ({
    date: d.date,
    totalMinutes: d.totalMinutes,
    avgMinutesPerSession: d.avgMinutesPerSession,
  }));

  return (
    <section
      aria-labelledby="admin-analytics-heading"
      className="space-y-4"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2
          id="admin-analytics-heading"
          className="text-lg font-semibold tracking-tight"
        >
          Analíticas de uso
        </h2>
        <p className="text-xs text-muted-foreground">
          Selecciona una tarjeta para ver el gráfico detallado.
        </p>
      </div>

      {/* Tarjetas seleccionables */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Traducciones por día */}
        <AnalyticsCard
          title="Traducciones por día"
          description="7 días"
          value={totalTranslations7d.toString()}
          helper="Total de traducciones en los últimos 7 días."
          active={activeView === "translations"}
          onActivate={() => handleCardActivate("translations")}
          onKeyDown={(e) => handleCardKeyDown(e, "translations")}
        />

        {/* Usuarios activos */}
        <AnalyticsCard
          title="Usuarios activos"
          description="Hoy / 7 días"
          value={
            usersSummary
              ? `${usersSummary.activeToday} / ${usersSummary.activeLast7Days}`
              : "0 / 0"
          }
          helper={
            usersSummary
              ? `Total usuarios: ${usersSummary.totalUsers}`
              : undefined
          }
          active={activeView === "users"}
          onActivate={() => handleCardActivate("users")}
          onKeyDown={(e) => handleCardKeyDown(e, "users")}
        />

        {/* Tiempo de uso */}
        <AnalyticsCard
          title="Tiempo de uso"
          description="Minutos (7 días)"
          value={totalMinutes7d.toString()}
          helper={
            avgDailyMinutes > 0
              ? `Promedio diario: ${avgDailyMinutes} min`
              : undefined
          }
          active={activeView === "usage"}
          onActivate={() => handleCardActivate("usage")}
          onKeyDown={(e) => handleCardKeyDown(e, "usage")}
        />
      </div>

      {/* Panel de gráfico seleccionado */}
      <Card>
        <CardHeader>
          {activeView === "translations" && (
            <>
              <CardTitle>Traducciones por día</CardTitle>
              <CardDescription>
                Evolución de las traducciones realizadas en los últimos 7 días.
              </CardDescription>
            </>
          )}

          {activeView === "users" && (
            <>
              <CardTitle>Actividad de usuarios</CardTitle>
              <CardDescription>
                Usuarios activos por día en los últimos 7 días.
              </CardDescription>
            </>
          )}

          {activeView === "usage" && (
            <>
              <CardTitle>Tiempo de uso del traductor</CardTitle>
              <CardDescription>
                Minutos totales y promedio por sesión en los últimos 7 días.
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="h-80">
          {/* Traducciones */}
          {activeView === "translations" && (
            <>
              {!hasTranslations ? (
                <p className="text-sm text-muted-foreground">
                  Aún no hay suficientes datos de traducciones para mostrar
                  este gráfico.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyTranslations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total traducciones"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="text_to_sign"
                      name="Texto a señas"
                      stroke="#82ca9d"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="sign_to_text"
                      name="Señas a texto"
                      stroke="#ff7300"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </>
          )}

          {/* Usuarios activos */}
          {activeView === "users" && (
            <>
              {!hasUsage ? (
                <p className="text-sm text-muted-foreground">
                  Aún no hay suficientes datos de sesiones para mostrar este
                  gráfico.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userActivitySeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="activeUsers"
                      name="Usuarios activos"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </>
          )}

          {/* Tiempo de uso */}
          {activeView === "usage" && (
            <>
              {!hasUsage ? (
                <p className="text-sm text-muted-foreground">
                  Aún no hay suficientes datos de sesiones para mostrar este
                  gráfico.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageTimeSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar
                      dataKey="totalMinutes"
                      name="Minutos totales"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

type AnalyticsCardProps = {
  title: string;
  description: string;
  value: string;
  helper?: string;
  active: boolean;
  onActivate: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
};

const AnalyticsCard: FC<AnalyticsCardProps> = ({
  title,
  description,
  value,
  helper,
  active,
  onActivate,
  onKeyDown,
}) => {
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-pressed={active}
      onClick={onActivate}
      onKeyDown={onKeyDown}
      className={cn(
        "cursor-pointer transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        active
          ? "border-primary shadow-md bg-primary/5"
          : "hover:bg-muted/40 hover:shadow-sm"
      )}
    >
      <CardHeader className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {description}
          </span>
        </div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {helper && (
          <CardDescription className="text-xs">{helper}</CardDescription>
        )}
      </CardHeader>
    </Card>
  );
};
