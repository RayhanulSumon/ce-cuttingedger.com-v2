<?php

namespace App\Http\Middleware;

use App\Models\NotFoundLog;
use App\Models\Redirect;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectAndNotFoundMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();

        // 1. Enforce non-www URL structure via 301
        if (str_starts_with($host, 'www.')) {
            $nonWwwHost = substr($host, 4);
            $target = $request->getScheme().'://'.$nonWwwHost.$request->getRequestUri();

            return redirect()->to($target, 301);
        }

        $rawPath = '/'.ltrim(rtrim($request->getPathInfo(), '/'), '/');
        $rawPathLower = strtolower($rawPath);

        // 2. Check dynamic database redirects
        $redirect = Redirect::where('is_active', true)
            ->where(function ($query) use ($rawPath, $rawPathLower) {
                $query->where('source_path', $rawPath)
                    ->orWhere('source_path', $rawPathLower);
            })
            ->first();

        if ($redirect) {
            $redirect->increment('hit_count');
            $redirect->update(['last_hit_at' => now()]);

            if ($redirect->status_code === 410) {
                return response('410 Gone - This resource has been permanently removed.', 410);
            }

            if ($redirect->status_code === 403) {
                return response('403 Forbidden', 403);
            }

            if ($redirect->status_code === 404) {
                abort(404);
            }

            return redirect()->to($redirect->target_url, $redirect->status_code);
        }

        // 3. Regex redirect fallback
        $regexRedirects = Redirect::where('is_active', true)->where('is_regex', true)->get();
        foreach ($regexRedirects as $r) {
            if (@preg_match($r->source_path, $rawPath)) {
                $r->increment('hit_count');
                $r->update(['last_hit_at' => now()]);
                $target = preg_replace($r->source_path, $r->target_url, $rawPath);

                return redirect()->to($target, $r->status_code);
            }
        }

        $response = $next($request);

        // 4. Log 404s for Admin 404-to-301 manager
        if ($response->getStatusCode() === 404 && ! $request->is('build/*', 'storage/*', 'images/*', 'favicon*', 'hot')) {
            try {
                $log = NotFoundLog::firstOrNew(['path' => $rawPath]);
                $log->hit_count = ($log->hit_count ?? 0) + 1;
                $log->referrer = substr($request->headers->get('referer', ''), 0, 1000);
                $log->ip_address = $request->ip();
                $log->user_agent = substr($request->userAgent() ?? '', 0, 500);
                $log->last_seen_at = now();
                $log->save();
            } catch (\Throwable $e) {
                // Silently bypass on logging failure
            }
        }

        return $response;
    }
}
