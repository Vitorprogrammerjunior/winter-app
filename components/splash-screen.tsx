"use client"

import { useState, useEffect } from "react"
import IntroAnimation from "./intro-animation"

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true)
  const [weatherCondition, setWeatherCondition] = useState(1000) // Padrão: ensolarado

  useEffect(() => {
    // Aqui você poderia fazer uma chamada para obter o clima atual
    // e definir o código de condição apropriado

    // Simulando diferentes condições climáticas aleatoriamente para demonstração
    const conditions = [
      1000, // Ensolarado
      1003, // Parcialmente nublado
      1006, // Nublado
      1183, // Chuva leve
      1189, // Chuva moderada
      1216, // Neve leve
      1273, // Tempestade com chuva leve
      1135, // Neblina
    ]

    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
    setWeatherCondition(randomCondition)

    // Verificar se o usuário já viu a animação antes
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro")
    if (hasSeenIntro) {
      setShowSplash(false)
    } else {
      // Definir que o usuário viu a animação
      sessionStorage.setItem("hasSeenIntro", "true")
    }
  }, [])

  const handleComplete = () => {
    setShowSplash(false)
  }

  if (!showSplash) return null

  return <IntroAnimation conditionCode={weatherCondition} onComplete={handleComplete} />
}
