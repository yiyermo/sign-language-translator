"use client";

import { FC, useState } from "react";
import { supabase } from "@/utils/supabase";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

export type ProfileDetails = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
};

type ProfileInfoCardProps = {
  profile: ProfileDetails;
  onProfileUpdated?: (data: Partial<ProfileDetails>) => void; // 👈 nuevo
};

export const ProfileInfoCard: FC<ProfileInfoCardProps> = ({
  profile,
  onProfileUpdated,
}) => {
  const { toast } = useToast();

  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      const newFullName = fullName || null;
      const newAvatarUrl =
        avatarUrl.trim() === "" ? null : avatarUrl.trim();

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: newFullName,
          avatar_url: newAvatarUrl,
        })
        .eq("id", profile.id);

      if (error) {
        console.error("Error actualizando perfil:", error);
        toast({
          title: "Error",
          description: "No se pudieron guardar los cambios.",
          variant: "destructive",
        });
        return;
      }

      // 👇 avisamos al padre para que actualice profileDetails (y el header)
      onProfileUpdated?.({
        full_name: newFullName,
        avatar_url: newAvatarUrl,
      });

      toast({
        title: "Perfil actualizado",
        description: "Tus datos se guardaron correctamente.",
      });
    } catch (err) {
      console.error("Error general guardando perfil:", err);
      toast({
        title: "Error",
        description: "Ocurrió un problema al guardar tu perfil.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const initial =
    fullName?.trim()?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>
          Configura tu nombre y avatar en Manos que Hablan.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 md:flex md:items-start md:gap-6">
        {/* Columna izquierda: avatar */}
        <div className="flex flex-col items-center gap-3 md:w-1/3">
          <Avatar className="h-20 w-20 border border-border">
            <AvatarImage
              src={avatarUrl.trim() === "" ? undefined : avatarUrl}
              alt={fullName || profile.email}
            />
            <AvatarFallback className="text-lg font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs text-center text-muted-foreground">
            Deja la URL vacía para eliminar tu foto de perfil.
          </p>
        </div>

        {/* Columna derecha: datos + formulario */}
        <div className="flex-1 space-y-4">
          {/* Datos base */}
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Correo: </span>
              {profile.email}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Rol:</span>
              <Badge variant={profile.role === "admin" ? "default" : "outline"}>
                {profile.role}
              </Badge>
            </p>
            <p className="text-xs text-muted-foreground">
              Cuenta creada el:{" "}
              {new Date(profile.created_at).toLocaleString("es-CL")}
            </p>
          </div>

          {/* Campos editables */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: Rayen Silva"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL (opcional)</Label>
              <Input
                id="avatar_url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
              {avatarUrl && (
                <p className="text-xs text-muted-foreground">
                  Asegúrate de que el enlace sea público y válido.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
