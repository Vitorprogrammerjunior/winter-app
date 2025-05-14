"use client"

import React, { useState, FormEvent } from "react"
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

interface WeatherData {
  atual: {
    cidade: string
    pais: string
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

interface WeatherDashboardProps {
  initialData: WeatherData
}

export default function WeatherDashboard({ initialData }: WeatherDashboardProps) {
  const { atual, previsao } = initialData
  const [searchQuery, setSearchQuery] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius")
  const { toast } = useToast()

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL!
      const url = `${base}/weather?cidade=${encodeURIComponent(searchQuery)}&dias=5`
      const res = await fetch(url, { headers: { Accept: "application/json" } })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const json = await res.json()
      if (!json.sucesso) throw new Error(json.erro || "Erro na API")
      window.location.reload()
    } catch (err: any) {
      toast({ 
        title: "Erro", 
        description: err.message || "Falha ao buscar cidade", 
        variant: "destructive" 
      })
    }
  }

  const toggleDetails = () => setShowDetails(!showDetails)

  const getIconCode = (iconUrl: string) => {
    return parseInt(iconUrl?.split('/').pop()?.split('.')[0] || '1000')
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
            <Button type="submit" className="ml-2">Buscar</Button>
          </form>
        </div>
      </header>

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
                data={initialData}
                unit={unit}
                onUnitChange={setUnit}
              />

              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                    Previsão para 5 dias
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleDetails} 
                    className="flex items-center gap-1"
                  >
                    {showDetails ? (
                      <>Menos detalhes <ChevronUp className="h-4 w-4" /></>
                    ) : (
                      <>Mais detalhes <ChevronDown className="h-4 w-4" /></>
                    )}
                  </Button>
                </div>

                <ForecastSection 
                  forecast={previsao}
                  unit={unit} 
                  showDetails={showDetails} 
                />
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden h-full">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-sky-500" />
                    {atual.cidade}, {atual.pais}
                  </h2>

                  <div className="relative h-48 mb-6">
                    <WeatherAnimation condition={getIconCode(atual.condicoes.icone)} />
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
                      <WeatherDetails 
                        current={{
                          condicoes: atual.condicoes,
                          cidade: atual.cidade,
                          pais: atual.pais
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="hourly">
                      <div className="p-4 text-center text-slate-600 dark:text-slate-400">
                        Dados horários não disponíveis
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}