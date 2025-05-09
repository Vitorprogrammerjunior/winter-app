"use client"

import { motion } from "framer-motion"
import { Thermometer, Droplets, Wind, Gauge, Eye, Sun } from "lucide-react"

interface WeatherDetailsProps {
  current: {
    wind_kph: number
    humidity: number
    feelslike_c: number
    uv: number
    pressure_mb: number
    vis_km: number
    air_quality?: {
      "us-epa-index": number
    }
  }
}

export default function WeatherDetails({ current }: WeatherDetailsProps) {
  const getAirQualityText = (index: number) => {
    const labels = ["Bom", "Moderado", "Insalubre para grupos sensíveis", "Insalubre", "Muito insalubre", "Perigoso"]
    return labels[index - 1] || "Desconhecido"
  }

  const items = [
    {
      icon: <Thermometer className="h-5 w-5 text-sky-500" />,
      label: "Sensação térmica",
      value: `${current.feelslike_c}°C`,
    },
    {
      icon: <Droplets className="h-5 w-5 text-sky-500" />,
      label: "Umidade",
      value: `${current.humidity}%`,
    },
    {
      icon: <Wind className="h-5 w-5 text-sky-500" />,
      label: "Vento",
      value: `${current.wind_kph} km/h`,
    },
    {
      icon: <Gauge className="h-5 w-5 text-sky-500" />,
      label: "Pressão",
      value: `${current.pressure_mb} mb`,
    },
    {
      icon: <Eye className="h-5 w-5 text-sky-500" />,
      label: "Visibilidade",
      value: `${current.vis_km} km`,
    },
    {
      icon: <Sun className="h-5 w-5 text-sky-500" />,
      label: "Índice UV",
      value: current.uv,
    },
  ]

  if (current.air_quality) {
    items.push({
      icon: <Wind className="h-5 w-5 text-sky-500" />,
      label: "Qualidade do ar",
      value: getAirQualityText(current.air_quality["us-epa-index"]),
    })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center">
            {item.icon}
            <span className="ml-2 text-slate-700 dark:text-slate-200">{item.label}</span>
          </div>
          <span className="font-medium text-slate-800 dark:text-white">{item.value}</span>
        </div>
      ))}
    </motion.div>
  )
}
