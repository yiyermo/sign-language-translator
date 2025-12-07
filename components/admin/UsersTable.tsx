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
import { Badge } from "@/components/ui/badge";

export type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  created_at: string;
  isActive?: boolean; // 👈 nuevo
};

type UsersTableProps = {
  users: UserRow[];
  loading?: boolean;
};

export const UsersTable: FC<UsersTableProps> = ({ users, loading }) => {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando usuarios...</p>;
  }

  if (!loading && users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay usuarios registrados.
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead> {/* 👈 NUEVA COLUMNA */}
            <TableHead>Fecha de creación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.full_name || "—"}</TableCell>
              <TableCell>{u.email}</TableCell>

              <TableCell>
                <Badge variant={u.role === "admin" ? "default" : "outline"}>
                  {u.role ?? "user"}
                </Badge>
              </TableCell>

              <TableCell>
                {u.isActive ? (
                  <Badge className="bg-green-600 text-white">Activo</Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500 border-gray-400">
                    Inactivo
                  </Badge>
                )}
              </TableCell>

              <TableCell>{new Date(u.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
