"use client"

import React from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getWeatherIcon } from "@/lib/weather-utils"

interface ForecastDay {
  data: string
  condicao: string
  icone: string
  temp_max: number
  temp_min: number
  chance_chuva: number
  precipitacao_mm: number
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


const parseDate = (dateString: string) => {
  const date = new Date(dateString + "T00:00:00-03:00"); // Fuso BR
  return isNaN(date.getTime()) ? new Date() : date;
};


  // Adicione esta função fora do componente
const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Dentro do componente, modifique:
  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="space-y-4"
    >
      {forecast.map((day, index) => {
        const dateObj = parseDate(day.data)
        const formattedDate = format(dateObj, "EEEE, d 'de' MMMM", { locale: ptBR })
        
        const iconPath = day.icone.split('/')
        const iconCode = iconPath[iconPath.length - 1].split('.')[0]
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
                    {isToday(dateObj) ? "Hoje" : formattedDate}
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

              {showDetails && (
                <div className="mt-2 text-sm">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Chance de chuva: {day.chance_chuva}%</span>
                    <span>Precipitação: {day.precipitacao_mm}mm</span>
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