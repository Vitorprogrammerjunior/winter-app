"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog } from "lucide-react"
import { getWeatherBackground } from "@/lib/weather-utils"

interface IntroAnimationProps {
  conditionCode: number
  onComplete: () => void
}

export default function IntroAnimation({ conditionCode, onComplete }: IntroAnimationProps) {
  const [animationComplete, setAnimationComplete] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  // Determinar o tipo de clima para a animação
  const isSunny = [1000].includes(conditionCode)
  const isPartlyCloudy = [1003].includes(conditionCode)
  const isCloudy = [1006, 1009].includes(conditionCode)
  const isRainy = [1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(conditionCode)
  const isSnowy = [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(conditionCode)
  const isThunderstorm = [1087, 1273, 1276, 1279, 1282].includes(conditionCode)
  const isFoggy = [1030, 1135, 1147].includes(conditionCode)

  const backgroundClass = getWeatherBackground(conditionCode)

  // Efeito para animação de partículas baseada no clima
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: any[] = []
    let particleCount = 0

    // Configurar partículas com base no clima
    if (isSunny) {
      particleCount = 50 // Partículas de luz solar
    } else if (isRainy) {
      particleCount = 200 // Gotas de chuva
    } else if (isSnowy) {
      particleCount = 100 // Flocos de neve
    } else if (isThunderstorm) {
      particleCount = 100 // Gotas de chuva + relâmpagos
    } else if (isFoggy) {
      particleCount = 150 // Partículas de névoa
    } else {
      particleCount = 80 // Nuvens e partículas genéricas
    }

    // Criar partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: isSunny ? Math.random() * 3 + 1 : isSnowy ? Math.random() * 4 + 2 : Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * (isSunny ? 1 : isRainy ? 0.5 : 1),
        speedY: isSunny
          ? Math.random() * 0.5
          : isRainy
            ? Math.random() * 7 + 5
            : isSnowy
              ? Math.random() * 2 + 1
              : Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        color: isSunny
          ? `rgba(255, 255, 150, ${Math.random() * 0.5 + 0.2})`
          : isRainy
            ? `rgba(174, 194, 224, ${Math.random() * 0.5 + 0.3})`
            : isSnowy
              ? `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`
              : isFoggy
                ? `rgba(220, 220, 220, ${Math.random() * 0.3 + 0.1})`
                : `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`,
        length: isRainy ? Math.random() * 10 + 10 : 0,
        swing: Math.random() * 3,
        swingSpeed: Math.random() * 0.02,
        swingOffset: Math.random() * Math.PI * 2,
      })
    }

    // Variáveis para relâmpagos
    const lightning = {
      active: false,
      opacity: 0,
      nextTime: isThunderstorm ? Math.random() * 3000 + 2000 : null,
    }

    // Variáveis para o sol
    const sun = {
      x: canvas.width / 2,
      y: canvas.height / 3,
      radius: Math.min(canvas.width, canvas.height) / 6,
      rays: 12,
      rayLength: Math.min(canvas.width, canvas.height) / 10,
      angle: 0,
    }

    // Variáveis para nuvens
    const clouds: any[] = []
    if (isPartlyCloudy || isCloudy || isRainy || isThunderstorm) {
      const cloudCount = isPartlyCloudy ? 3 : isCloudy ? 5 : 4
      for (let i = 0; i < cloudCount; i++) {
        clouds.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height / 2),
          width: Math.random() * 200 + 100,
          height: Math.random() * 80 + 40,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.4 + 0.4,
        })
      }
    }

    let animationFrame: number

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Desenhar sol para dias ensolarados ou parcialmente nublados
      if (isSunny || isPartlyCloudy) {
        // Glow do sol
        const gradient = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, sun.radius * 2)
        gradient.addColorStop(0, "rgba(255, 200, 50, 0.8)")
        gradient.addColorStop(0.5, "rgba(255, 150, 50, 0.2)")
        gradient.addColorStop(1, "rgba(255, 150, 50, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(sun.x, sun.y, sun.radius * 2, 0, Math.PI * 2)
        ctx.fill()

        // Sol
        ctx.fillStyle = "#FFD700"
        ctx.beginPath()
        ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2)
        ctx.fill()

        // Raios do sol
        ctx.strokeStyle = "#FFD700"
        ctx.lineWidth = 3

        for (let i = 0; i < sun.rays; i++) {
          const angle = (i * (Math.PI * 2)) / sun.rays + sun.angle
          const innerRadius = sun.radius + 5
          const outerRadius = sun.radius + sun.rayLength + Math.sin(Date.now() * 0.001 + i) * 10

          ctx.beginPath()
          ctx.moveTo(sun.x + Math.cos(angle) * innerRadius, sun.y + Math.sin(angle) * innerRadius)
          ctx.lineTo(sun.x + Math.cos(angle) * outerRadius, sun.y + Math.sin(angle) * outerRadius)
          ctx.stroke()
        }

        sun.angle += 0.001
      }

      // Desenhar nuvens
      clouds.forEach((cloud) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`

        // Desenhar uma nuvem usando múltiplos círculos
        const drawCloud = (x: number, y: number, width: number, height: number) => {
          const radiusY = height / 2
          const radiusX = width / 4

          ctx.beginPath()
          ctx.ellipse(x, y + radiusY, radiusX, radiusY, 0, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.ellipse(x + radiusX * 1.5, y + radiusY * 0.8, radiusX, radiusY * 0.8, 0, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.ellipse(x + radiusX * 3, y + radiusY, radiusX * 1.2, radiusY, 0, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.ellipse(x + radiusX * 1.5, y + radiusY * 1.2, radiusX * 0.9, radiusY * 0.7, 0, 0, Math.PI * 2)
          ctx.fill()
        }

        drawCloud(cloud.x, cloud.y, cloud.width, cloud.height)

        // Mover nuvens
        cloud.x += cloud.speed
        if (cloud.x > canvas.width + cloud.width / 2) {
          cloud.x = -cloud.width / 2
          cloud.y = Math.random() * (canvas.height / 2)
        }
      })

      // Desenhar partículas
      particles.forEach((p) => {
        if (isRainy) {
          // Gotas de chuva
          ctx.strokeStyle = p.color
          ctx.lineWidth = p.size / 2

          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x, p.y + p.length)
          ctx.stroke()
        } else if (isSnowy) {
          // Flocos de neve
          ctx.fillStyle = p.color

          // Desenhar floco de neve
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()

          // Adicionar detalhes ao floco
          if (p.size > 3) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
            ctx.lineWidth = 0.5

            for (let i = 0; i < 3; i++) {
              const angle = (i * Math.PI) / 3

              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(p.x + Math.cos(angle) * p.size * 1.5, p.y + Math.sin(angle) * p.size * 1.5)
              ctx.stroke()
            }
          }
        } else if (isSunny) {
          // Partículas de luz solar
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (isFoggy) {
          // Partículas de névoa
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Partículas genéricas
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }

        // Atualizar posição
        p.x += p.speedX + (isRainy ? Math.sin(p.swingOffset + Date.now() * p.swingSpeed) * p.swing : 0)
        p.y += p.speedY

        // Reposicionar partículas que saem da tela
        if (p.y > canvas.height) {
          p.y = 0
          p.x = Math.random() * canvas.width
        }

        if (p.x > canvas.width) {
          p.x = 0
        } else if (p.x < 0) {
          p.x = canvas.width
        }
      })

      // Desenhar relâmpagos para tempestades
      if (isThunderstorm && lightning.nextTime !== null) {
        if (lightning.active) {
          // Flash de relâmpago
          ctx.fillStyle = `rgba(255, 255, 255, ${lightning.opacity})`
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Desenhar raio
          if (lightning.opacity > 0.5) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.9)"
            ctx.lineWidth = 3

            const startX = Math.random() * canvas.width
            const startY = 0

            let x = startX
            let y = startY

            ctx.beginPath()
            ctx.moveTo(x, y)

            // Criar um caminho em zigue-zague para o raio
            const segments = Math.floor(Math.random() * 5) + 5
            for (let i = 0; i < segments; i++) {
              const nextY = y + canvas.height / segments
              const nextX = x + (Math.random() - 0.5) * 100

              ctx.lineTo(nextX, nextY)
              x = nextX
              y = nextY
            }

            ctx.stroke()
          }

          lightning.opacity -= 0.03

          if (lightning.opacity <= 0) {
            lightning.active = false
            lightning.nextTime = Date.now() + Math.random() * 5000 + 2000
          }
        } else if (lightning.nextTime && Date.now() > lightning.nextTime) {
          lightning.active = true
          lightning.opacity = Math.random() * 0.3 + 0.7
          lightning.nextTime = null
        }
      }

      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    // Limpar animação quando o componente for desmontado
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [conditionCode, isSunny, isPartlyCloudy, isCloudy, isRainy, isSnowy, isThunderstorm, isFoggy])

  // Efeito para completar a animação após um tempo
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
      setTimeout(() => {
        onComplete()
      }, 1000)
    }, 4000)

    return () => clearTimeout(timer)
  }, [onComplete])

  // Determinar o ícone e texto com base no clima
  let WeatherIcon = Cloud
  let weatherText = "Carregando..."

  if (isSunny) {
    WeatherIcon = Sun
    weatherText = "Ensolarado"
  } else if (isPartlyCloudy) {
    WeatherIcon = Cloud
    weatherText = "Parcialmente Nublado"
  } else if (isCloudy) {
    WeatherIcon = Cloud
    weatherText = "Nublado"
  } else if (isRainy) {
    WeatherIcon = CloudRain
    weatherText = "Chuvoso"
  } else if (isSnowy) {
    WeatherIcon = CloudSnow
    weatherText = "Nevando"
  } else if (isThunderstorm) {
    WeatherIcon = CloudLightning
    weatherText = "Tempestade"
  } else if (isFoggy) {
    WeatherIcon = CloudFog
    weatherText = "Neblina"
  }

  return (
    <AnimatePresence>
      {!animationComplete && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center ${backgroundClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5,
              }}
              className="mb-8"
            >
              <WeatherIcon className="h-32 w-32 text-white" strokeWidth={1.5} />
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-4 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Clima<span className="text-yellow-300">App</span>
            </motion.h1>

            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <motion.div
                className="h-3 w-3 rounded-full bg-white"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0,
                }}
              />
              <motion.div
                className="h-3 w-3 rounded-full bg-white"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
              <motion.div
                className="h-3 w-3 rounded-full bg-white"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </motion.div>

            <motion.p
              className="text-xl text-white mt-4 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              {weatherText}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
