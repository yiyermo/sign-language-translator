"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, KeyRound } from "lucide-react"
import { supabase } from "@/utils/supabase"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type FieldErrors = {
  email?: string
  password?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  // Si ya está logueado, ir a "/"
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) router.replace("/")
    }
    check()
  }, [router])

  const validate = () => {
    const errors: FieldErrors = {}

    if (!email.trim()) {
      errors.email = "El correo es obligatorio."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Ingresa un correo válido."
    }

    if (!password.trim()) {
      errors.password = "La contraseña es obligatoria."
    } else if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const isValid = validate()
    if (!isValid) return

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (error) {
      setError("Correo o contraseña incorrectos. Inténtalo nuevamente.")
      return
    }

    router.replace("/")
  }

  return (
    <div className="space-y-4">
      {/* Encabezado de la vista de login */}
      <div className="space-y-1 text-center">
        <h2 className="text-lg font-semibold tracking-tight">
          Iniciar sesión
        </h2>
        <p className="text-sm text-muted-foreground">
          Ingresa tu correo y contraseña para acceder a Manos que Hablan.
        </p>
      </div>

      {/* Error general de login */}
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo correo */}
        <div className="space-y-1">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }))
              }
            }}
            required
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={
              fieldErrors.email
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }
          />
          {fieldErrors.email && (
            <p id="email-error" className="text-xs text-red-600">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Campo contraseña con ojo Ver/Ocultar */}
        <div className="space-y-1">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }))
                }
              }}
              required
              aria-invalid={!!fieldErrors.password}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              className={
                fieldErrors.password
                  ? "border-red-500 focus-visible:ring-red-500 pr-10"
                  : "pr-10"
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
            <p id="password-error" className="text-xs text-red-600">
              {fieldErrors.password}
            </p>
          )}

          {/* 👉 Botón mejorado para resetear contraseña */}
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => router.push("/auth/reset-password")}
              className="
                inline-flex items-center gap-1 rounded-full border border-indigo-200 
                bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700
                hover:bg-indigo-100 hover:border-indigo-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 
                focus-visible:ring-offset-2 focus-visible:ring-offset-background
                transition-colors
              "
            >
              <KeyRound className="h-3 w-3" />
              <span>¿Olvidaste tu contraseña?</span>
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>

      {/* Crear cuenta con efecto hover */}
      <div className="mt-4 border-t pt-4 space-y-2">
        <p className="text-center text-xs text-muted-foreground">
          ¿Aún no tienes cuenta?
        </p>

        <div className="group relative">
          <Button
            type="button"
            variant="outline"
            className="w-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md"
            onClick={() => router.push("/register")}
          >
            Crear cuenta
          </Button>

          <p className="pointer-events-none mt-1 text-[11px] text-muted-foreground text-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Crea tu cuenta para guardar tu historial de traducciones ✋🤟
          </p>
        </div>
      </div>
    </div>
  )
}
