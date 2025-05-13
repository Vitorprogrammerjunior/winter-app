"use client"

import React from "react"
import { motion } from "framer-motion"
import { MapPin, Thermometer, Wind, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getWeatherIcon, getWeatherBackground } from "@/lib/weather-utils"

interface WeatherCardProps {
  location: {
    name: string
    country: string
    region: string
  }
  current: {
    temp_c: number
    temp_f: number
    condition: {
      text: string
      code: number
    }
    wind_kph: number
    humidity: number
    feelslike_c: number
  }
  unit: "celsius" | "fahrenheit"
  onUnitChange: (unit: "celsius" | "fahrenheit") => void
}

export default function WeatherCard({ location, current, unit, onUnitChange }: WeatherCardProps) {
  const WeatherIcon = getWeatherIcon(current.condition.code)
  const backgroundClass = getWeatherBackground(current.condition.code)

  const temperature =
    unit === "celsius"
      ? `${Math.round(current.temp_c)}°C`
      : `${Math.round(current.temp_f)}°F`

  const feelsLike =
    unit === "celsius"
      ? `${Math.round(current.feelslike_c)}°C`
      : `${Math.round((current.feelslike_c * 9) / 5 + 32)}°F`

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
              <h2 className="text-2xl font-bold">{location.name}</h2>
            </div>
            <p className="text-sm opacity-90 mb-4">
              {location.region}, {location.country}
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
              <p className="text-lg opacity-90">{current.condition.text}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
            <div className="flex flex-col items-center bg-white/10 rounded-lg p-3">
              <Thermometer className="h-5 w-5 mb-1" />
              <span className="text-sm opacity-80">Sensação</span>
              <span className="font-medium">{feelsLike}</span>
            </div>

            <div className="flex flex-col items-center bg-white/10 rounded-lg p-3">
              <Wind className="h-5 w-5 mb-1" />
              <span className="text-sm opacity-80">Vento</span>
              <span className="font-medium">{current.wind_kph} km/h</span>
            </div>

            <div className="flex flex-col items-center bg-white/10 rounded-lg p-3">
              <Droplets className="h-5 w-5 mb-1" />
              <span className="text-sm opacity-80">Umidade</span>
              <span className="font-medium">{current.humidity}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}