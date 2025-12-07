// components/admin/AdminCharts.tsx
"use client";

import { FC } from "react";
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

export type DailyTranslationsPoint = {
  date: string;           // "2025-12-07"
  total: number;
  text_to_sign: number;
  sign_to_text: number;
};

export type TranslationTypeSummary = {
  text_to_sign: number;
  sign_to_text: number;
};

type AdminChartsProps = {
  dailyTranslations: DailyTranslationsPoint[];
  typeSummary: TranslationTypeSummary;
  loading?: boolean;
};

export const AdminCharts: FC<AdminChartsProps> = ({
  dailyTranslations,
  typeSummary,
  loading,
}) => {
  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Cargando gráficos analíticos...
      </p>
    );
  }

  if (dailyTranslations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aún no hay suficientes datos de traducciones para mostrar gráficos.
      </p>
    );
  }

  const typeData = [
    {
      name: "Texto a señas",
      value: typeSummary.text_to_sign,
    },
    {
      name: "Señas a texto",
      value: typeSummary.sign_to_text,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Gráfico de línea: traducciones por día */}
      <Card>
        <CardHeader>
          <CardTitle>Traducciones por día</CardTitle>
          <CardDescription>
            Cantidad de traducciones realizadas en los últimos 7 días.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-72">
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
        </CardContent>
      </Card>

      {/* Gráfico de barras: traducciones por tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Traducciones por tipo</CardTitle>
          <CardDescription>
            Distribución de traducciones por tipo en los últimos 7 días.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" name="Traducciones" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
