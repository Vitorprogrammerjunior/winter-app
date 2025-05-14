<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Weather extends Model
{
    protected $fillable = [
        'location',
        'temp_c',
        'temp_f',
        'condition',
        'icon',
        'humidity',
        'wind_kph',
        'last_updated'
    ];
}
