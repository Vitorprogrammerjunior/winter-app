"use client"

import React, { useState, useEffect } from "react"
import LoadingWeather from "@/components/loading-weather"
import SplashScreen from "@/components/splash-screen"
import WeatherDashboard from "@/components/weather-dashboard"
import { fetchWeather } from "@/lib/api"

interface WeatherData {
  sucesso: boolean
  dados?: {
    atual: {
      cidade: string
      pais: string
      atualizado_em: string
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
    previsao: Array<{
      data: string
      condicao: string
      icone: string
      temp_max: number
      temp_min: number
      chance_chuva: number
      precipitacao_mm: number
    }>
  }
  erro?: string
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lat = -20.8972
        const lon = -41.5200 // Corrigido nome da variável
        const dias = 5

        const data = await fetchWeather(lat, lon, dias)
        
        // Verificação correta das propriedades
        if (!data.sucesso || !data.dados) {
          throw new Error(data.erro || "Falha ao obter dados meteorológicos")
        }

        setWeatherData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  if (loading) {
    return <LoadingWeather />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-center text-lg p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl">
          ⚠️ {error}
        </p>
      </div>
    )
  }

  if (!weatherData?.dados) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-yellow-600 text-center text-lg dark:text-yellow-400 p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl">
          Dados meteorológicos indisponíveis
        </p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 dark:from-slate-900 dark:to-slate-800">
      <SplashScreen />
      <WeatherDashboard 
        initialData={{
          atual: weatherData.dados.atual,
          previsao: weatherData.dados.previsao
        }}
      />
    </main>
  )
}