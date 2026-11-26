<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'pusher' => [
        'app_id' => env('PUSHER_APP_ID'),
        'key' => env('PUSHER_APP_KEY'),
        'secret' => env('PUSHER_APP_SECRET'),
        'cluster' => env('PUSHER_APP_CLUSTER', 'mt1'),
        'encrypted' => env('PUSHER_ENCRYPTED', true),
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI', '/auth/google/callback'),
    ],

    'vertex_ai' => [
        'driver' => env('AI_PREVIEW_DRIVER', 'vertex'),
        'credentials_path' => env('VERTEX_AI_CREDENTIALS_PATH', storage_path('google-vertex.key')),
        'location' => env('VERTEX_AI_LOCATION', 'us-central1'),
        'model' => env('VERTEX_AI_IMAGE_MODEL', 'gemini-2.5-flash-image'),
        'preview_limit' => (int) env('AI_PREVIEW_FREE_LIMIT', 2),
    ],

    'fal' => [
        'key' => env('FAL_KEY'),
        'queue_base_url' => env('FAL_QUEUE_BASE_URL', 'https://queue.fal.run'),
        'jwks_url' => env('FAL_JWKS_URL', 'https://rest.alpha.fal.ai/.well-known/jwks.json'),
        'bg_remove_model' => env('FAL_BG_REMOVE_MODEL', 'fal-ai/bria/background/remove'),
        'bg_remove_cost_usd' => (float) env('FAL_BG_REMOVE_COST_USD', 0.0180),
        'try_on_model' => env('FAL_TRY_ON_MODEL', 'fal-ai/fashn/tryon/v1.6'),
        'try_on_cost_usd' => (float) env('FAL_TRY_ON_COST_USD', 0.0750),
    ],

    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

];
