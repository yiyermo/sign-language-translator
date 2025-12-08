"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/utils/supabase";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download } from "lucide-react";

type TableData = Record<string, any>[];

// 🔹 Definimos, para cada tabla, sus columnas según tu schema
const TABLE_DEFINITIONS: {
  name: string;
  columns: string[];
}[] = [
  {
    name: "profiles",
    columns: [
      "id",
      "email",
      "full_name",
      "avatar_url",
      "role",
      "created_at",
      "updated_at",
    ],
  },
  {
    name: "translations",
    columns: [
      "id",
      "user_id",
      "input_text",
      "output_text",
      "translation_type",
      "created_at",
    ],
  },
  {
    name: "usage_sessions",
    columns: [
      "id",
      "user_id",
      "session_start",
      "session_end",
      "duration_seconds",
      "page_views",
      "translations_count",
    ],
  },
  {
    name: "analytics_events",
    columns: ["id", "user_id", "event_type", "event_data", "created_at"],
  },
];

export function DatabaseExportCard() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // 1) Crear workbook vacío
      const wb = XLSX.utils.book_new();

      // 2) Recorrer todas las tablas definidas
      for (const tableDef of TABLE_DEFINITIONS) {
        const { name, columns } = tableDef;

        const { data, error } = await supabase
          .from(name)
          .select("*"); // sin límite, trae todo lo que permita RLS

        if (error) {
          console.error(`Error obteniendo tabla ${name}:`, error);
          // No tiramos todo abajo; solo marcamos error pero seguimos exportando el resto
          continue;
        }

        // Normalizamos los datos para que:
        // - Tengan todas las columnas aunque alguna venga null
        // - Si la tabla no tiene filas, igual generamos una fila "dummy" con nulls
        const rows = (data ?? []) as TableData;

        let normalized: TableData;

        if (rows.length === 0) {
          // 👈 Tabla sin datos: creamos una fila vacía con todas las columnas en null
          const emptyRow: Record<string, any> = {};
          columns.forEach((col) => {
            emptyRow[col] = null;
          });
          normalized = [emptyRow];
        } else {
          // 👈 Tabla con datos: aseguramos todas las columnas
          normalized = rows.map((row) => {
            const normalizedRow: Record<string, any> = {};
            columns.forEach((col) => {
              let value = (row as any)[col];

              // Si es analytics_events.event_data (jsonb), lo pasamos a string
              if (name === "analytics_events" && col === "event_data") {
                if (value !== null && value !== undefined) {
                  value = JSON.stringify(value);
                } else {
                  value = null;
                }
              }

              normalizedRow[col] = value ?? null;
            });
            return normalizedRow;
          });
        }

        // 3) Crear worksheet para esta tabla
        const ws = XLSX.utils.json_to_sheet(normalized, {
          header: columns, // 👈 fuerza el orden de columnas
        });

        // 4) Agregar hoja al workbook
        XLSX.utils.book_append_sheet(wb, ws, name);
      }

      // 5) Guardar el archivo
      const date = new Date().toISOString().slice(0, 10);
      const filename = `manos-que-hablan-db-${date}.xlsx`;

      XLSX.writeFile(wb, filename);
    } catch (err: any) {
      console.error("Error exportando base de datos:", err);
      setErrorMsg(
        "Ocurrió un error al exportar la base de datos. Revisa la consola para más detalles."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar base de datos</CardTitle>
        <CardDescription>
          Descarga un archivo Excel con todas las tablas principales de Manos
          que Hablan (una hoja por tabla), incluso si alguna tabla está vacía.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMsg && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          El archivo incluirá las tablas <strong>profiles</strong>,{" "}
          <strong>translations</strong>, <strong>usage_sessions</strong> y{" "}
          <strong>analytics_events</strong>. Cada tabla será una hoja separada
          en el Excel, aunque no tenga registros (en ese caso verás una fila con
          todas las columnas en <code>null</code>).
        </p>

        <Button
          type="button"
          onClick={handleExport}
          disabled={loading}
          className="inline-flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {loading ? "Generando Excel..." : "Exportar base de datos a Excel"}
        </Button>
      </CardContent>
    </Card>
  );
}
