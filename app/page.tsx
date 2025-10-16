"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Camera, CameraOff, RotateCcw, Volume2, Hand, Type } from "lucide-react"

export default function SignLanguageTranslator() {
  const [mode, setMode] = useState<"signs-to-text" | "text-to-signs">("signs-to-text")
  const [isRecording, setIsRecording] = useState(false)
  const [translatedText, setTranslatedText] = useState("")
  const [inputText, setInputText] = useState("")
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "pending">("pending")
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraPermission("granted")
        setIsRecording(true)
      }
    } catch (error) {
      console.error("[v0] Error accessing camera:", error)
      setCameraPermission("denied")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsRecording(false)
  }

  const simulateTranslation = () => {
    if (mode === "signs-to-text") {
      setTranslatedText("Hola, ¿cómo estás? Me alegra verte.")
    } else {
      // En modo texto a señas, simularíamos mostrar las señas
      setTranslatedText('Mostrando secuencia de señas para: "' + inputText + '"')
    }
  }

  const clearTranslation = () => {
    setTranslatedText("")
    setInputText("")
  }

  const speakText = () => {
    if (translatedText && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText)
      utterance.lang = "es-ES"
      speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Traductor de Lenguaje de Señas
          </h1>
          <p className="text-muted-foreground text-lg">Traduce entre lenguaje de señas español castellano y texto</p>
        </div>

        {/* Mode Toggle */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button
                variant={mode === "signs-to-text" ? "default" : "outline"}
                size="lg"
                onClick={() => setMode("signs-to-text")}
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
                onClick={() => setMode("text-to-signs")}
                className="w-full sm:w-auto min-h-[60px] text-lg"
              >
                <Type className="mr-2 h-6 w-6" />
                Texto a Señas
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Camera/Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                {mode === "signs-to-text" ? (
                  <>
                    <Camera className="h-5 w-5" />
                    Cámara - Lenguaje de Señas
                  </>
                ) : (
                  <>
                    <Type className="h-5 w-5" />
                    Texto a Traducir
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mode === "signs-to-text" ? (
                <div className="space-y-4">
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
                      onClick={isRecording ? stopCamera : startCamera}
                      variant={isRecording ? "destructive" : "default"}
                      size="lg"
                      className="flex-1 min-h-[50px]"
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

                    <Button
                      onClick={simulateTranslation}
                      disabled={!isRecording}
                      size="lg"
                      variant="secondary"
                      className="min-h-[50px]"
                    >
                      Traducir
                    </Button>
                  </div>

                  {cameraPermission === "denied" && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive text-sm">
                        No se pudo acceder a la cámara. Por favor, permite el acceso a la cámara en tu navegador.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Escribe el texto que quieres traducir a lenguaje de señas..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px] text-lg"
                  />

                  <Button
                    onClick={simulateTranslation}
                    disabled={!inputText.trim()}
                    size="lg"
                    className="w-full min-h-[50px]"
                  >
                    <Hand className="mr-2 h-5 w-5" />
                    Mostrar en Señas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Translation Results */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                {mode === "signs-to-text" ? (
                  <>
                    <Type className="h-5 w-5" />
                    Texto Traducido
                  </>
                ) : (
                  <>
                    <Hand className="h-5 w-5" />
                    Señas Generadas
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="min-h-[200px] p-4 bg-muted rounded-lg">
                {translatedText ? (
                  <p className="text-lg leading-relaxed">{translatedText}</p>
                ) : (
                  <p className="text-muted-foreground text-center">
                    {mode === "signs-to-text" ? "La traducción aparecerá aquí..." : "Las señas se mostrarán aquí..."}
                  </p>
                )}
              </div>

              {translatedText && (
                <div className="flex gap-2">
                  <Button
                    onClick={speakText}
                    variant="outline"
                    size="lg"
                    className="flex-1 min-h-[50px] bg-transparent"
                  >
                    <Volume2 className="mr-2 h-5 w-5" />
                    Reproducir Audio
                  </Button>

                  <Button
                    onClick={clearTranslation}
                    variant="outline"
                    size="lg"
                    className="min-h-[50px] bg-transparent"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Limpiar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant={isRecording ? "default" : "secondary"}>
            {isRecording ? "Cámara Activa" : "Cámara Inactiva"}
          </Badge>
          <Badge variant="outline">Modo: {mode === "signs-to-text" ? "Señas → Texto" : "Texto → Señas"}</Badge>
          <Badge variant="outline">Idioma: Español Castellano</Badge>
        </div>

        {/* Instructions */}
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
                  <li>• Presiona "Traducir" para obtener el texto</li>
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
      </div>
    </div>
  )
}
