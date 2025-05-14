"use client"

import React, { useState, useEffect } from "react"
import LoadingWeather from "@/components/loading-weather"
import SplashScreen from "@/components/splash-screen"
import WeatherDashboard from "@/components/weather-dashboard"
import { fetchWeather } from "@/lib/api"

// Interface corrigida (remova 'sucesso' e 'dados')
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
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
      const UseDefaultLocation = () => {
      // Coordenadas padrão (Alegre-ES)
      setCoords({ lat: -20.7629, lon: -41.5336 })
    }

    const getLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocalização não é suportada pelo seu navegador")
        UseDefaultLocation()
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        },
        (error) => {
          console.warn('Erro na geolocalização:', error)
          setError("Não foi possível obter sua localização")
          UseDefaultLocation()
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    }

  
    getLocation()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!coords) return

      try {
        const data = await fetchWeather(coords.lat, coords.lon, 5)
        
        if (!data.sucesso || !data.dados) {
          throw new Error(data.erro || "Dados meteorológicos inválidos")
        }

        setWeatherData(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [coords])

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

  // Verificação final após o carregamento
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
        atual: weatherData.dados.atual, // Acessa através de dados
        previsao: weatherData.dados.previsao
      }}
    />
  </main>
)
}