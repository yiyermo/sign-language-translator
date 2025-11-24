"use client";

import { FC, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type UserTranslationRow = {
  id: string;
  input_text: string;
  output_text: string | null;
  translation_type: "text_to_sign" | "sign_to_text";
  created_at: string;
};

type TranslationsHistoryProps = {
  translations: UserTranslationRow[];
  loading?: boolean;
};

export const TranslationsHistory: FC<TranslationsHistoryProps> = ({
  translations,
  loading,
}) => {
  const [filter, setFilter] = useState<"all" | "text_to_sign" | "sign_to_text">(
    "all"
  );

  const filtered = useMemo(() => {
    if (filter === "all") return translations;
    return translations.filter((t) => t.translation_type === filter);
  }, [translations, filter]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de traducciones</CardTitle>
          <CardDescription>Cargando...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Historial de traducciones</CardTitle>
          <CardDescription>
            Últimas traducciones que guardaste desde el traductor.
          </CardDescription>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            Todas
          </Button>
          <Button
            type="button"
            size="sm"
            variant={filter === "text_to_sign" ? "default" : "outline"}
            onClick={() => setFilter("text_to_sign")}
          >
            Texto → Señas
          </Button>
          <Button
            type="button"
            size="sm"
            variant={filter === "sign_to_text" ? "default" : "outline"}
            onClick={() => setFilter("sign_to_text")}
          >
            Señas → Texto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no has guardado traducciones en tu historial.
          </p>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Texto</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {t.translation_type === "text_to_sign"
                          ? "Texto → Señas"
                          : "Señas → Texto"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {t.input_text}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {t.output_text ?? "—"}
                    </TableCell>
                    <TableCell>
                      {new Date(t.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
