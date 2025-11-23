"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import FingerspellingKeyboard from "@/components/translator/FingerspellingKeyboard"
import { ArrowLeft, Trash2, Space } from "lucide-react"

type SignsToTextSectionProps = {
  value: string
  onChange: (value: string) => void
}

export default function SignsToTextSection({
  value,
  onChange,
}: SignsToTextSectionProps) {
  const handleSelectLetter = (letter: string) => {
    onChange((value || "") + letter)
  }

  const handleAddSpace = () => {
    if (!value) return
    onChange(value + " ")
  }

  const handleBackspace = () => {
    if (!value) return
    onChange(value.slice(0, -1))
  }

  const handleClear = () => {
    if (!value) return
    onChange("")
  }

  const hasText = Boolean(value && value.length > 0)

  return (
    <Card className="h-full flex flex-col border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-xl">
          Señas a texto (teclado de deletreo)
        </CardTitle>
        <p className="mt-1 text-xs md:text-sm text-muted-foreground">
          Usa el teclado de letras para simular el deletreo en lengua de señas.
          El texto se irá armando abajo y puedes editarlo manualmente.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <FingerspellingKeyboard
          onSelect={handleSelectLetter}
          className="mt-1"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddSpace}
            disabled={!hasText}
            className="flex items-center gap-1"
          >
            <Space className="h-4 w-4" />
            <span>Espacio</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleBackspace}
            disabled={!hasText}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Borrar letra</span>
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleClear}
            disabled={!hasText}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Borrar todo</span>
          </Button>
        </div>


      </CardContent>
    </Card>
  )
}
