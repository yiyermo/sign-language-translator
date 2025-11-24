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
};

export const ProfileInfoCard: FC<ProfileInfoCardProps> = ({ profile }) => {
  const { toast } = useToast();

  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName || null,
          avatar_url: avatarUrl || null,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>
          Configura tu nombre y avatar en Manos que Hablan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            Cuenta creada el: {new Date(profile.created_at).toLocaleString()}
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
                Puedes usar esta URL como imagen de perfil en otros espacios.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
