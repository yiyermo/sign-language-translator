// app/(auth)/update-password/page.tsx
"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Eye, EyeOff } from "lucide-react";

type FieldErrors = {
  password?: string;
  passwordConfirm?: string;
};

// 🔐 Patrones débiles a evitar (mismos del register)
const commonWeakPatterns = [
  "password",
  "123456",
  "12345678",
  "123456789",
  "qwerty",
  "abc123",
  "hola123",
  "hola1234",
  "hola12345",
];

export default function UpdatePasswordPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<
    "checking" | "idle" | "loading" | "success" | "error"
  >("checking");
  const [message, setMessage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Datos del usuario para validar que la contraseña no contenga su nombre/correo
  const [userEmail, setUserEmail] = useState("");
  const [userFullName, setUserFullName] = useState("");

  // Verificar que haya una sesión válida desde el link
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setStatus("error");
        setMessage(
          "El enlace para restablecer tu contraseña no es válido o ha expirado. Solicita uno nuevo desde la opción '¿Olvidaste tu contraseña?'."
        );
        return;
      }

      const user = data.user;
      setUserEmail(user.email ?? "");

      // Intentar leer el nombre desde la tabla profiles (igual que en register)
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.full_name) {
          setUserFullName(profile.full_name);
        }
      } catch {
        // Si falla, no rompemos nada, solo seguimos sin full_name
      }

      setStatus("idle");
    };

    checkSession();
  }, [supabase]);

  // 🔎 Validaciones de contraseña (alineadas con el passwordSchema del register)
  const validate = () => {
    const errors: FieldErrors = {};
    const pwd = password.trim();
    const pwdConf = passwordConfirm.trim();

    // --- Validación base (igual que passwordSchema) ---
    if (!pwd) {
      errors.password = "La nueva contraseña es obligatoria.";
    } else {
      if (pwd.length < 12) {
        errors.password = "La contraseña debe tener al menos 12 caracteres.";
      } else if (pwd.length > 128) {
        errors.password = "La contraseña es demasiado larga.";
      } else {
        if (!/[a-z]/.test(pwd)) {
          errors.password = "Debe incluir al menos una letra minúscula.";
        } else if (!/[A-Z]/.test(pwd)) {
          errors.password = "Debe incluir al menos una letra mayúscula.";
        } else if (!/\d/.test(pwd)) {
          errors.password = "Debe incluir al menos un número.";
        } else if (!/[^A-Za-z0-9]/.test(pwd)) {
          errors.password = "Debe incluir un carácter especial.";
        } else if (/\s/.test(pwd)) {
          errors.password = "No debe contener espacios.";
        }
      }

      // --- Super validaciones tipo superRefine (solo si no hay error previo) ---
      const lower = pwd.toLowerCase();
      if (!errors.password) {
        if (commonWeakPatterns.some((pattern) => lower.includes(pattern))) {
          errors.password = "La contraseña es demasiado predecible.";
        }
      }

      if (!errors.password && userFullName) {
        const firstName = userFullName.toLowerCase().split(" ")[0] ?? "";
        if (firstName && lower.includes(firstName)) {
          errors.password = "La contraseña no debe contener tu nombre.";
        }
      }

      if (!errors.password && userEmail) {
        const emailLocal = userEmail.toLowerCase().split("@")[0] ?? "";
        if (emailLocal && lower.includes(emailLocal)) {
          errors.password = "La contraseña no debe contener tu correo.";
        }
      }
    }

    // Confirmación
    if (!pwdConf) {
      errors.passwordConfirm = "Debes confirmar la contraseña.";
    } else if (pwd && pwd !== pwdConf) {
      errors.passwordConfirm = "Las contraseñas no coinciden.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setFieldErrors({});

    if (!validate()) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const { error } = await supabase.auth.updateUser({
        password: password.trim(),
      });

      if (error) {
        console.error(error);
        setStatus("error");
        setMessage(
          "No se pudo actualizar la contraseña. Intenta nuevamente en unos minutos."
        );
        return;
      }

      setStatus("success");
      setMessage(
        "Contraseña actualizada correctamente. Serás redirigido al inicio de sesión."
      );

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Ocurrió un error inesperado. Intenta nuevamente.");
    }
  };

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Verificando enlace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-center">
          Crear nueva contraseña
        </h1>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Elige una nueva contraseña para tu cuenta de{" "}
          <strong>Manos que Hablan</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nueva contraseña */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={12}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                className={`
                  w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm outline-none
                  ${
                    fieldErrors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  }
                `}
                placeholder="Mínimo 12 caracteres, letras, números y símbolo"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={
                  fieldErrors.password ? "password-error" : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p
                id="password-error"
                className="text-xs text-red-500"
              >
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="space-y-2">
            <label
              htmlFor="passwordConfirm"
              className="text-sm font-medium text-foreground"
            >
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                required
                minLength={12}
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                  if (fieldErrors.passwordConfirm) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      passwordConfirm: undefined,
                    }));
                  }
                }}
                className={`
                  w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm outline-none
                  ${
                    fieldErrors.passwordConfirm
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  }
                `}
                placeholder="Repite la contraseña"
                aria-invalid={!!fieldErrors.passwordConfirm}
                aria-describedby={
                  fieldErrors.passwordConfirm
                    ? "password-confirm-error"
                    : undefined
                }
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswordConfirm((prev) => !prev)
                }
                className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                aria-label={
                  showPasswordConfirm
                    ? "Ocultar confirmación de contraseña"
                    : "Mostrar confirmación de contraseña"
                }
              >
                {showPasswordConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.passwordConfirm && (
              <p
                id="password-confirm-error"
                className="text-xs text-red-500"
              >
                {fieldErrors.passwordConfirm}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {status === "loading"
              ? "Actualizando..."
              : status === "success"
              ? "Contraseña actualizada"
              : "Actualizar contraseña"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-xs ${
              status === "error" ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ¿Ya tienes tu nueva contraseña?{" "}
          <a href="/login" className="underline hover:text-foreground">
            Ir al inicio de sesión
          </a>
        </p>
      </div>
    </div>
  );
}
