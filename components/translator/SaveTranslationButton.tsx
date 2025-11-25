"use client"

import { FC, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Save, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type SaveTranslationButtonProps = {
  disabled?: boolean
  loading?: boolean
  onClick: () => Promise<void> | void
}

export const SaveTranslationButton: FC<SaveTranslationButtonProps> = ({
  disabled = false,
  loading = false,
  onClick,
}) => {
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (loading || disabled) return

    await onClick()

    // Mostrar notificación flotante ✨
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      {/* ========= TOAST FLOTANTE ========= */}
      {saved && (
        <div
          className={cn(
            "fixed right-5 bottom-6 z-50",
            "rounded-xl px-4 py-3 shadow-xl",
            "bg-emerald-600 text-white font-medium text-sm",
            "flex items-center gap-2",
            "animate-in fade-in slide-in-from-bottom-5 duration-300"
          )}
        >
          <CheckCircle className="h-5 w-5 text-white" />
          <span>Traducción guardada con éxito</span>
        </div>
      )}

      {/* ========= BOTÓN MEJORADO ========= */}
      <div className="flex items-center justify-end mt-3">
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={disabled || loading}
          aria-busy={loading}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2",
            "transition-all duration-200",
            "hover:shadow-md hover:-translate-y-px",
            "active:scale-[0.97]",
            loading && "cursor-wait opacity-90"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar en historial
            </>
          )}
        </Button>
      </div>
    </>
  )
}
