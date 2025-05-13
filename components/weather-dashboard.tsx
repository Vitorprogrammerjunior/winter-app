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

// Tipagem conforme seu backend (Laravel)
interface ClimaBackendData {
  atual: {
    cidade: string
    estado: string
    atualizado_em: string
    condicoes: {
      temperatura: number
      condicao: string
      umidade: number
      intensidade_vento: number
      direcao_vento: string
      pressao: number
      sensacao_termica: number
    }
  }
  previsao: {
    cidade: string
    estado: string
    previsao: Array<{
      data: string
      condicao: string
      icone: string
      temperatura: { minima: number; maxima: number }
      chuva: { probabilidade: number; precipitacao: number }
    }>
  }
}

interface WeatherDashboardProps {
  initialData: ClimaBackendData
}

export default function WeatherDashboard({ initialData }: WeatherDashboardProps) {
  const { atual, previsao } = initialData
  const [searchQuery, setSearchQuery] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius")
  const { toast } = useToast()

  // Busca de cidade
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
      // recarrega passando novos dados
      window.location.reload()
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Falha ao buscar cidade", variant: "destructive" })
    }
  }

  const toggleDetails = () => setShowDetails(!showDetails)

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
                location={{
                  name: atual.cidade,
                  country: atual.estado,
                  region: atual.estado,
                }}
                current={{
                  temp_c: atual.condicoes.temperatura,
                  temp_f: (atual.condicoes.temperatura * 9) / 5 + 32,
                  condition: { text: atual.condicoes.condicao, code: 0 },
                  wind_kph: atual.condicoes.intensidade_vento,
                  humidity: atual.condicoes.umidade,
                  feelslike_c: atual.condicoes.sensacao_termica,
                  uv: atual.condicoes.sensacao_termica,
                  pressure_mb: atual.condicoes.pressao,
                  vis_km: 0,
                  air_quality: {
                    "us-epa-index": 0,
                  },
                }}
                unit={unit}
                onUnitChange={(u) => setUnit(u)}
              />

              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Previsão para 5 dias</h2>
                  <Button variant="ghost" size="sm" onClick={toggleDetails} className="flex items-center gap-1">
                    {showDetails ? (
                      <>Menos detalhes <ChevronUp className="h-4 w-4" /></>
                    ) : (
                      <>Mais detalhes <ChevronDown className="h-4 w-4" /></>
                    )}
                  </Button>
                </div>

<ForecastSection 
  forecast={previsao.previsao}  // passa o Array de dias, não o objeto inteiro
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
                    {atual.cidade}, {atual.estado}
                  </h2>

                  <div className="relative h-48 mb-6">
                    <WeatherAnimation condition={0} />
                  </div>

                  <Tabs defaultValue="details">
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="details" className="flex-1">Detalhes</TabsTrigger>
                      <TabsTrigger value="hourly" className="flex-1">Horário</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                      <WeatherDetails current={{
                        temp_c: atual.condicoes.temperatura,
                        temp_f: (atual.condicoes.temperatura * 9) / 5 + 32,
                        condition: { text: atual.condicoes.condicao, code: 0 },
                        wind_kph: atual.condicoes.intensidade_vento,
                        humidity: atual.condicoes.umidade,
                        feelslike_c: atual.condicoes.sensacao_termica,
                        uv: atual.condicoes.sensacao_termica,
                        pressure_mb: atual.condicoes.pressao,
                        vis_km: 0,
                        air_quality: { "us-epa-index": 0 },
                      }} />
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
