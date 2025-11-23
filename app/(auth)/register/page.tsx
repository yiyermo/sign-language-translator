"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"

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

const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres.")
      .max(80, "El nombre es demasiado largo."),
    email: z
      .string()
      .min(1, "El correo es obligatorio.")
      .email("Ingresa un correo válido."),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).+$/,
        "La contraseña debe incluir al menos una letra y un número."
      ),
    confirmPassword: z.string().min(1, "Debes confirmar la contraseña."),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: "Debes aceptar la política de privacidad y términos de uso.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
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

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      })

      if (error) throw error

      const user = data.user

      if (user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: user.id,
          email: values.email,
          full_name: values.full_name,
        })

        if (profileError) {
          console.error(profileError)
        }
      }

      toast({
        title: "Cuenta creada correctamente",
        description:
          "Revisa tu correo si la verificación está habilitada en Supabase. Luego podrás iniciar sesión.",
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

  const getPasswordStrength = (password: string) => {
    if (!password) return ""
    if (password.length < 8) return "Débil"

    const hasLetters = /[A-Za-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSymbols = /[^A-Za-z0-9]/.test(password)

    if (hasLetters && hasNumbers && hasSymbols && password.length >= 12) {
      return "Muy fuerte"
    }
    if (hasLetters && hasNumbers) {
      return "Fuerte"
    }
    return "Media"
  }

  const strength = getPasswordStrength(passwordValue)

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-heading font-bold tracking-tight">
          Crear cuenta
        </h2>
        <p className="text-sm text-muted-foreground">
          Regístrate para guardar tu historial de traducciones y futuras estadísticas.
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
                  <Input
                    placeholder="Tu nombre"
                    autoComplete="name"
                    className="bg-background"
                    {...field}
                  />
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
                  <Input
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    autoComplete="email"
                    className="bg-background"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Usaremos tu correo solo para tu cuenta del traductor.
                </FormDescription>
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
                      autoComplete="new-password"
                      className="bg-background pr-8"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormDescription>
                  Mínimo 8 caracteres, con al menos una letra y un número.
                </FormDescription>
                {strength && (
                  <p className="text-xs mt-1">
                    Fortaleza:{" "}
                    <span
                      className={
                        strength === "Débil"
                          ? "text-red-500"
                          : strength === "Media"
                          ? "text-yellow-500"
                          : strength === "Fuerte"
                          ? "text-emerald-500"
                          : "text-emerald-600"
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
                      autoComplete="new-password"
                      className="bg-background pr-8"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
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

          {/* TERMS */}
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-start gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <Label className="text-sm">
                      Acepto la política de privacidad y términos de uso.
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Este proyecto es académico y se mejorará con el tiempo.
                      Tus datos se usan solo para tu cuenta.
                    </p>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* BOTÓN */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
