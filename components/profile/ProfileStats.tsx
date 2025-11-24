"use client";

import { FC } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type ProfileStatsProps = {
  totalTranslations: number;
  totalMinutes: number;
  totalSessions: number;
  lastActiveAt: string | null;
};

export const ProfileStats: FC<ProfileStatsProps> = ({
  totalTranslations,
  totalMinutes,
  totalSessions,
  lastActiveAt,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Traducciones guardadas
          </CardTitle>
          <CardDescription>Historial en Manos que Hablan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalTranslations}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Minutos de práctica
          </CardTitle>
          <CardDescription>Tiempo total de uso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalMinutes}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Sesiones de uso
          </CardTitle>
          <CardDescription>Ingresos al traductor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalSessions}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Última actividad:{" "}
            {lastActiveAt
              ? new Date(lastActiveAt).toLocaleString()
              : "Sin registros"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
