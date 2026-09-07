<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <script>
            (function () {
                try {
                    var raw = localStorage.getItem('theme-settings');
                    var s = raw ? JSON.parse(raw) : {};
                    var root = document.documentElement;
                    var colors = { blue: '59 130 246', purple: '168 85 247', green: '34 197 94', orange: '249 115 22', red: '239 68 68', cyan: '6 182 212' };
                    var accents = { blue: '99 102 241', purple: '192 132 252', green: '74 222 128', orange: '251 146 60', red: '248 113 113', cyan: '34 211 238' };
                    var colorKey = s.colorKey || 'blue';

                    if (s.mode === 'dark') root.classList.add('dark');
                    root.setAttribute('dir', s.direction || 'ltr');
                    root.setAttribute('data-sidebar-style', s.sidebarStyle || 'full');
                    root.setAttribute('data-container', s.container || 'full');
                    root.setAttribute('data-card-style', s.cardStyle || 'shadow');
                    root.style.setProperty('--theme-primary', colors[colorKey] || colors.blue);
                    root.style.setProperty('--theme-accent', accents[colorKey] || accents.blue);
                } catch (e) {}
            })();
        </script>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
