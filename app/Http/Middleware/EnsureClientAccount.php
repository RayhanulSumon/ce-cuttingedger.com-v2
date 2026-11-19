<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureClientAccount
{
    /**
     * Restrict client portal and order submission routes to non-admin client accounts.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->isAdmin()) {
            return redirect()->route('login')->with(
                'error',
                'Please sign in with a client account. Admin accounts cannot access the Client Portal or submit client orders.'
            );
        }

        return $next($request);
    }
}
