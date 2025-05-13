"use client"

import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface WeatherAnimationProps {
  condition: number
}

export default function WeatherAnimation({ condition }: WeatherAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Flags de condição
  const isRainy = [1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(condition)
  const isSnowy = [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(condition)
  const isThunderstorm = [1087, 1273, 1276, 1279, 1282].includes(condition)
  const isFoggy = [1030, 1135, 1147].includes(condition)
  const isSunny = condition === 1000
  const isPartlyCloudy = condition === 1003
  const isCloudy = [1006, 1009].includes(condition)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Tema escuro?
    const isDarkMode = document.documentElement.classList.contains("dark")

    // Ajuste de tamanho
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Paletas de cor
    const colors = {
      sunny: ["#FFD700", "#FFA500", "#FF8C00", "#FFFF00"],
      cloudy: ["#E6E6FA", "#D8BFD8", "#DDA0DD", "#FFFFFF"],
      rainy: ["#87CEEB", "#B0E0E6", "#ADD8E6", "#4682B4"],
      snowy: ["#F0F8FF", "#E6E6FA", "#FFFFFF", "#F5F5F5"],
      thunderstorm: ["#4B0082", "#8A2BE2", "#9400D3", "#FFFFFF"],
      foggy: ["#DCDCDC", "#D3D3D3", "#C0C0C0", "#F5F5F5"],
    }

    let palette = colors.sunny
    if (isThunderstorm) palette = colors.thunderstorm
    else if (isRainy) palette = colors.rainy
    else if (isSnowy) palette = colors.snowy
    else if (isFoggy) palette = colors.foggy
    else if (isCloudy) palette = colors.cloudy

    const particles: any[] = []
    const count = isRainy ? 150 : isSnowy ? 100 : isFoggy ? 200 : isSunny ? 80 : 60

    class Particle {
      x = 0; y = 0; size = 0; speedX = 0; speedY = 0;
      color = ""; opacity = 1; shape = "circle"
      // atributos específicos omitidos para brevidade
      reset() {
        this.x = Math.random() * canvas.width
        this.y = isRainy || isSnowy ? -20 : Math.random() * canvas.height
        this.size = Math.random() * (isSnowy ? 6 : 3) + (isSnowy ? 2 : 1)
        this.speedX = (Math.random() - 0.5) * (isRainy ? 1 : 3)
        this.speedY = isRainy ? Math.random() * 7 + 5 : isSnowy ? Math.random() * 2 + 1 : Math.random() * 1 + 0.5
        this.color = palette[Math.floor(Math.random() * palette.length)]
        this.opacity = Math.random() * 0.6 + 0.3
        this.shape = isSnowy ? "flake" : isRainy ? "drop" : "circle"
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset()
        }
      }
      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    for (let i = 0; i < count; i++) {
      const p = new Particle()
      p.reset()
      particles.push(p)
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      requestAnimationFrame(animate)
    }
    animate()

    return () => { ctx.clearRect(0, 0, canvas.width, canvas.height) }
  }, [condition])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {(isSunny || isPartlyCloudy) && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            className="absolute inset-0 w-16 h-16 rounded-full bg-yellow-300 dark:bg-yellow-400 blur-md opacity-60"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 dark:from-yellow-400 dark:to-amber-600 shadow-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      {(isPartlyCloudy || isCloudy) && (
        <> 
          <motion.div
            className="absolute top-10 left-10 w-20 h-8 rounded-full bg-white dark:bg-gray-300 shadow-md opacity-90"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-6 left-6 w-32 h-10 rounded-full bg-white dark:bg-gray-300 shadow-md opacity-80"
            animate={{ x: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-16 right-10 w-24 h-8 rounded-full bg-white dark:bg-gray-300 shadow-md opacity-70"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
