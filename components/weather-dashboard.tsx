"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, ChevronDown, ChevronUp } from "lucide-react"
import WeatherCard from "./weather-card"
import ForecastSection from "./forecast-section"
import WeatherDetails from "./weather-details"
import WeatherAnimation from "./weather-animation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Tipos de dados que esperamos receber do backend Laravel
interface WeatherData {
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
    uv: number
    pressure_mb: number
    vis_km: number
    air_quality: {
      "us-epa-index": number
    }
  }
  forecast: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        condition: {
          text: string
          code: number
        }
      }
      hour: Array<{
        time: string
        temp_c: number
        condition: {
          text: string
          code: number
        }
      }>
    }>
  }
}

// Dados de exemplo para desenvolvimento
const mockWeatherData: WeatherData = {
  location: {
    name: "São Paulo",
    country: "Brasil",
    region: "São Paulo",
  },
  current: {
    temp_c: 28,
    temp_f: 82.4,
    condition: {
      text: "Parcialmente nublado",
      code: 1003,
    },
    wind_kph: 15,
    humidity: 65,
    feelslike_c: 30,
    uv: 6,
    pressure_mb: 1012,
    vis_km: 10,
    air_quality: {
      "us-epa-index": 2,
    },
  },
  forecast: {
    forecastday: [
      {
        date: "2023-05-09",
        day: {
          maxtemp_c: 29,
          mintemp_c: 19,
          condition: {
            text: "Parcialmente nublado",
            code: 1003,
          },
        },
        hour: Array(24)
          .fill(null)
          .map((_, i) => ({
            time: `2023-05-09 ${i.toString().padStart(2, "0")}:00`,
            temp_c: 20 + Math.floor(Math.random() * 10),
            condition: {
              text: ["Ensolarado", "Parcialmente nublado", "Nublado"][Math.floor(Math.random() * 3)],
              code: [1000, 1003, 1006][Math.floor(Math.random() * 3)],
            },
          })),
      },
      {
        date: "2023-05-10",
        day: {
          maxtemp_c: 27,
          mintemp_c: 18,
          condition: {
            text: "Chuva leve",
            code: 1183,
          },
        },
        hour: Array(24)
          .fill(null)
          .map((_, i) => ({
            time: `2023-05-10 ${i.toString().padStart(2, "0")}:00`,
            temp_c: 18 + Math.floor(Math.random() * 10),
            condition: {
              text: ["Chuva leve", "Parcialmente nublado", "Nublado"][Math.floor(Math.random() * 3)],
              code: [1183, 1003, 1006][Math.floor(Math.random() * 3)],
            },
          })),
      },
      {
        date: "2023-05-11",
        day: {
          maxtemp_c: 25,
          mintemp_c: 17,
          condition: {
            text: "Chuva moderada",
            code: 1189,
          },
        },
        hour: Array(24)
          .fill(null)
          .map((_, i) => ({
            time: `2023-05-11 ${i.toString().padStart(2, "0")}:00`,
            temp_c: 17 + Math.floor(Math.random() * 9),
            condition: {
              text: ["Chuva moderada", "Chuva leve", "Nublado"][Math.floor(Math.random() * 3)],
              code: [1189, 1183, 1006][Math.floor(Math.random() * 3)],
            },
          })),
      },
      {
        date: "2023-05-12",
        day: {
          maxtemp_c: 24,
          mintemp_c: 16,
          condition: {
            text: "Ensolarado",
            code: 1000,
          },
        },
        hour: Array(24)
          .fill(null)
          .map((_, i) => ({
            time: `2023-05-12 ${i.toString().padStart(2, "0")}:00`,
            temp_c: 16 + Math.floor(Math.random() * 9),
            condition: {
              text: ["Ensolarado", "Parcialmente nublado", "Nublado"][Math.floor(Math.random() * 3)],
              code: [1000, 1003, 1006][Math.floor(Math.random() * 3)],
            },
          })),
      },
      {
        date: "2023-05-13",
        day: {
          maxtemp_c: 26,
          mintemp_c: 17,
          condition: {
            text: "Parcialmente nublado",
            code: 1003,
          },
        },
        hour: Array(24)
          .fill(null)
          .map((_, i) => ({
            time: `2023-05-13 ${i.toString().padStart(2, "0")}:00`,
            temp_c: 17 + Math.floor(Math.random() * 10),
            condition: {
              text: ["Ensolarado", "Parcialmente nublado", "Nublado"][Math.floor(Math.random() * 3)],
              code: [1000, 1003, 1006][Math.floor(Math.random() * 3)],
            },
          })),
      },
    ],
  },
}

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius")
  const { toast } = useToast()

  useEffect(() => {
    // Simulando carregamento de dados do backend
    const fetchData = async () => {
      setLoading(true)
      try {
        // Aqui você faria a chamada para o seu backend Laravel
        // const response = await fetch('https://seu-backend-laravel.com/api/weather?location=sao-paulo');
        // const data = await response.json();

        // Usando dados mockados para desenvolvimento
        setTimeout(() => {
          setWeatherData(mockWeatherData)
          setLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Erro ao buscar dados do clima:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do clima. Tente novamente mais tarde.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      // Aqui você faria a chamada para o seu backend Laravel com a query de busca
      // const response = await fetch(`https://seu-backend-laravel.com/api/weather?location=${searchQuery}`);
      // const data = await response.json();

      // Simulando busca com dados mockados
      setTimeout(() => {
        const newData = { ...mockWeatherData }
        newData.location.name = searchQuery
        setWeatherData(newData)
        setLoading(false)
        toast({
          title: "Localização atualizada",
          description: `Mostrando clima para ${searchQuery}`,
        })
      }, 1000)
    } catch (error) {
      console.error("Erro ao buscar dados do clima:", error)
      toast({
        title: "Erro",
        description: "Não foi possível encontrar o clima para esta localização.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  if (loading && !weatherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-t-sky-500 border-r-transparent border-b-transparent border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Carregando dados do clima...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Clima<span className="text-sky-500">App</span>
          </h1>

          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Input
                type="text"
                placeholder="Buscar cidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            <Button type="submit" className="ml-2">
              Buscar
            </Button>
          </form>
        </div>
      </header>

      {weatherData && (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <WeatherCard
                  location={weatherData.location}
                  current={weatherData.current}
                  unit={unit}
                  onUnitChange={(newUnit) => setUnit(newUnit as "celsius" | "fahrenheit")}
                />

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Previsão para 5 dias</h2>
                    <Button variant="ghost" size="sm" onClick={toggleDetails} className="flex items-center gap-1">
                      {showDetails ? (
                        <>
                          Menos detalhes <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Mais detalhes <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  <ForecastSection forecast={weatherData.forecast} unit={unit} showDetails={showDetails} />
                </div>
              </div>

              <div>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden h-full">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-sky-500" />
                      {weatherData.location.name}, {weatherData.location.country}
                    </h2>

                    <div className="relative h-48 mb-6">
                      <WeatherAnimation condition={weatherData.current.condition.code} />
                    </div>

                    <Tabs defaultValue="details">
                      <TabsList className="w-full mb-4">
                        <TabsTrigger value="details" className="flex-1">
                          Detalhes
                        </TabsTrigger>
                        <TabsTrigger value="hourly" className="flex-1">
                          Horário
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="details">
                        <WeatherDetails current={weatherData.current} />
                      </TabsContent>

                      <TabsContent value="hourly">
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                          {weatherData.forecast.forecastday[0].hour
                            .filter((_, index) => index % 3 === 0) // Mostrar a cada 3 horas
                            .map((hour, index) => {
                              const hourTime = new Date(hour.time).getHours()
                              const formattedTime = `${hourTime}:00`

                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-sky-50 dark:bg-slate-700 rounded-lg"
                                >
                                  <span className="font-medium text-slate-700 dark:text-slate-200">
                                    {formattedTime}
                                  </span>
                                  <div className="flex items-center">
                                    <span className="text-lg font-semibold text-slate-800 dark:text-white">
                                      {unit === "celsius"
                                        ? `${hour.temp_c}°C`
                                        : `${Math.round((hour.temp_c * 9) / 5 + 32)}°F`}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
