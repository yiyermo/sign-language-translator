"use client"

import { useEffect, useState } from "react"
import { Hand, Type, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const STORAGE_KEY = "mqh_has_seen_instructions_v2"

export default function Instructions() {
  const [open, setOpen] = useState(false)

  // Solo se muestra automáticamente la primera vez
  useEffect(() => {
    if (typeof window === "undefined") return

    const hasSeen = window.localStorage.getItem(STORAGE_KEY)
    if (!hasSeen) {
      setOpen(true)
      window.localStorage.setItem(STORAGE_KEY, "true")
    }
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 rounded-2xl border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b px-5 py-4 bg-linear-to-r from-indigo-50 to-sky-50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="text-base font-semibold">
                Bienvenido a <span className="font-bold">Manos que Hablan</span>
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Una guía rápida para entender cómo funciona el traductor. Solo la verás esta vez. ✨
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted transition"
            aria-label="Cerrar guía"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="px-5 py-4 space-y-4 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1 text-[11px]">
              <Hand className="h-3 w-3" /> Sin cámara
            </Badge>
            <Badge variant="outline" className="gap-1 text-[11px]">
              <Type className="h-3 w-3" /> Texto + teclado de manos
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Señas → Texto */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                <Hand className="h-4 w-4 text-indigo-600" />
                Señas a texto
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Arriba, elige el modo <strong>“Señas a texto”</strong>.</li>
                <li>Usa el <strong>teclado de manos</strong> para elegir cada letra.</li>
                <li>Tu palabra se va construyendo en el panel derecho.</li>
                <li>Si te equivocas, usa <strong>← borrar</strong> o <strong>Limpiar</strong>.</li>
              </ol>
            </div>

            {/* Texto → Señas */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                <Type className="h-4 w-4 text-pink-600" />
                Texto a señas
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Elige el modo <strong>“Texto a señas”</strong>.</li>
                <li>Escribe una palabra o frase breve en el cuadro de texto.</li>
                <li>
                  Debajo verás la seña de cada letra en fila. 
                  Si es muy larga, desplázate <strong>horizontalmente</strong>.
                </li>
                <li>
                  Usa <strong>Copiar texto</strong> para guardarlo o compartirlo.
                </li>
              </ol>
            </div>
          </div>

          <div className="border-t pt-3 space-y-1 text-xs text-muted-foreground">
            <p>💡 Recomendación: comienza probando con tu nombre o con un “hola”.</p>
            <p>🙌 No necesitas cámara ni micrófono: todo funciona con texto e imágenes.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t px-5 py-3 bg-muted/40">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setOpen(false)}
          >
            Cerrar
          </Button>
          <Button
            size="sm"
            className="text-xs"
            onClick={() => setOpen(false)}
          >
            Entendido, quiero probar
          </Button>
        </div>
      </div>
    </div>
  )
}
