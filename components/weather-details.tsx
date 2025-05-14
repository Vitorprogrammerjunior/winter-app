"use client"

import { motion } from "framer-motion"
import { Thermometer, Droplets, Wind, Gauge, Eye, Sun } from "lucide-react"

interface WeatherDetailsProps {
  current: {
    condicoes: {
      vento_kph: number
      umidade: number
      sensacao_termica: number
      pressao_mb: number
      visibilidade?: number
      indice_uv?: number
    }
    cidade: string
    pais: string
  }
}

export default function WeatherDetails({ current }: WeatherDetailsProps) {
  const items = [
    {
      icon: <Thermometer className="h-5 w-5 text-sky-500" />,
      label: "Sensação térmica",
      value: `${Math.round(current.condicoes.sensacao_termica)}°C`,
    },
    {
      icon: <Droplets className="h-5 w-5 text-sky-500" />,
      label: "Umidade",
      value: `${current.condicoes.umidade}%`,
    },
    {
      icon: <Wind className="h-5 w-5 text-sky-500" />,
      label: "Vento",
      value: `${current.condicoes.vento_kph} km/h`,
    },
    {
      icon: <Gauge className="h-5 w-5 text-sky-500" />,
      label: "Pressão",
      value: `${current.condicoes.pressao_mb} mb`,
    },
    {
      icon: <Eye className="h-5 w-5 text-sky-500" />,
      label: "Visibilidade",
      value: `${current.condicoes.visibilidade || 0} km`,
    },
    {
      icon: <Sun className="h-5 w-5 text-sky-500" />,
      label: "Índice UV",
      value: current.condicoes.indice_uv || '--',
    },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }} 
      className="space-y-3"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          Condições em {current.cidade}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {current.pais}
        </p>
      </div>
      
      {items.map((item, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
        >
          <div className="flex items-center">
            {item.icon}
            <span className="ml-2 text-slate-700 dark:text-slate-200">{item.label}</span>
          </div>
          <span className="font-medium text-slate-800 dark:text-white">
            {item.value}
          </span>
        </div>
      ))}
    </motion.div>
  )
}