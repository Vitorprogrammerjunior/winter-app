<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('weather', function (Blueprint $table) {
            $table->id(); // Coluna ID auto-incremento
            $table->string('location'); // Localização/cidade
            $table->decimal('temp_c', 5, 2); // Temperatura em Celsius
            $table->decimal('temp_f', 5, 2); // Temperatura em Fahrenheit
            $table->string('condition'); // Condição climática
            $table->string('icon'); // Ícone do clima
            $table->integer('humidity'); // Umidade percentual
            $table->decimal('wind_kph', 5, 2); // Velocidade do vento
            $table->string('last_updated'); // Última atualização
            $table->timestamps(); // created_at e updated_at

            // Índices para melhor performance
            $table->index('location');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('weather');
    }
};
