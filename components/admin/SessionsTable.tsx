"use client";

import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type SessionRow = {
  id?: string;
  user_id: string | null;
  session_start: string | null;
  session_end: string | null;
  duration_seconds: number | null;
  // 👇 datos del perfil asociados por FK (profiles)
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
};

type SessionsTableProps = {
  sessions: SessionRow[];
  loading?: boolean;
};

function formatDuration(seconds: number | null) {
  if (!seconds || seconds <= 0) return "0 min";
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${rest} min`;
}

export const SessionsTable: FC<SessionsTableProps> = ({
  sessions,
  loading,
}) => {
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

  return (
    <div className="w-full overflow-x-auto">
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
          {sessions.map((s, idx) => {
            const displayName =
              s.profiles?.full_name?.trim() ||
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
  );
};
