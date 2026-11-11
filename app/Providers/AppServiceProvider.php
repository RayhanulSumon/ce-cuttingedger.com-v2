<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (request()->isSecure() || request()->header('x-forwarded-proto') === 'https' || (app()->isProduction() && str_starts_with((string) config('app.url'), 'https://'))) {
            URL::forceScheme('https');
        }

        $requestHost = request()->getHost();
        $configuredHost = parse_url((string) config('app.url'), PHP_URL_HOST);

        if ($requestHost !== $configuredHost || filter_var($requestHost, FILTER_VALIDATE_IP) || (int) request()->server('SERVER_PORT') === 8000) {
            Vite::useHotFile(storage_path('framework/lan-bypass.hot'));
        }

        RateLimiter::for('public-contact', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip())->response(function () {
                return back()->with('error', 'Too many inquiries sent. Please wait a moment before trying again.');
            });
        });

        RateLimiter::for('team-inquiry', function (Request $request) {
            return Limit::perMinute(3)->by($request->ip())->response(function () {
                return back()->with('error', 'Please wait before dispatching another message to this team member.');
            });
        });

        RateLimiter::for('newsletter', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
