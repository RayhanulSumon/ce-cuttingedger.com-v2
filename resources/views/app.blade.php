<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="light">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#ffffff">
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

        <!-- Modern Luxury Tech Fonts: Plus Jakarta Sans, Outfit, Inter, Space Grotesk, Roboto -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Michroma&family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Roboto:wght@400;500;700;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&display=swap" rel="stylesheet">

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

        <!-- Injected Head Tracking & Verification Scripts (Managed from Admin) -->
        @php
            try {
                $headScripts = \App\Models\TrackingScript::active()->where('placement', 'head')->pluck('code')->implode("\n");
            } catch (\Throwable $e) {
                $headScripts = '';
            }
        @endphp
        {!! $headScripts !!}
    </head>
    <body class="bg-[#f8f9fc] text-[#16191f] antialiased selection:bg-[#f5761a] selection:text-white transition-colors duration-300">
        <!-- Injected Body Start Tracking Scripts (GTM noscript, etc.) -->
        @php
            try {
                $bodyStartScripts = \App\Models\TrackingScript::active()->where('placement', 'body_start')->pluck('code')->implode("\n");
            } catch (\Throwable $e) {
                $bodyStartScripts = '';
            }
        @endphp
        {!! $bodyStartScripts !!}

        @inertia

        <!-- Injected Footer Tracking Scripts (Pixels, Chat, Analytics) -->
        @php
            try {
                $footerScripts = \App\Models\TrackingScript::active()->where('placement', 'footer')->pluck('code')->implode("\n");
            } catch (\Throwable $e) {
                $footerScripts = '';
            }
        @endphp
        {!! $footerScripts !!}
    </body>
</html>
