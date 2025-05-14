<?php

namespace App\Http\Controllers;

use App\Http\Requests\WeatherRequest;
use App\Services\WeatherApiService;
use Illuminate\Http\JsonResponse;

class WeatherController extends Controller
{
    public function __construct(private WeatherApiService $weatherApi) {}

    public function getWeather(WeatherRequest $request): JsonResponse
    {
        $lat  = $request->input('lat');
        $lon  = $request->input('lon');
        $dias = $request->input('dias', 3);

        try {
            $current  = $this->weatherApi->getCurrent($lat, $lon);
            $forecast = $this->weatherApi->getForecast($lat, $lon, $dias);

            return response()->json([
                'sucesso' => true,
                'dados'   => [
                    'atual'    => $current,
                    'previsao' => $forecast,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'sucesso' => false,
                'erro'    => $e->getMessage(),
            ], 400);
        }
    }
}
