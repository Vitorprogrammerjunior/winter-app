// lib/api.ts

export interface WeatherResponse {
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

/**
 * Busca o clima no backend Laravel
 * Retorna apenas json.dados que tem o formato WeatherResponse
 */
export const fetchWeather = async (lat: number, lon: number, days: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/weather?lat=${lat}&lon=${lon}&dias=${days}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json() as WeatherData // Tipagem direta
  } catch (error) {
    console.error("Erro na requisição:", error)
    throw error
  }
}
