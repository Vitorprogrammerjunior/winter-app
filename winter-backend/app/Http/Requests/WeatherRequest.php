<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WeatherRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'lat'  => 'required|numeric',
            'lon'  => 'required|numeric',
            'dias' => 'sometimes|integer|min:1|max:10',
            
        ];
    }

    public function messages(): array
    {
        return [
            'lat.required' => 'Latitude é obrigatória.',
            'lon.required' => 'Longitude é obrigatória.',
        ];
    }
}
