<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="light">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#f7f6f4">
        <meta name="robots" content="noindex, nofollow">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'CuttingEdger') }}</title>

        <!-- Brand Favicons -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" sizes="any">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-dark-32x32.png?v=2" media="(prefers-color-scheme: light)">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-dark-16x16.png?v=2" media="(prefers-color-scheme: light)">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" media="(prefers-color-scheme: dark)">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" media="(prefers-color-scheme: dark)">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2">

        <!-- Fonts: Plus Jakarta Sans (UI) + Michroma (brand titles). Families are mapped in resources/css/app.css @theme -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Michroma&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">

        <script>
            (function() {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
            })();
        </script>

        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead

        @php
            $trackingScripts = \App\Models\TrackingScript::cachedByPlacement();
        @endphp

        <!-- Injected Head Tracking & Verification Scripts (Managed from Admin) -->
        {!! $trackingScripts['head'] !!}
    </head>
    <body class="bg-page text-ink antialiased">
        <!-- Injected Body Start Tracking Scripts (GTM noscript, etc.) -->
        {!! $trackingScripts['body_start'] !!}

        @inertia

        <!-- Injected Footer Tracking Scripts (Pixels, Chat, Analytics) -->
        {!! $trackingScripts['footer'] !!}
    </body>
</html>
