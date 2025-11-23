"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const

type FingerspellingKeyboardProps = {
  onSelect: (letter: string) => void
  className?: string
  disabled?: boolean
}

export default function FingerspellingKeyboard({
  onSelect,
  className,
  disabled = false,
}: FingerspellingKeyboardProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-6 sm:grid-cols-8 gap-2 sm:gap-3",
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
          className={cn(
            "flex flex-col items-center justify-center gap-1 h-auto py-2 sm:py-3",
            "rounded-xl border-border bg-card hover:bg-accent/30",
            "transition-transform hover:-translate-y-0.5",
            disabled && "opacity-60 cursor-not-allowed"
          )}
          onClick={() => onSelect(letter)}
          aria-label={`Seleccionar letra ${letter}`}
          title={`Letra ${letter}`}
        >
          <span className="text-xs sm:text-sm font-semibold tracking-wide">
            {letter}
          </span>
          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <Image
              src={`/signs/letters/${letter}.png`}
              alt={`Seña de la letra ${letter}`}
              fill
              sizes="48px"
              className="rounded-md object-contain bg-muted"
            />
          </div>
        </Button>
      ))}
    </div>
  )
}
