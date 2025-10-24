"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Instructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Instrucciones de Uso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Señas a Texto:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Activa la cámara</li>
              <li>• Posiciónate frente a la cámara</li>
              <li>• Realiza las señas claramente</li>
              <li>• La traducción ocurre automáticamente</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Texto a Señas:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Escribe el texto a traducir</li>
              <li>• Presiona "Mostrar en Señas"</li>
              <li>• Observa la secuencia de señas</li>
              <li>• Usa el audio para practicar</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
