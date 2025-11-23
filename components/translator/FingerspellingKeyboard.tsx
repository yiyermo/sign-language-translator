"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

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
}

export default function FingerspellingKeyboard({
  onSelect,
}: FingerspellingKeyboardProps) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
      {LETTERS.map((letter) => (
        <Button
          key={letter}
          type="button"
          variant="outline"
          className="flex flex-col items-center gap-1 p-2 h-auto"
          onClick={() => onSelect(letter)}
        >
          <span className="text-xs font-semibold">{letter}</span>
          <Image
            src={`/signs/letters/${letter}.png`}
            alt={`Seña de la letra ${letter}`}
            width={40}
            height={40}
            className="rounded"
          />
        </Button>
      ))}
    </div>
  )
}
