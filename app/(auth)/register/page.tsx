"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Si ya está logueado → ir a "/"
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) router.replace("/")
    }
    check()
  }, [router])

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess("Cuenta creada correctamente. Ahora puedes iniciar sesión.")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Crear una cuenta</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="email">Correo</Label>
            <Input 
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-emerald-600 text-sm">{success}</p>}

          <Button type="submit" className="w-full">
            Registrarse
          </Button>
        </form>

        <p className="text-center text-sm mt-4">
          ¿Ya tienes cuenta?{" "}
          <button
            className="text-primary underline"
            onClick={() => router.push("/login")}
          >
            Iniciar sesión
          </button>
        </p>
      </CardContent>
    </Card>
  )
}
