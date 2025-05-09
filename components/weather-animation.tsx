"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface WeatherAnimationProps {
  condition: number
}

export default function WeatherAnimation({ condition }: WeatherAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animação de sol ou nuvens
  const isSunny = [1000].includes(condition)
  const isPartlyCloudy = [1003].includes(condition)
  const isCloudy = [1006, 1009].includes(condition)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Detectar tema escuro
    const isDarkMode = document.documentElement.classList.contains("dark")

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Configurações de animação baseadas no clima
    const isRainy = [1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(condition)
    const isSnowy = [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(condition)
    const isThunderstorm = [1087, 1273, 1276, 1279, 1282].includes(condition)
    const isFoggy = [1030, 1135, 1147].includes(condition)
    const isSunny = [1000].includes(condition)
    const isPartlyCloudy = [1003].includes(condition)
    const isCloudy = [1006, 1009].includes(condition)

    // Cores e configurações visuais com suporte a tema escuro
    const colors = {
      sunny: isDarkMode ? ["#FFD700", "#FFA500", "#FF8C00", "#FFFF00"] : ["#FFD700", "#FFA500", "#FF8C00", "#FFFF00"],
      cloudy: isDarkMode ? ["#A9A9A9", "#B8B8B8", "#C0C0C0", "#D3D3D3"] : ["#E6E6FA", "#D8BFD8", "#DDA0DD", "#FFFFFF"],
      rainy: isDarkMode ? ["#4682B4", "#5F9EA0", "#6495ED", "#7B68EE"] : ["#87CEEB", "#B0E0E6", "#ADD8E6", "#4682B4"],
      snowy: isDarkMode ? ["#B0C4DE", "#B0E0E6", "#D3D3D3", "#E0E0E0"] : ["#F0F8FF", "#E6E6FA", "#FFFFFF", "#F5F5F5"],
      thunderstorm: isDarkMode
        ? ["#191970", "#4B0082", "#8A2BE2", "#9400D3"]
        : ["#4B0082", "#8A2BE2", "#9400D3", "#FFFFFF"],
      foggy: isDarkMode ? ["#708090", "#778899", "#808080", "#A9A9A9"] : ["#DCDCDC", "#D3D3D3", "#C0C0C0", "#F5F5F5"],
    }

    // Escolher paleta de cores baseada no clima
    let colorPalette = colors.sunny
    if (isRainy) colorPalette = colors.rainy
    else if (isSnowy) colorPalette = colors.snowy
    else if (isThunderstorm) colorPalette = colors.thunderstorm
    else if (isFoggy || isCloudy) colorPalette = colors.foggy
    else if (isPartlyCloudy) colorPalette = colors.cloudy

    // Criar partículas
    const particles = []
    const particleCount = isRainy ? 150 : isSnowy ? 100 : isFoggy ? 200 : isSunny ? 80 : 60

    // Classe de partícula mais sofisticada
    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        // Propriedades básicas
        this.x = Math.random() * canvas.width
        this.y = isRainy || isSnowy ? -20 : Math.random() * canvas.height
        this.size = Math.random() * (isSnowy ? 6 : 3) + (isSnowy ? 2 : 1)
        this.speedX = (Math.random() - 0.5) * (isRainy ? 1 : 3)
        this.speedY = isRainy ? Math.random() * 7 + 5 : isSnowy ? Math.random() * 2 + 1 : Math.random() * 1 + 0.5

        // Propriedades visuais
        this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
        this.opacity = Math.random() * 0.6 + 0.3
        this.shape = isSnowy ? "flake" : isRainy ? "drop" : "circle"

        // Propriedades de animação
        this.angle = Math.random() * Math.PI * 2
        this.angleSpeed = Math.random() * 0.02 - 0.01
        this.glowing = Math.random() > 0.7
        this.glowIntensity = Math.random() * 10 + 5
        this.pulseSpeed = Math.random() * 0.1
        this.pulsePhase = Math.random() * Math.PI * 2

        // Propriedades específicas
        if (isRainy) {
          this.length = Math.random() * 20 + 10
          this.thickness = Math.random() * 2 + 1
          this.swingAmount = Math.random() * 3
          this.swingSpeed = Math.random() * 0.02
          this.swingOffset = Math.random() * Math.PI * 2
          this.trailLength = Math.floor(Math.random() * 3) + 2
          this.trail = []
        } else if (isSnowy) {
          this.arms = Math.floor(Math.random() * 3) + 4 // 4-6 braços
          this.armLength = this.size * (Math.random() * 0.5 + 0.5)
          this.rotation = Math.random() * Math.PI * 2
          this.rotationSpeed = (Math.random() - 0.5) * 0.02
        } else if (isSunny) {
          this.pulseAmount = Math.random() * 0.5 + 0.5
          this.originalSize = this.size
        }
      }

      update() {
        // Atualizar posição
        this.x +=
          this.speedX + (isRainy ? Math.sin(this.swingOffset + Date.now() * this.swingSpeed) * this.swingAmount : 0)
        this.y += this.speedY

        // Atualizar ângulo
        this.angle += this.angleSpeed

        // Manter histórico para rastros (chuva)
        if (isRainy && this.trail) {
          this.trail.unshift({ x: this.x, y: this.y })
          if (this.trail.length > this.trailLength) {
            this.trail.pop()
          }
        }

        // Pulsar tamanho para partículas de sol
        if (isSunny) {
          this.size = this.originalSize + Math.sin(Date.now() * this.pulseSpeed + this.pulsePhase) * this.pulseAmount
        }

        // Rotação para flocos de neve
        if (isSnowy) {
          this.rotation += this.rotationSpeed
        }

        // Resetar partícula quando sair da tela
        if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset()
          if (!isRainy && !isSnowy) {
            this.y = Math.random() * canvas.height
          } else {
            this.y = -20
          }
        }
      }

      draw(ctx) {
        ctx.save()

        // Configurar transparência
        ctx.globalAlpha = this.opacity

        // Adicionar brilho para partículas especiais
        if (this.glowing) {
          ctx.shadowBlur = this.glowIntensity
          ctx.shadowColor = this.color
        }

        if (this.shape === "flake") {
          // Desenhar floco de neve
          ctx.translate(this.x, this.y)
          ctx.rotate(this.rotation)

          ctx.strokeStyle = this.color
          ctx.lineWidth = this.size / 8
          ctx.beginPath()

          // Desenhar braços do floco
          for (let i = 0; i < this.arms; i++) {
            const angle = (i / this.arms) * Math.PI * 2
            ctx.moveTo(0, 0)
            ctx.lineTo(Math.cos(angle) * this.armLength, Math.sin(angle) * this.armLength)

            // Adicionar detalhes aos braços
            const subArmLength = this.armLength * 0.6
            ctx.moveTo(Math.cos(angle) * this.armLength * 0.5, Math.sin(angle) * this.armLength * 0.5)
            ctx.lineTo(
              Math.cos(angle) * this.armLength * 0.5 + Math.cos(angle + Math.PI / 2) * subArmLength,
              Math.sin(angle) * this.armLength * 0.5 + Math.sin(angle + Math.PI / 2) * subArmLength,
            )

            ctx.moveTo(Math.cos(angle) * this.armLength * 0.5, Math.sin(angle) * this.armLength * 0.5)
            ctx.lineTo(
              Math.cos(angle) * this.armLength * 0.5 + Math.cos(angle - Math.PI / 2) * subArmLength,
              Math.sin(angle) * this.armLength * 0.5 + Math.sin(angle - Math.PI / 2) * subArmLength,
            )
          }

          ctx.stroke()

          // Adicionar centro do floco
          ctx.fillStyle = this.color
          ctx.beginPath()
          ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2)
          ctx.fill()
        } else if (this.shape === "drop") {
          // Desenhar gota de chuva com rastro
          ctx.strokeStyle = this.color
          ctx.lineWidth = this.thickness

          // Desenhar rastro se existir
          if (this.trail && this.trail.length > 1) {
            ctx.beginPath()
            ctx.moveTo(this.trail[0].x, this.trail[0].y)

            for (let i = 1; i < this.trail.length; i++) {
              ctx.lineTo(this.trail[i].x, this.trail[i].y)
              ctx.globalAlpha = this.opacity * (1 - i / this.trail.length)
            }

            ctx.stroke()
            ctx.globalAlpha = this.opacity
          }

          // Desenhar gota principal
          ctx.beginPath()
          ctx.moveTo(this.x, this.y)
          ctx.lineTo(this.x, this.y + this.length)
          ctx.stroke()

          // Adicionar "splash" quando a gota chega perto do fundo
          if (this.y > canvas.height - 50 && Math.random() > 0.9) {
            ctx.beginPath()
            ctx.arc(this.x, canvas.height - 5, Math.random() * 3 + 1, 0, Math.PI * 2)
            ctx.fillStyle = this.color
            ctx.fill()
          }
        } else {
          // Desenhar partícula circular (padrão)
          ctx.fillStyle = this.color
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill()

          // Adicionar halo para partículas de sol
          if (isSunny && this.glowing) {
            ctx.globalAlpha = this.opacity * 0.4
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2)
            ctx.fill()
          }

          // Adicionar efeito de névoa para partículas de neblina
          if (isFoggy) {
            ctx.globalAlpha = this.opacity * 0.3
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        ctx.restore()
      }
    }

    // Inicializar partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Configurações para relâmpagos
    const lightning = {
      active: false,
      opacity: 0,
      nextTime: isThunderstorm ? Date.now() + Math.random() * 3000 + 2000 : null,
      branches: [],
      generateBranches: function (startX, startY, angle, depth, branchLength) {
        if (depth <= 0) return

        const endX = startX + Math.cos(angle) * branchLength
        const endY = startY + Math.sin(angle) * branchLength

        this.branches.push({
          startX,
          startY,
          endX,
          endY,
          width: depth + 1,
          alpha: Math.random() * 0.3 + 0.7,
        })

        // Criar ramificações
        const branchCount = Math.floor(Math.random() * 3) + 1
        for (let i = 0; i < branchCount; i++) {
          const newAngle = angle + (Math.random() - 0.5) * 1.5
          const newLength = branchLength * (Math.random() * 0.5 + 0.3)
          this.generateBranches(endX, endY, newAngle, depth - 1, newLength)
        }
      },
    }

    // Configurações para o sol
    const sun = {
      x: canvas.width / 2,
      y: canvas.height / 3,
      radius: Math.min(canvas.width, canvas.height) / 6,
      rays: 12,
      rayLength: Math.min(canvas.width, canvas.height) / 8,
      angle: 0,
      corona: {
        layers: 3,
        speed: 0.0005,
        amplitude: 15,
      },
    }

    // Configurações para nuvens
    const clouds = []
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
          segments: Math.floor(Math.random() * 3) + 3,
          offset: Math.random() * Math.PI * 2,
          amplitude: Math.random() * 5 + 2,
          frequency: Math.random() * 0.02 + 0.01,
        })
      }
    }

    // Função para desenhar nuvem mais realista
    function drawCloud(cloud) {
      ctx.fillStyle = isDarkMode ? `rgba(200, 200, 200, ${cloud.opacity})` : `rgba(255, 255, 255, ${cloud.opacity})`

      // Criar forma de nuvem com círculos sobrepostos
      const radiusY = cloud.height / 2
      const radiusX = cloud.width / 4
      const segments = cloud.segments

      // Desenhar segmentos da nuvem com movimento ondulante
      for (let i = 0; i < segments; i++) {
        const segmentX = cloud.x + (i / segments) * cloud.width
        const segmentY = cloud.y + Math.sin(cloud.offset + Date.now() * cloud.frequency + i) * cloud.amplitude
        const segmentSize = (0.5 + Math.sin((i / segments) * Math.PI) * 0.5) * radiusY

        ctx.beginPath()
        ctx.arc(segmentX, segmentY, segmentSize * 1.2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Adicionar base da nuvem
      ctx.beginPath()
      ctx.ellipse(cloud.x + cloud.width / 2, cloud.y + radiusY / 2, cloud.width / 2, radiusY / 2, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    // Função de animação principal
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Desenhar sol para dias ensolarados ou parcialmente nublados
      if (isSunny || isPartlyCloudy) {
        // Glow do sol
        const gradient = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, sun.radius * 3)
        gradient.addColorStop(0, "rgba(255, 200, 50, 0.8)")
        gradient.addColorStop(0.5, "rgba(255, 150, 50, 0.2)")
        gradient.addColorStop(1, "rgba(255, 150, 50, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(sun.x, sun.y, sun.radius * 3, 0, Math.PI * 2)
        ctx.fill()

        // Corona solar (camadas de círculos ondulantes)
        for (let i = 0; i < sun.corona.layers; i++) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(255, 215, 0, ${0.7 - i * 0.2})`
          ctx.lineWidth = 2 - i * 0.5

          // Desenhar círculo ondulante
          for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
            const amplitude = sun.corona.amplitude * (1 + i * 0.5)
            const frequency = 6 + i * 2
            const phase = Date.now() * sun.corona.speed * (i + 1)

            const radius = sun.radius * (1.2 + i * 0.3) + Math.sin(angle * frequency + phase) * amplitude

            const x = sun.x + Math.cos(angle) * radius
            const y = sun.y + Math.sin(angle) * radius

            if (angle === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }

          ctx.closePath()
          ctx.stroke()
        }

        // Sol - cor ajustada para tema escuro
        ctx.fillStyle = isDarkMode ? "#FFC125" : "#FFD700"
        ctx.beginPath()
        ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2)
        ctx.fill()

        // Raios do sol - cor ajustada para tema escuro
        ctx.strokeStyle = isDarkMode ? "#FFC125" : "#FFD700"

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
        drawCloud(cloud)

        // Mover nuvens
        cloud.x += cloud.speed
        if (cloud.x > canvas.width + cloud.width / 2) {
          cloud.x = -cloud.width / 2
          cloud.y = Math.random() * (canvas.height / 2)
          cloud.speed = Math.random() * 0.5 + 0.1
        }
      })

      // Atualizar e desenhar partículas
      particles.forEach((particle) => {
        particle.update()
        particle.draw(ctx)
      })

      // Desenhar relâmpagos para tempestades
      if (isThunderstorm) {
        if (lightning.active) {
          // Flash de relâmpago
          ctx.fillStyle = `rgba(255, 255, 255, ${lightning.opacity * 0.3})`
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Desenhar raios
          if (lightning.branches.length > 0) {
            ctx.lineCap = "round"
            lightning.branches.forEach((branch) => {
              ctx.strokeStyle = `rgba(255, 255, 255, ${branch.alpha * lightning.opacity})`
              ctx.lineWidth = branch.width
              ctx.beginPath()
              ctx.moveTo(branch.startX, branch.startY)
              ctx.lineTo(branch.endX, branch.endY)
              ctx.stroke()
            })
          }

          lightning.opacity -= 0.03

          if (lightning.opacity <= 0) {
            lightning.active = false
            lightning.branches = []
            lightning.nextTime = Date.now() + Math.random() * 5000 + 2000
          }
        } else if (lightning.nextTime && Date.now() > lightning.nextTime) {
          lightning.active = true
          lightning.opacity = Math.random() * 0.3 + 0.7
          lightning.branches = []

          // Gerar relâmpago
          const startX = Math.random() * canvas.width
          lightning.generateBranches(
            startX,
            0,
            Math.PI / 2, // Ângulo para baixo
            3, // Profundidade da recursão
            canvas.height / 4, // Comprimento do ramo principal
          )

          lightning.nextTime = null
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Adicionar interatividade com o mouse/toque
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Adicionar partículas extras na posição do mouse
      if (isSunny || isPartlyCloudy) {
        for (let i = 0; i < 2; i++) {
          const particle = new Particle()
          particle.x = mouseX
          particle.y = mouseY
          particle.speedX = (Math.random() - 0.5) * 3
          particle.speedY = (Math.random() - 0.5) * 3
          particle.size = Math.random() * 3 + 1
          particle.opacity = Math.random() * 0.5 + 0.2
          particles.push(particle)

          // Limitar o número máximo de partículas
          if (particles.length > particleCount + 50) {
            particles.shift()
          }
        }
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault()
      handleMouseMove(e.touches[0])
    })

    // Limpar animação quando o componente for desmontado
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("touchmove", handleMouseMove)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [condition, isSunny, isPartlyCloudy, isCloudy])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Sol com efeito de brilho */}
      {(isSunny || isPartlyCloudy) && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            className="absolute inset-0 w-16 h-16 rounded-full bg-yellow-300 dark:bg-yellow-400 blur-md opacity-60"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 dark:from-yellow-400 dark:to-amber-600 shadow-lg"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      {/* Nuvens com cores realistas e diferentes do sol */}
      {(isPartlyCloudy || isCloudy) && (
        <>
          <motion.div
            className="absolute top-10 left-10 w-20 h-8 rounded-full bg-gradient-to-b from-white to-gray-100 dark:from-gray-300 dark:to-gray-400 shadow-md opacity-90"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-6 left-6 w-32 h-10 rounded-full bg-gradient-to-b from-white to-gray-100 dark:from-gray-300 dark:to-gray-400 shadow-md opacity-80"
            animate={{ x: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-16 right-10 w-24 h-8 rounded-full bg-gradient-to-b from-white to-gray-100 dark:from-gray-300 dark:to-gray-400 shadow-md opacity-70"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          {/* Nuvem sobreposta ao sol para clima parcialmente nublado */}
          {isPartlyCloudy && (
            <motion.div
              className="absolute top-2 right-8 w-28 h-10 rounded-full bg-gradient-to-b from-white to-gray-100 dark:from-gray-300 dark:to-gray-400 shadow-md opacity-90 z-20"
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          )}
        </>
      )}

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
