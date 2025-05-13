import {
  Sun,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
  type LucideIcon,
} from "lucide-react"

// Mapeamento de ícones baseado nos códigos da API WeatherAPI.com
export function getWeatherIcon(conditionCode: number): LucideIcon {
  if (conditionCode === 1000) {
    return Sun // Ensolarado
  }

  if (conditionCode === 1003) {
    return CloudSun // Parcialmente nublado
  }

  if ([1006, 1009].includes(conditionCode)) {
    return Cloud // Nublado
  }

  if ([1030, 1135, 1147].includes(conditionCode)) {
    return CloudFog // Neblina
  }

  if ([1063, 1150, 1153, 1180, 1183, 1240].includes(conditionCode)) {
    return CloudDrizzle // Chuva leve
  }

  if ([1186, 1189, 1192, 1195, 1243, 1246].includes(conditionCode)) {
    return CloudRain // Chuva moderada a forte
  }

  if ([1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225].includes(conditionCode)) {
    return CloudSnow // Neve
  }

  if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
    return CloudLightning // Tempestade
  }

  if ([1237, 1261, 1264].includes(conditionCode)) {
    return Snowflake // Granizo
  }

  return Cloud // Padrão
}

// Mapeamento de classes de background usando Tailwind
export function getWeatherBackground(conditionCode: number): string {
  if (conditionCode === 1000) {
    return "bg-gradient-to-br from-yellow-400 to-orange-500" // Ensolarado
  }

  if (conditionCode === 1003) {
    return "bg-gradient-to-br from-blue-400 to-sky-500" // Parcialmente nublado
  }

  if ([1006, 1009].includes(conditionCode)) {
    return "bg-gradient-to-br from-slate-400 to-slate-600" // Nublado
  }

  if ([1030, 1135, 1147].includes(conditionCode)) {
    return "bg-gradient-to-br from-slate-300 to-slate-500" // Neblina
  }

  if ([1063, 1150, 1153, 1180, 1183, 1240].includes(conditionCode)) {
    return "bg-gradient-to-br from-sky-400 to-blue-600" // Chuva leve
  }

  if ([1186, 1189, 1192, 1195, 1243, 1246].includes(conditionCode)) {
    return "bg-gradient-to-br from-blue-500 to-blue-700" // Chuva moderada a forte
  }

  if ([1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225].includes(conditionCode)) {
    return "bg-gradient-to-br from-blue-100 to-blue-300" // Neve
  }

  if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
    return "bg-gradient-to-br from-slate-600 to-slate-800" // Tempestade
  }

  if ([1237, 1261, 1264].includes(conditionCode)) {
    return "bg-gradient-to-br from-gray-400 to-gray-600" // Granizo
  }

  return "bg-gradient-to-br from-sky-400 to-blue-500" // Padrão
}
