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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// ✔ Esquema de validación
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginValues) => {
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        let msg = error.message

        if (msg.includes("Invalid login credentials")) {
          msg = "Correo o contraseña incorrectos."
        }
        if (msg.includes("Email not confirmed")) {
          msg = "Tu correo aún no está verificado."
        }

        toast({
          title: "No se pudo iniciar sesión",
          description: msg,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Bienvenido",
        description: `Sesión iniciada como ${data.user?.email}`,
      })

      router.push("/")
    } catch (err: any) {
      toast({
        title: "Error inesperado",
        description: err?.message || "Intenta nuevamente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading font-bold tracking-tight">
          Iniciar sesión
        </h2>
        <p className="text-sm text-muted-foreground">
          Ingresa tus credenciales para continuar.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder="tucorreo@ejemplo.com"
                    autoComplete="email"
                    {...field}
                  />
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
                      autoComplete="current-password"
                      className="bg-background pr-8"
                      {...field}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
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

          {/* BOTÓN LOGIN */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Ingresando…" : "Iniciar sesión"}
          </Button>

          {/* EXTRA */}
          <div className="flex flex-col gap-2 pt-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                ¿No tienes cuenta?
              </span>
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Crear cuenta
              </Link>
            </div>

            <button
              type="button"
              className="self-end text-xs text-muted-foreground hover:text-foreground hover:underline"
              onClick={() => {
                toast({
                  title: "Recuperación de contraseña",
                  description:
                    "La opción para recuperar tu contraseña estará disponible en una próxima actualización.",
                })
              }}
            >
              Olvidé mi contraseña
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}
