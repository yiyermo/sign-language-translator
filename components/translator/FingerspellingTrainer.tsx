"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type Props = {
  onAdd: (label: string) => void
  labels: string[]
  onSave: () => void
  onReset: () => void
}

export default function FingerspellingTrainer({ onAdd, labels, onSave, onReset }: Props) {
  const [label, setLabel] = useState("A")
  const [n, setN] = useState(10)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Entrenador de Dactilología</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value.toUpperCase())}
            maxLength={2}
            className="w-20"
            placeholder="Letra"
          />
          <Input
            type="number"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value || "1", 10))}
            className="w-24"
            min={1}
            max={50}
          />
          <Button
            onClick={() => {
              // tomamos n muestras al presionar el botón (la lógica de recolección la maneja page.tsx)
              const L = label.trim().toUpperCase()
              if (!L) return
              const times = Math.max(1, Math.min(n, 50))
              for (let i = 0; i < times; i++) onAdd(L)
            }}
          >
            Grabar {n} muestras
          </Button>

          <Button variant="secondary" onClick={onSave}>
            Guardar modelo
          </Button>

          <Button variant="destructive" onClick={onReset}>
            Reiniciar
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {labels.map((l) => (
            <Badge key={l} variant="outline">
              {l}
            </Badge>
          ))}
          {labels.length === 0 && <span className="text-muted-foreground">Sin letras entrenadas aún</span>}
        </div>

        <p className="text-sm text-muted-foreground">
          Tip: entrena 10–20 muestras por letra (mano centrada, diferentes distancias/ángulos).
        </p>
      </CardContent>
    </Card>
  )
}
