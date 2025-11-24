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

    // Mostrar badge de éxito por 2.5 segundos
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex items-center justify-end mt-3 gap-3">

      {/* Badge de éxito */}
      {saved && (
        <span
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
            "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300",
            "animate-in fade-in slide-in-from-right duration-300"
          )}
        >
          <CheckCircle className="h-4 w-4" />
          Guardado ✔️
        </span>
      )}

      {/* Botón */}
      <Button
        type="button"
        size="sm"
        onClick={handleSave}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          "flex items-center gap-2 rounded-lg transition-all",
          "hover:-translate-y-[1px] active:scale-95",
          loading && "cursor-wait"
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
  )
}
