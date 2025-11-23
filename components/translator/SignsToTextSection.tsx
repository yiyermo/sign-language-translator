"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">
          Señas a texto (teclado de deletreo)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <p className="text-sm text-muted-foreground">
          Haz clic en las letras del teclado para simular el deletreo en lengua de señas.
          Puedes agregar espacios, borrar la última letra o limpiar todo.
        </p>

        <FingerspellingKeyboard onSelect={handleSelectLetter} />

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={handleAddSpace}>
            Espacio
          </Button>
          <Button type="button" variant="outline" onClick={handleBackspace}>
            Borrar letra
          </Button>
          <Button type="button" variant="destructive" onClick={handleClear}>
            Borrar todo
          </Button>
        </div>

        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Aquí se mostrará el texto que vas construyendo con el deletreo..."
          className="min-h-[120px]"
        />
      </CardContent>
    </Card>
  )
}
