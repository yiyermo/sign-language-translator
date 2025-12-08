// app/reset-password/page.tsx
"use client";

import { FormEvent, useState, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ResetPasswordRequestPage() {
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [message, setMessage] = useState<string | null>(null);
  const lastSubmitRef = useRef<number>(0);

  // ✨ Validación más estricta de email
  const validateEmail = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "El correo es obligatorio.";

    // formato correcto
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed))
      return "Ingresa un correo electrónico válido.";

    // evita correos extremadamente largos
    if (trimmed.length > 150)
      return "El correo ingresado es demasiado largo.";

    // evita espacios antes/después
    if (value !== trimmed)
      return "El correo no debe comenzar o terminar con espacios.";

    return null;
  };

  // ✨ Submit con validación + anti-spam
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setMessage(null);
    setFieldError(null);

    // anti-spam: mínimo 1.2 segundos entre envíos
    const now = Date.now();
    if (now - lastSubmitRef.current < 1200) {
      setMessage("Por favor espera un momento antes de intentar nuevamente.");
      return;
    }
    lastSubmitRef.current = now;

    // Validar email
    const error = validateEmail(email);
    if (error) {
      setFieldError(error);
      return;
    }

    setStatus("loading");

    try {
      const redirectTo = `${window.location.origin}/auth/update-password`;

      const { error: supaError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo }
      );

      if (supaError) {
        console.error(supaError);
        setStatus("error");
        setMessage(
          "No pudimos enviar el correo. Por favor intenta nuevamente."
        );
        return;
      }

      setStatus("success");
      setMessage(
        "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña."
      );
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Ocurrió un error inesperado. Intenta más tarde.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-center">
          Restablecer contraseña
        </h1>

        <p className="text-sm text-muted-foreground mb-6 text-center">
          Ingresa el correo con el que te registraste en{" "}
          <strong>Manos que Hablan</strong>.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldError) setFieldError(null);
              }}
              className={`
                w-full rounded-md border px-3 py-2 text-sm bg-background 
                outline-none focus:ring-2 
                ${
                  fieldError
                    ? "border-red-500 focus:ring-red-300"
                    : "border-input focus:ring-indigo-200 focus:border-indigo-500"
                }
              `}
              placeholder="tucorreo@ejemplo.com"
            />

            {fieldError && (
              <p className="text-xs text-red-500">{fieldError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="
              w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white
              hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors
            "
          >
            {status === "loading"
              ? "Enviando..."
              : "Enviar enlace de restablecimiento"}
          </button>
        </form>

        {/* Mensajes */}
        {message && (
          <p
            className={`mt-4 text-xs ${
              status === "error" ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            {message}
          </p>
        )}

        {/* Volver al login */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          ¿Recordaste tu contraseña?{" "}
          <a href="/login" className="underline hover:text-foreground">
            Volver a iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}
