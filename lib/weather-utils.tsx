import {
  Sun,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Snowflake,
  type LucideIcon,
} from "lucide-react"

export function getWeatherIcon(conditionCode: number): LucideIcon {
  // Códigos baseados na API WeatherAPI.com
  // Ensolarado
  if (conditionCode === 1000) return Sun

  // Parcialmente nublado
  if ([1003].includes(conditionCode)) return CloudSun

  // Nublado
  if ([1006, 1009].includes(conditionCode)) return Cloud

  // Neblina
  if ([1030, 1135, 1147].includes(conditionCode)) return CloudFog

  // Chuva leve
  if ([1063, 1150, 1153, 1180, 1183, 1240].includes(conditionCode)) return CloudDrizzle

  // Chuva moderada a forte
  if ([1186, 1189, 1192, 1195, 1243, 1246].includes(conditionCode)) return CloudRain

  // Neve
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(conditionCode)) return CloudSnow

  // Tempestade
  if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) return CloudLightning

  // Ventos fortes
  if ([1030, 1117].includes(conditionCode)) return Wind

  // Granizo
  if ([1237, 1261, 1264].includes(conditionCode)) return Snowflake

  // Padrão
  return Cloud
}

export function getWeatherBackground(conditionCode: number): string {
  // Ensolarado
  if (conditionCode === 1000) {
    return "bg-gradient-to-br from-yellow-400 to-orange-500"
  }

  // Parcialmente nublado
  if ([1003].includes(conditionCode)) {
    return "bg-gradient-to-br from-blue-400 to-sky-500"
  }

  // Nublado
  if ([1006, 1009].includes(conditionCode)) {
    return "bg-gradient-to-br from-slate-400 to-slate-600"
  }

  // Neblina
  if ([1030, 1135, 1147].includes(conditionCode)) {
    return "bg-gradient-to-br from-slate-300 to-slate-500"
  }

  // Chuva leve
  if ([1063, 1150, 1153, 1180, 1183, 1240].includes(conditionCode)) {
    return "bg-gradient-to-br from-sky-400 to-blue-600"
  }

  // Chuva moderada a forte
  if ([1186, 1189, 1192, 1195, 1243, 1246].includes(conditionCode)) {
    return "bg-gradient-to-br from-blue-500 to-blue-700"
  }

  // Neve
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(conditionCode)) {
    return "bg-gradient-to-br from-blue-100 to-blue-300"
  }

  // Tempestade
  if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
    return "bg-gradient-to-br from-slate-600 to-slate-800"
  }

  // Padrão
  return "bg-gradient-to-br from-sky-400 to-blue-500"
}
