"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { memo } from "react"

const LETTERS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
  "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S",
  "T", "U", "V", "W", "X", "Y", "Z",
] as const

type FingerspellingKeyboardProps = {
  onSelect: (letter: string) => void
  className?: string
  disabled?: boolean
}

function FingerspellingKeyboardComponent({
  onSelect,
  className,
  disabled = false,
}: FingerspellingKeyboardProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-5 sm:grid-cols-7 md:grid-cols-8 gap-3 p-2",
        className
      )}
      aria-label="Teclado de deletreo en lengua de señas"
    >
      {LETTERS.map((letter) => (
        <Button
          key={letter}
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => onSelect(letter)}
          aria-label={`Seleccionar letra ${letter}`}
          title={`Letra ${letter}`}
          className={cn(
            "group flex flex-col items-center justify-center gap-2 h-auto py-3 px-2",
            "rounded-2xl border border-border bg-gradient-to-b from-card/80 to-card",
            "shadow-sm hover:shadow-md dark:shadow-none hover:from-accent/20 hover:to-accent/5",
            "transition-all duration-200 hover:-translate-y-1 active:scale-95",
            "focus-visible:ring-2 focus-visible:ring-primary",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {/* Letra */}
          <span className="text-sm font-bold tracking-wide text-foreground group-hover:text-primary transition-colors">
            {letter}
          </span>

          {/* Imagen */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-muted/60 border border-border">
            <Image
              src={`/signs/letters/${letter}.png`}
              alt={`Seña de la letra ${letter}`}
              fill
              sizes="56px"
              className="object-contain p-1 transition-transform group-hover:scale-105"
            />
          </div>
        </Button>
      ))}
    </div>
  )
}

const FingerspellingKeyboard = memo(FingerspellingKeyboardComponent)
export default FingerspellingKeyboard
