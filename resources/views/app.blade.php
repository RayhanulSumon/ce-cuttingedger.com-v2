<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#0a0b0e">

        <title inertia>{{ config('app.name', 'CuttingEdger') }}</title>

        <!-- Google Fonts: Roboto & Roboto Condensed + Antonio + Bebas Neue + Plus Jakarta Sans + Space Grotesk -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Antonio:wght@600;700&family=Bebas+Neue&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Roboto+Condensed:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,300..800;1,300..800&family=Space+Grotesk:wght@500;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">

        <!-- Anti-FOUC theme detector -->
        <script>
            (function() {
                try {
                    const savedTheme = localStorage.getItem('cuttingedger_theme');
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (savedTheme === 'light') {
                        document.documentElement.classList.remove('dark');
                        document.documentElement.classList.add('light');
                    } else if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                        document.documentElement.classList.remove('light');
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.add('dark');
                    }
                } catch (e) {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>

        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="bg-[#0b0c0e] text-[#f4f5f8] antialiased selection:bg-[#d4ff00] selection:text-black transition-colors duration-300">
        @inertia
    </body>
</html>
