"use client";

import { FC, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type SessionRow = {
  id?: string;
  user_id: string | null;
  session_start: string | null;
  session_end: string | null;
  duration_seconds: number | null;
  // datos del perfil asociados por FK (profiles)
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
};

type SessionsTableProps = {
  sessions: SessionRow[];
  loading?: boolean;
  /** Filas por página (por defecto 20) */
  limit?: number;
};

type TabFilter = "all" | "today" | "7d" | "30d";

function formatDuration(seconds: number | null) {
  if (!seconds || seconds <= 0) return "0 min";
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${rest} min`;
}

function parseDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export const SessionsTable: FC<SessionsTableProps> = ({
  sessions,
  loading,
  limit = 20, // 👈 filas por página (puedes cambiar a 50 si quieres)
}) => {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [page, setPage] = useState(1);

  // Volver siempre a página 1 cuando cambian los filtros
  useEffect(() => {
    setPage(1);
  }, [activeTab, search, fromDate, toDate]);

  const { filteredSessions, totalCount } = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );

    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(todayStart.getDate() - 6);

    const thirtyDaysAgo = new Date(todayStart);
    thirtyDaysAgo.setDate(todayStart.getDate() - 29);

    const lowerBound =
      activeTab === "today"
        ? todayStart
        : activeTab === "7d"
        ? sevenDaysAgo
        : activeTab === "30d"
        ? thirtyDaysAgo
        : null;

    const upperBound = activeTab === "today" ? now : null;

    const fromFilter = fromDate ? new Date(fromDate + "T00:00:00") : null;
    const toFilter = toDate ? new Date(toDate + "T23:59:59") : null;

    const searchTerm = search.trim().toLowerCase();

    const result = sessions.filter((s) => {
      const start = parseDate(s.session_start);

      // Filtro por pestaña (rango rápido)
      if (lowerBound && (!start || start < lowerBound)) return false;
      if (upperBound && start && start > upperBound) return false;

      // Filtro por rango personalizado
      if (fromFilter && start && start < fromFilter) return false;
      if (toFilter && start && start > toFilter) return false;

      // Filtro por búsqueda
      if (searchTerm) {
        const name = s.profiles?.full_name ?? "";
        const email = s.profiles?.email ?? "";
        const id = s.user_id ?? "";
        const hayMatch =
          name.toLowerCase().includes(searchTerm) ||
          email.toLowerCase().includes(searchTerm) ||
          id.toLowerCase().includes(searchTerm);

        if (!hayMatch) return false;
      }

      return true;
    });

    return {
      filteredSessions: result,
      totalCount: result.length,
    };
  }, [sessions, activeTab, search, fromDate, toDate]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Cargando sesiones...</p>
    );
  }

  if (!loading && sessions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay sesiones registradas.
      </p>
    );
  }

  // --- Paginación ---
  const totalPages =
    totalCount === 0 ? 1 : Math.max(1, Math.ceil(totalCount / limit));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const pageSessions = filteredSessions.slice(startIndex, endIndex);

  const handlePrev = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const handleNext = () => {
    setPage((p) => Math.min(totalPages, p + 1));
  };

  return (
    <div className="space-y-4">
      {/* Barra de filtros */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        {/* Pestañas de rango rápido */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as TabFilter)}
          className="md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="today">Hoy</TabsTrigger>
            <TabsTrigger value="7d">Últimos 7 días</TabsTrigger>
            <TabsTrigger value="30d">Últimos 30 días</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filtros adicionales */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="sessions-search" className="text-xs">
              Buscar por usuario
            </Label>
            <Input
              id="sessions-search"
              placeholder="Nombre, email o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full md:w-60"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="sessions-from" className="text-xs">
                Desde
              </Label>
              <Input
                id="sessions-from"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="sessions-to" className="text-xs">
                Hasta
              </Label>
              <Input
                id="sessions-to"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <p className="text-xs text-muted-foreground">
        Mostrando{" "}
        <span className="font-semibold">
          {pageSessions.length === 0 ? 0 : startIndex + 1}-
          {startIndex + pageSessions.length}
        </span>{" "}
        de{" "}
        <span className="font-semibold">{totalCount}</span> sesiones filtradas
        ({limit} por página). Página{" "}
        <span className="font-semibold">{currentPage}</span> de{" "}
        <span className="font-semibold">{totalPages}</span>.
      </p>

      {/* Tabla */}
      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Término</TableHead>
              <TableHead>Duración</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageSessions.map((s, idx) => {
              const displayName =
                (s.profiles?.full_name || "").trim() ||
                s.profiles?.email ||
                s.user_id ||
                "—";

              return (
                <TableRow
                  key={s.id ?? `${s.user_id}-${idx}-${s.session_start}`}
                >
                  <TableCell>{displayName}</TableCell>
                  <TableCell>
                    {s.session_start
                      ? new Date(s.session_start).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {s.session_end
                      ? new Date(s.session_end).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell>{formatDuration(s.duration_seconds)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Controles de paginación */}
      <div className="flex flex-col gap-2 items-center justify-between pt-2 md:flex-row">
        <p className="text-xs text-muted-foreground">
          Página {currentPage} de {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};
