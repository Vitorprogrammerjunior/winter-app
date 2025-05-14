<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\JsonResponse;

class WeatherApiService
{
    protected string $key;
    protected string $baseUrl;

    public function __construct()
    {
        $this->key = config('services.weatherapi.key');
        $this->baseUrl = rtrim(config('services.weatherapi.base_url'), '/');
    }

    public function getWeather(array $input): JsonResponse
    {
        try {
            $dias = $input['dias'] ?? 3;

            if (!empty($input['cidade'])) {
                $matches = $this->searchCities($input['cidade']);

                // Filtra cidades do ES e depois do Brasil
                $esCities = array_filter($matches, fn($c) => stripos($c['region'] ?? '', 'Espírito Santo') !== false);
                $brCities = array_filter($matches, fn($c) => stripos($c['country'] ?? '', 'Brazil') !== false);

                $loc = !empty($esCities) ? reset($esCities) : (
                    !empty($brCities) ? reset($brCities) : reset($matches)
                );

                if (empty($loc)) {
                    throw new \Exception("Nenhuma localização encontrada para '{$input['cidade']}'");
                }

                $lat = $loc['lat'] ?? null;
                $lon = $loc['lon'] ?? null;
            } else {
                $lat = $input['lat'] ?? null;
                $lon = $input['lon'] ?? null;
            }

            if (!$lat || !$lon) {
                throw new \Exception("Coordenadas inválidas");
            }

            $current = $this->getCurrent($lat, $lon);
            $forecast = $this->getForecast($lat, $lon, $dias);

            return response()->json([
                'sucesso' => true,
                'dados' => [
                    'atual' => $current,
                    'previsao' => $forecast,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'sucesso' => false,
                'erro' => $e->getMessage()
            ], 400);
        }
    }

    public function getCurrent(float $lat, float $lon): array
    {
        $q = "{$lat},{$lon}";

        return Cache::remember("weatherapi_current_{$q}", now()->addMinutes(10), function() use ($q) {
            $resp = Http::timeout(5)
                ->get("{$this->baseUrl}/current.json", [
                    'key' => $this->key,
                    'q' => $q,
                    'lang' => 'pt'
                ]);

            if ($resp->failed()) {
                $error = $resp->json()['error']['message'] ?? $resp->body();
                throw new \Exception("Erro na API: " . $error);
            }

            $data = $resp->json();

            return [
                'cidade' => $data['location']['name'] ?? 'N/A',
                'pais' => $data['location']['country'] ?? 'N/A',
                'atualizado_em' => $data['location']['localtime'] ?? now()->format('Y-m-d H:i'),
                'condicoes' => [
                    'temperatura' => $data['current']['temp_c'] ?? 0,
                    'condicao_texto' => $data['current']['condition']['text'] ?? 'Desconhecido',
                    'icone' => $data['current']['condition']['icon'] ?? '',
                    'umidade' => $data['current']['humidity'] ?? 0,
                    'vento_kph' => $data['current']['wind_kph'] ?? 0,
                    'direcao_vento' => $data['current']['wind_dir'] ?? 'N/D',
                    'pressao_mb' => $data['current']['pressure_mb'] ?? 0,
                    'sensacao_termica' => $data['current']['feelslike_c'] ?? 0,
                    'indice_uv' => $data['current']['uv'] ?? 0, // Adicionar esta linha
                ]
            ];
        });
    }

    public function getForecast(float $lat, float $lon, int $days = 3): array
    {
        $q = "{$lat},{$lon}";

        return Cache::remember("weatherapi_forecast_{$q}_{$days}", now()->addHour(), function() use ($q, $days) {
            $resp = Http::timeout(5)
                ->get("{$this->baseUrl}/forecast.json", [
                    'key' => $this->key,
                    'q' => $q,
                    'days' => $days,
                    'lang' => 'pt'
                ]);

            if ($resp->failed()) {
                $error = $resp->json()['error']['message'] ?? $resp->body();
                throw new \Exception("Erro na previsão: " . $error);
            }

            $data = $resp->json();

            return array_map(function($day) {
                return [
                    'data' => $day['date'] ?? now()->format('Y-m-d'),
                    'condicao' => $day['day']['condition']['text'] ?? 'Desconhecido',
                    'icone' => $day['day']['condition']['icon'] ?? '',
                    'temp_min' => $day['day']['mintemp_c'] ?? 0,
                    'temp_max' => $day['day']['maxtemp_c'] ?? 0,
                    'chance_chuva' => $day['day']['daily_chance_of_rain'] ?? 0,
                    'precipitacao_mm' => $day['day']['totalprecip_mm'] ?? 0,
                    'indice_uv' => $day['day']['uv'] ?? 0, // Adicionar esta linha
                ];
            }, $data['forecast']['forecastday'] ?? []);
        });
    }

    public function searchCities(string $query): array
    {
        try {
            $resp = Http::timeout(5)
                ->get("{$this->baseUrl}/search.json", [
                    'key' => $this->key,
                    'q' => $query,
                    'lang' => 'pt',
                    'aqi' => 'yes', // Adicionar esta linha
                    'alerts' => 'yes' // Adicionar esta linha
                ]);

            if ($resp->failed()) {
                return [];
            }

            return $resp->json() ?? [];

        } catch (\Exception $e) {
            return [];
        }
    }
}
