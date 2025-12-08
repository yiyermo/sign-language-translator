"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"

import { supabase } from "@/utils/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// 🔐 Patrones débiles a evitar
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
]

// 🔐 Esquema de contraseña fuerte
const passwordSchema = z
  .string()
  .min(12, "La contraseña debe tener al menos 12 caracteres.")
  .max(128, "La contraseña es demasiado larga.")
  .regex(/[a-z]/, "Debe incluir al menos una letra minúscula.")
  .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula.")
  .regex(/\d/, "Debe incluir al menos un número.")
  .regex(/[^A-Za-z0-9]/, "Debe incluir un carácter especial.")
  .regex(/^\S+$/, "No debe contener espacios.")

const registerSchema = z
  .object({
    full_name: z.string().min(3).max(80),
    email: z.string().email("Ingresa un correo válido."),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Debes confirmar la contraseña."),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: "Debes aceptar la política de privacidad y términos.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  })
  .superRefine((data, ctx) => {
    const pass = data.password.toLowerCase()
    const name = data.full_name.toLowerCase()
    const email = data.email.toLowerCase()
    const emailLocal = email.split("@")[0] ?? ""

    if (commonWeakPatterns.some((p) => pass.includes(p))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "La contraseña es demasiado predecible.",
      })
    }

    const firstName = name.split(" ")[0] ?? ""
    if (firstName && pass.includes(firstName)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "La contraseña no debe contener tu nombre.",
      })
    }

    if (emailLocal && pass.includes(emailLocal)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "La contraseña no debe contener tu correo.",
      })
    }
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onChange",
  })

  const passwordValue = form.watch("password")

  // ✨ Contraseña fuerte
  const getPasswordStrength = (password: string) => {
    if (!password) return ""

    const lower = password.toLowerCase()
    if (commonWeakPatterns.some((pattern) => lower.includes(pattern)))
      return "Débil"

    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSymbols = /[^A-Za-z0-9]/.test(password)

    let score = 0
    if (hasLower) score++
    if (hasUpper) score++
    if (hasNumbers) score++
    if (hasSymbols) score++
    if (password.length >= 14) score++
    if (password.length >= 18) score++

    if (score >= 5 && password.length >= 18) return "Muy fuerte"
    if (score >= 4 && password.length >= 14) return "Fuerte"
    if (score >= 3 && password.length >= 12) return "Media"

    return "Débil"
  }

  const strength = getPasswordStrength(passwordValue)

  // 🚀 CORRECCIÓN: signUp con emailRedirectTo
  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
        },
      })

      if (error) throw error

      const user = data.user

      if (user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: user.id,
          email: values.email,
          full_name: values.full_name,
        })

        if (profileError) console.error(profileError)
      }

      toast({
        title: "Cuenta creada",
        description: "Revisa tu correo para confirmar tu cuenta.",
      })

      router.push("/login")
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Error al crear la cuenta",
        description: err?.message ?? "Ocurrió un error inesperado.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading font-bold">Crear cuenta</h2>
        <p className="text-sm text-muted-foreground">
          Regístrate para guardar tu historial de traducciones.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* NOMBRE */}
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="tucorreo@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PASSWORD */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute inset-y-0 right-2 flex items-center"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>

                {strength && (
                  <p className="text-xs mt-1">
                    Fortaleza:{" "}
                    <span
                      className={
                        strength === "Débil"
                          ? "text-red-500"
                          : strength === "Media"
                          ? "text-yellow-500"
                          : "text-emerald-500"
                      }
                    >
                      {strength}
                    </span>
                  </p>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          {/* CONFIRM PASSWORD */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute inset-y-0 right-2 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ACEPTAR TÉRMINOS */}
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="p-4 border rounded-lg space-y-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>

                    <p className="text-sm mt-1">
                      Acepto la{" "}
                      <Link
                        href="/privacy"
                        className="text-primary underline"
                      >
                        política de privacidad
                      </Link>{" "}
                      y los{" "}
                      <Link href="/terms" className="text-primary underline">
                        términos de uso
                      </Link>
                      .
                    </p>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
