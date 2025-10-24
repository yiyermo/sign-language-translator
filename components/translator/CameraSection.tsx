"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, Hand, Type } from "lucide-react"
import type { CameraPermission } from "@/hooks/useCamera"
import { Textarea } from "@/components/ui/textarea"

type Props =
  | {
      mode: "signs-to-text"
      videoRef: React.RefObject<HTMLVideoElement | null>
      isRecording: boolean
      cameraPermission: CameraPermission
      onToggleCamera: () => void | Promise<void>
    }
  | {
      mode: "text-to-signs"
      inputText: string
      onInputChange: (v: string) => void
      onTranslate: () => void
    }

function PermissionAlert({ permission }: { permission: CameraPermission }) {
  if (permission === "granted" || permission === "pending") return null
  const map: Record<Exclude<CameraPermission, "granted" | "pending">, string> = {
    "no-device": "No se encontró una cámara en este dispositivo.",
    "unsupported": "Tu navegador no soporta acceso a la cámara (mediaDevices no disponible).",
    "insecure-context": "Se requiere un contexto seguro (HTTPS o localhost) para usar la cámara.",
    "denied": "No se pudo acceder a la cámara. Por favor, permite el acceso en tu navegador.",
  }
  return (
    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
      <p className="text-destructive text-sm">{map[permission]}</p>
    </div>
  )
}

export default function CameraSection(props: Props) {
  if (props.mode === "signs-to-text") {
    const { videoRef, isRecording, cameraPermission, onToggleCamera } = props
    const activateDisabled =
      cameraPermission === "no-device" ||
      cameraPermission === "unsupported" ||
      cameraPermission === "insecure-context"

    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Cámara - Lenguaje de Señas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {!isRecording && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="text-center space-y-2">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Cámara desactivada</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onToggleCamera}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              className="flex-1 min-h-[50px]"
              disabled={activateDisabled && !isRecording}
              title={
                activateDisabled
                  ? "Activación deshabilitada: no hay cámara o el contexto/navegador no la soporta"
                  : undefined
              }
            >
              {isRecording ? (
                <>
                  <CameraOff className="mr-2 h-5 w-5" />
                  Detener Cámara
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-5 w-5" />
                  Activar Cámara
                </>
              )}
            </Button>
          </div>

          <PermissionAlert permission={cameraPermission} />
        </CardContent>
      </Card>
    )
  }

  // Texto a Señas
  const { inputText, onInputChange, onTranslate } = props
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2">
          <Type className="h-5 w-5" />
          Texto a Traducir
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Escribe el texto que quieres traducir a lenguaje de señas..."
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          className="min-h-[200px] text-lg"
        />
        <Button onClick={onTranslate} disabled={!inputText.trim()} size="lg" className="w-full min-h-[50px]">
          <Hand className="mr-2 h-5 w-5" />
          Mostrar en Señas
        </Button>
      </CardContent>
    </Card>
  )
}
