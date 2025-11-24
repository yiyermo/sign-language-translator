"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import FingerspellingKeyboard from "@/components/translator/FingerspellingKeyboard"

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
    onChange("")
  }

  return (
    <Card className="h-full flex flex-col md:min-h-[420px]">
      <CardHeader>
        <CardTitle className="text-xl">
          Señas a texto (deletreo con teclado visual)
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <p className="text-sm text-muted-foreground">
          Haz clic en las letras del teclado para formar palabras.  
          El texto aparece abajo.
        </p>

        {/* Teclado con scroll horizontal */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-2">
            <FingerspellingKeyboard onSelect={handleSelectLetter} />
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleAddSpace}>
            Espacio
          </Button>
          <Button variant="outline" onClick={handleBackspace}>
            Borrar letra
          </Button>
          <Button variant="destructive" onClick={handleClear}>
            Borrar todo
          </Button>
        </div>

        {/* Área de texto con scroll vertical */}
        <div className="flex-1 min-h-[140px] max-h-64 overflow-y-auto">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Aquí aparecerá el texto construido..."
            className="min-h-[140px] h-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
