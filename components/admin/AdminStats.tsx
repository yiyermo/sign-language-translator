"use client";

import { FC } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type AdminStatsProps = {
  totalUsers: number;
  totalMinutes: number;
  activeUsersToday: number;
};

export const AdminStats: FC<AdminStatsProps> = ({
  totalUsers,
  totalMinutes,
  activeUsersToday,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Usuarios totales
          </CardTitle>
          <CardDescription>Perfiles registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Minutos totales de uso
          </CardTitle>
          <CardDescription>Tiempo de práctica acumulado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalMinutes}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Usuarios activos hoy
          </CardTitle>
          <CardDescription>Con al menos una sesión hoy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{activeUsersToday}</div>
        </CardContent>
      </Card>
    </div>
  );
};
