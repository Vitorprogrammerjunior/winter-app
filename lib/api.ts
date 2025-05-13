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
export async function fetchWeather(
  lat: number,
  lon: number,
  dias: number
): Promise<WeatherResponse> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/"
  const url = `${base}/weather?lat=${lat}&lon=${lon}&dias=${dias}`
  const res = await fetch(url, { headers: { Accept: "application/json" } })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  const json = await res.json()
  if (!json.sucesso) {
    throw new Error(json.erro || "Erro na API")
  }
  return json.dados as WeatherResponse
}
