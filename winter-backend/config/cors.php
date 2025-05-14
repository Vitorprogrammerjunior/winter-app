<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'weather'],   // inclua o seu endpoint /weather
    'allowed_methods' => ['*'],        // todas as methods: GET, POST…
    'allowed_origins' => ['http://localhost:3000'], // origem do seu front
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],        // qualquer header (Accept, Content-Type…)
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
