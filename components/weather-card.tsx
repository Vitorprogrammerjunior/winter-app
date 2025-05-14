"use client"

import React from "react"
import { motion } from "framer-motion"
import { MapPin, Thermometer, Wind, Droplets, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getWeatherIcon, getWeatherBackground } from "@/lib/weather-utils"


interface WeatherCardProps {
  data: {
    atual: {
      cidade: string
      pais: string
      condicoes: {
        temperatura: number
        condicao_texto: string
        icone: string
        umidade: number
        vento_kph: number
        pressao_mb: number
        sensacao_termica: number
      }
    }
  }
  unit: "celsius" | "fahrenheit"
  onUnitChange: (unit: "celsius" | "fahrenheit") => void
}



export default function WeatherCard({ data, unit, onUnitChange }: WeatherCardProps) {
  // Extração segura do código do ícone
  const iconCode = parseInt(data.atual.condicoes.icone?.match(/\/(\d+)\./)?.[1] || '1000')
  
  const WeatherIcon = getWeatherIcon(iconCode)
  const backgroundClass = getWeatherBackground(iconCode)

  const temperature = unit === "celsius"
    ? `${Math.round(data.atual.condicoes.temperatura)}°C`
    : `${Math.round((data.atual.condicoes.temperatura * 9) / 5 + 32)}°F`

  const feelsLike = unit === "celsius"
    ? `${Math.round(data.atual.condicoes.sensacao_termica)}°C`
    : `${Math.round((data.atual.condicoes.sensacao_termica * 9) / 5 + 32)}°F`
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl shadow-lg overflow-hidden ${backgroundClass}`}
    >
      <div className="p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center mb-2">
              <MapPin className="h-5 w-5 mr-2" />
              <h2 className="text-2xl font-bold capitalize">{data.atual.cidade}</h2>
            </div>
            <p className="text-sm opacity-90 mb-4">
              {data.atual.pais} 
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Button
              size="sm"
              variant={unit === "celsius" ? "default" : "outline"}
              onClick={() => onUnitChange("celsius")}
              className={
                unit === "celsius"
                  ? "bg-white/20 hover:bg-white/30"
                  : "bg-white/10 hover:bg-white/20"
              }
            >
              °C
            </Button>
            <Button
              size="sm"
              variant={unit === "fahrenheit" ? "default" : "outline"}
              onClick={() => onUnitChange("fahrenheit")}
              className={
                unit === "fahrenheit"
                  ? "bg-white/20 hover:bg-white/30"
                  : "bg-white/10 hover:bg-white/20"
              }
            >
              °F
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center mt-6">
          <div className="flex items-center mb-4 md:mb-0 md:mr-8">
            <div className="relative">
              <WeatherIcon className="h-20 w-20 text-white" />
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="ml-4">
              <h3 className="text-5xl font-bold">{temperature}</h3>
              <p className="text-lg opacity-90 capitalize">
                {data.atual.condicoes.condicao_texto.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
            <WeatherInfoCard
              icon={<Thermometer className="h-5 w-5 mb-1" />}
              label="Sensação"
              value={feelsLike}
            />

            <WeatherInfoCard
              icon={<Wind className="h-5 w-5 mb-1" />}
              label="Vento"
              value={`${data.atual.condicoes.vento_kph} km/h`}
            />

            <WeatherInfoCard
              icon={<Droplets className="h-5 w-5 mb-1" />}
              label="Umidade"
              value={`${data.atual.condicoes.umidade}%`}
            />

            <WeatherInfoCard
              icon={<Gauge className="h-5 w-5 mb-1" />}
              label="Pressão"
              value={`${data.atual.condicoes.pressao_mb} mb`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Componente auxiliar para os cards de informação
const WeatherInfoCard = ({ icon, label, value }: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <div className="flex flex-col items-center bg-white/10 rounded-lg p-3">
    {icon}
    <span className="text-sm opacity-80">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
)