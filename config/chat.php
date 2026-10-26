<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Local LLM / Ollama Server Settings (Windows Server 128GB RAM CPU Host)
    |--------------------------------------------------------------------------
    */
    'llm' => [
        'base_url' => env('OLLAMA_BASE_URL', 'http://127.0.0.1:11434'),
        'model' => env('OLLAMA_MODEL', 'qwen2.5:7b'),
        'vision_model' => env('OLLAMA_VISION_MODEL', 'qwen2-vl:7b'),
        'timeout' => (int) env('OLLAMA_TIMEOUT', 60), // Generous ceiling for Xeon CPU token generation
        'max_tokens' => (int) env('OLLAMA_MAX_TOKENS', 1024),
        'temperature' => (float) env('OLLAMA_TEMPERATURE', 0.4),
        'enabled' => (bool) env('OLLAMA_ENABLED', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Fallback & Tool Settings
    |--------------------------------------------------------------------------
    */
    'fallback' => [
        'enabled' => true,
        'confidence_threshold' => 0.6,
    ],

    /*
    |--------------------------------------------------------------------------
    | Calendar Booking Configuration
    |--------------------------------------------------------------------------
    */
    'calendar' => [
        'mcp_endpoint' => env('MCP_CALENDAR_ENDPOINT', null),
        'slot_duration_minutes' => 30,
        'working_hours' => [
            'start' => '09:00',
            'end' => '18:00',
        ],
        'timezone' => env('APP_TIMEZONE', 'UTC'),
        'max_days_advance' => 14,
    ],

    /*
    |--------------------------------------------------------------------------
    | Session Inactivity & Follow-Up Rules
    |--------------------------------------------------------------------------
    */
    'follow_up' => [
        'idle_seconds' => (int) env('CHAT_IDLE_SECONDS', 120),
        'exit_intent_enabled' => true,
        'email_delay_minutes' => 30,
    ],
];
