"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Hand, RotateCcw, Type } from "lucide-react"
import type { Mode } from "@/hooks/useTranslatorState"

type Props = { mode: Mode; onChange: (m: Mode) => void }

export default function ModeToggle({ mode, onChange }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            variant={mode === "signs-to-text" ? "default" : "outline"}
            size="lg"
            onClick={() => onChange("signs-to-text")}
            className="w-full sm:w-auto min-h-[60px] text-lg"
          >
            <Hand className="mr-2 h-6 w-6" />
            Señas a Texto
          </Button>
          <div className="text-muted-foreground">
            <RotateCcw className="h-5 w-5" />
          </div>
          <Button
            variant={mode === "text-to-signs" ? "default" : "outline"}
            size="lg"
            onClick={() => onChange("text-to-signs")}
            className="w-full sm:w-auto min-h-[60px] text-lg"
          >
            <Type className="mr-2 h-6 w-6" />
            Texto a Señas
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
