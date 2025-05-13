"use client"

import React, { useState, useEffect } from "react"
import LoadingWeather from "@/components/loading-weather"
import SplashScreen from "@/components/splash-screen"
import WeatherDashboard from "@/components/weather-dashboard"
import { fetchWeather, WeatherResponse } from "@/lib/api"

export default function Home() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const lat = -20.8972
    const lon = -41.5200
    const dias = 5

    fetchWeather(lat, lon, dias)
      .then((data) => setWeather(data))
      .catch((err) => setError(err.message))
  }, [])

  if (error) {
    return <p className="text-red-500 text-center mt-8">Erro: {error}</p>
  }

  if (!weather) {
    return <LoadingWeather />
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 dark:from-slate-900 dark:to-slate-800">
      <SplashScreen />
      <WeatherDashboard initialData={weather} />
    </main>
  )
}