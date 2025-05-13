"use client"

import React from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getWeatherIcon } from "@/lib/weather-utils"

interface ForecastDay {
  date: string
  day: {
    condition: {
      code: number
      text: string
    }
    maxtemp_c: number
    mintemp_c: number
  }
  hour: Array<{
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

  // Verificação de segurança para dados ausentes
  if (!forecast || forecast.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500 dark:text-slate-400">
        Dados de previsão não disponíveis
      </div>
    )
  }

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="space-y-4"
    >
      {forecast.map((day, index) => {
        const dateObj = new Date(day.date)
        const formattedDate = format(dateObj, "EEEE, d 'de' MMMM", { locale: ptBR })
        const WeatherIcon = getWeatherIcon(day.day.condition.code)

        const maxTemp = unit === "celsius"
          ? `${Math.round(day.day.maxtemp_c)}°C`
          : `${Math.round((day.day.maxtemp_c * 9) / 5 + 32)}°F`

        const minTemp = unit === "celsius"
          ? `${Math.round(day.day.mintemp_c)}°C`
          : `${Math.round((day.day.mintemp_c * 9) / 5 + 32)}°F`

        return (
          <motion.div
            key={day.date}
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
                    {day.day.condition.text}
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

              {showDetails && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-4">
                    {day.hour
                      ?.filter((_, idx) => idx % 3 === 0)
                      .map((hour, idx) => {
                        const hourTime = new Date(hour.time).getHours()
                        const formattedTime = `${hourTime}:00`
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