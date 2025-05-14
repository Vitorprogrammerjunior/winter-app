"use client"

import React from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getWeatherIcon } from "@/lib/weather-utils"

interface ForecastDay {
  data: string  // Alterado para corresponder à API
  condicao: string
  icone: string
  temp_max: number
  temp_min: number
  chance_chuva: number
  precipitacao_mm: number
  hour?: Array<{ // Adicionado campo hour se necessário
    time: string
    temp_c: number
    condition: {
      code: number
    }
  }>
}

interface ForecastSectionProps {
  forecast?: ForecastDay[]
  unit?: "celsius" | "fahrenheit"
  showDetails?: boolean
}

export default function ForecastSection({ 
  forecast, 
  unit = "celsius", 
  showDetails = false 
}: ForecastSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (!forecast || forecast.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500 dark:text-slate-400">
        Dados de previsão não disponíveis
      </div>
    )
  }

  // Função segura para parse de datas
  const parseDate = (dateString: string) => {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? new Date() : date
  }

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="space-y-4"
    >
      {forecast.map((day, index) => {
        const dateObj = parseDate(day.data) // Usando data da API
        const formattedDate = format(dateObj, "EEEE, d 'de' MMMM", { locale: ptBR })
        
        // Extrai código do ícone da URL da API
        const iconCode = parseInt(day.icone.split('/').pop()?.split('.')[0] || '1000')
        const WeatherIcon = getWeatherIcon(iconCode)

        const maxTemp = unit === "celsius"
          ? `${Math.round(day.temp_max)}°C`
          : `${Math.round((day.temp_max * 9) / 5 + 32)}°F`

        const minTemp = unit === "celsius"
          ? `${Math.round(day.temp_min)}°C`
          : `${Math.round((day.temp_min * 9) / 5 + 32)}°F`

        return (
          <motion.div
            key={day.data}
            variants={item}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-white capitalize">
                    {index === 0 ? "Hoje" : formattedDate}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {day.condicao}
                  </p>
                </div>

                <div className="flex items-center">
                  <WeatherIcon className="h-10 w-10 text-sky-500 mr-2" />
                  <div className="text-right">
                    <span className="text-lg font-semibold text-slate-800 dark:text-white">
                      {maxTemp}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                      {minTemp}
                    </span>
                  </div>
                </div>
              </div>

              {showDetails && day.hour && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-4">
                    {day.hour
                      .filter((_, idx) => idx % 3 === 0)
                      .map((hour, idx) => {
                        const hourTime = parseDate(hour.time)
                        const formattedTime = format(hourTime, "HH':'mm", { locale: ptBR })
                        const HourIcon = getWeatherIcon(hour.condition.code)

                        const hourTemp = unit === "celsius"
                          ? `${Math.round(hour.temp_c)}°`
                          : `${Math.round((hour.temp_c * 9) / 5 + 32)}°`

                        return (
                          <div key={idx} className="flex flex-col items-center min-w-[60px]">
                            <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                              {formattedTime}
                            </span>
                            <HourIcon className="h-6 w-6 text-sky-500 my-1" />
                            <span className="font-medium text-slate-800 dark:text-white">
                              {hourTemp}
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}