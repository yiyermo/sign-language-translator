"use client"

import { useEffect, useRef, useState } from "react"

export type CameraPermission =
  | "granted"
  | "denied"
  | "pending"
  | "no-device"
  | "unsupported"
  | "insecure-context"

function isSecureContext() {
  // HTTPS o localhost son contextos seguros
  if (typeof window === "undefined") return false
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "::1"
  return window.isSecureContext || isLocalhost
}

async function hasVideoInput(): Promise<boolean> {
  if (!navigator.mediaDevices?.enumerateDevices) return false
  const devices = await navigator.mediaDevices.enumerateDevices()
  return devices.some((d) => d.kind === "videoinput")
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraPermission, setCameraPermission] = useState<CameraPermission>("pending")
  const [isRecording, setIsRecording] = useState(false)

  const startCamera = async () => {
    // Soporte básico
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      setCameraPermission("unsupported")
      setIsRecording(false)
      return
    }

    // Contexto seguro
    if (!isSecureContext()) {
      setCameraPermission("insecure-context")
      setIsRecording(false)
      return
    }

    // Ver si hay cámara
    const hasCam = await hasVideoInput().catch(() => false)
    if (!hasCam) {
      setCameraPermission("no-device")
      setIsRecording(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraPermission("granted")
        setIsRecording(true)
      }
    } catch (error: any) {
      console.error("[v0] Error accessing camera:", error)
      const name = (error && error.name) || ""
      if (name === "NotFoundError" || name === "OverconstrainedError") {
        setCameraPermission("no-device")
      } else if (name === "NotAllowedError" || name === "SecurityError") {
        setCameraPermission("denied")
      } else {
        // fallback genérico
        setCameraPermission("denied")
      }
      setIsRecording(false)
    }
  }

  const stopCamera = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    } finally {
      setIsRecording(false)
    }
  }

  useEffect(() => {
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { videoRef, cameraPermission, isRecording, startCamera, stopCamera }
}
