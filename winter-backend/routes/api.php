<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;

Route::middleware('api')->group(function () {
    Route::get('/weather/current', [WeatherController::class, 'current']);
    Route::get('/weather/forecast', [WeatherController::class, 'forecast']);

    // Rota de saúde da API
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toDateTimeString()
        ]);
    });
});
