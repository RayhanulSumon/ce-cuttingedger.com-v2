<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Password as PasswordBroker;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ClientAuthController extends Controller
{
    /**
     * Show the client login page.
     */
    public function showLogin(Request $request): Response|RedirectResponse
    {
        if ($request->filled('redirect')) {
            $redirect = (string) $request->query('redirect');
            if (str_starts_with($redirect, '/')) {
                $request->session()->put('url.intended', url($redirect));
            }
        }

        if (Auth::check()) {
            $user = Auth::user();
            if ($user->isAdmin()) {
                return redirect()->intended(route('admin.dashboard'));
            }
            if (! $user->hasVerifiedEmail()) {
                return redirect()->route('verification.notice');
            }

            return redirect()->intended(route('client.portal'));
        }

        return Inertia::render('Auth/Login', [
            'intendedUrl' => $request->session()->get('url.intended'),
            'googleEnabled' => $this->isGoogleConfigured(),
        ]);
    }

    /**
     * Authenticate a client via email & password.
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $remember = $request->boolean('remember', true);

        if (! Auth::attempt($credentials, $remember)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $user = Auth::user();

        if (! $user->isActive()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            throw ValidationException::withMessages([
                'email' => 'This account has been suspended. Please contact support.',
            ]);
        }

        $user->forceFill(['last_login_at' => now()])->save();
        $request->session()->regenerate();

        // Link any prior orders with matching email to this user account
        Order::whereNull('user_id')
            ->where('client_email', strtolower($user->email))
            ->update(['user_id' => $user->id]);

        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard'));
        }

        if (! $user->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }

        return redirect()->intended(route('client.portal'));
    }

    /**
     * Show the client registration form.
     */
    public function showRegister(Request $request): Response|RedirectResponse
    {
        if ($request->filled('redirect')) {
            $redirect = (string) $request->query('redirect');
            if (str_starts_with($redirect, '/')) {
                $request->session()->put('url.intended', url($redirect));
            }
        }

        if (Auth::check()) {
            return redirect()->intended(route('client.portal'));
        }

        return Inertia::render('Auth/Register', [
            'intendedUrl' => $request->session()->get('url.intended'),
            'googleEnabled' => $this->isGoogleConfigured(),
        ]);
    }

    /**
     * Handle client registration and send email verification link.
     */
    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'company' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $userRole = Role::firstOrCreate(['name' => 'user']);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'company' => $validated['company'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role_id' => $userRole->id,
            'status' => 'active',
            'last_login_at' => now(),
        ]);

        // Link any prior orders with matching email
        Order::whereNull('user_id')
            ->where('client_email', $user->email)
            ->update(['user_id' => $user->id]);

        try {
            event(new Registered($user));
        } catch (\Throwable $e) {
            report($e);
        }

        Auth::login($user, true);

        return redirect()->route('verification.notice')->with(
            'success',
            'Account created! Please check your email inbox for the verification link to continue.'
        );
    }

    /**
     * Display the email verification prompt.
     */
    public function verifyNotice(Request $request): Response|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('client.portal'));
        }

        return Inertia::render('Auth/VerifyEmail', [
            'intendedUrl' => $request->session()->get('url.intended'),
        ]);
    }

    /**
     * Mark the authenticated user's email address as verified.
     */
    public function verifyEmail(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('client.portal'));
        }

        $request->fulfill();

        return redirect()->intended(route('client.portal'))->with(
            'success',
            'Your email has been verified! Welcome to your CuttingEdger Client Portal.'
        );
    }

    /**
     * Resend the email verification notification.
     */
    public function resendVerification(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('client.portal'));
        }

        try {
            $request->user()->sendEmailVerificationNotification();
        } catch (\Throwable $e) {
            report($e);

            return back()->with('error', 'Unable to send verification email right now. Please check mail settings.');
        }

        return back()->with('success', 'A fresh verification link has been sent to your email address.');
    }

    /**
     * Redirect the user to Google's OAuth 2.0 authentication page.
     */
    public function redirectToGoogle(Request $request): RedirectResponse
    {
        if ($request->filled('redirect')) {
            $redirect = (string) $request->query('redirect');
            if (str_starts_with($redirect, '/')) {
                $request->session()->put('url.intended', url($redirect));
            }
        }

        [$clientId, $clientSecret, $redirectUri] = $this->getGoogleConfig();

        if (! $clientId || ! $clientSecret) {
            return redirect()->route('login')->with(
                'error',
                'Google Sign-In is not configured yet. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env or sign in with email.'
            );
        }

        $state = Str::random(40);
        $request->session()->put('google_oauth_state', $state);

        $query = http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'access_type' => 'online',
            'prompt' => 'select_account',
            'state' => $state,
        ]);

        return redirect()->away("https://accounts.google.com/o/oauth2/v2/auth?{$query}");
    }

    /**
     * Handle Google OAuth 2.0 callback, create/update verified user, and sign in.
     */
    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        $expectedState = $request->session()->pull('google_oauth_state');
        if (! $expectedState || $request->query('state') !== $expectedState) {
            return redirect()->route('login')->with('error', 'Invalid Google authentication state. Please try again.');
        }

        if ($request->filled('error') || ! $request->filled('code')) {
            return redirect()->route('login')->with('error', 'Google sign-in was cancelled.');
        }

        [$clientId, $clientSecret, $redirectUri] = $this->getGoogleConfig();

        $tokenResponse = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri' => $redirectUri,
            'grant_type' => 'authorization_code',
            'code' => (string) $request->query('code'),
        ]);

        if (! $tokenResponse->successful()) {
            return redirect()->route('login')->with('error', 'Failed to exchange Google authorization code.');
        }

        $accessToken = $tokenResponse->json('access_token');
        $userResponse = Http::withToken((string) $accessToken)->get('https://www.googleapis.com/oauth2/v3/userinfo');

        if (! $userResponse->successful()) {
            return redirect()->route('login')->with('error', 'Unable to fetch your Google profile.');
        }

        $googleProfile = $userResponse->json();
        $googleId = (string) ($googleProfile['sub'] ?? '');
        $email = strtolower(trim((string) ($googleProfile['email'] ?? '')));
        $name = (string) ($googleProfile['name'] ?? Str::before($email, '@'));
        $avatar = $googleProfile['picture'] ?? null;

        if (! $email || ! $googleId) {
            return redirect()->route('login')->with('error', 'Google did not return a valid email address.');
        }

        $userRole = Role::firstOrCreate(['name' => 'user']);

        $user = User::where('google_id', $googleId)
            ->orWhere('email', $email)
            ->first();

        if ($user) {
            if (! $user->isActive()) {
                return redirect()->route('login')->with('error', 'This account has been suspended.');
            }

            $user->forceFill([
                'google_id' => $googleId,
                'avatar' => $avatar ?: $user->avatar,
                'email_verified_at' => $user->email_verified_at ?? now(),
                'last_login_at' => now(),
            ])->save();
        } else {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'avatar' => $avatar,
                'password' => Hash::make(Str::random(32)),
                'role_id' => $userRole->id,
                'status' => 'active',
                'email_verified_at' => now(),
                'last_login_at' => now(),
            ]);
        }

        Order::whereNull('user_id')
            ->where('client_email', $user->email)
            ->update(['user_id' => $user->id]);

        Auth::login($user, true);
        $request->session()->regenerate();

        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->intended(route('client.portal'))->with(
            'success',
            "Signed in as {$user->name}!"
        );
    }

    /**
     * Log the client out.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Show the forgot password request form (used by both Clients and Admins).
     */
    public function showForgotPassword(Request $request): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'from' => (string) $request->query('from', 'client'),
        ]);
    }

    /**
     * Send a password reset link to the given user's email.
     */
    public function sendResetLinkEmail(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        try {
            $status = PasswordBroker::sendResetLink($request->only('email'));
        } catch (\Throwable $e) {
            report($e);

            return back()->with('error', 'Unable to send password reset email right now. Please check mail settings.');
        }

        if ($status === PasswordBroker::RESET_LINK_SENT) {
            return back()->with('success', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    /**
     * Display the password reset view for the given token.
     */
    public function showResetPassword(Request $request, string $token): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => (string) $request->query('email', ''),
        ]);
    }

    /**
     * Handle an incoming new password request.
     */
    public function resetPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $status = PasswordBroker::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === PasswordBroker::PASSWORD_RESET) {
            $user = User::where('email', strtolower(trim((string) $request->input('email'))))->first();

            if ($user && $user->isAdmin()) {
                return redirect()->route('admin.login')->with(
                    'success',
                    'Your password has been reset! You can now sign in to the Admin Portal.'
                );
            }

            return redirect()->route('login')->with(
                'success',
                'Your password has been reset! You can now sign in with your new password.'
            );
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    /**
     * Resolve Google OAuth credentials from config or settings table.
     *
     * @return array{0: string, 1: string, 2: string}
     */
    private function getGoogleConfig(): array
    {
        $clientId = (string) (config('services.google.client_id') ?: Setting::where('key', 'google_client_id')->value('value') ?: '');
        $clientSecret = (string) (config('services.google.client_secret') ?: Setting::where('key', 'google_client_secret')->value('value') ?: '');
        $redirectConfig = (string) config('services.google.redirect', '/auth/google/callback');
        $redirectUri = str_starts_with($redirectConfig, 'http') ? $redirectConfig : url($redirectConfig);

        return [$clientId, $clientSecret, $redirectUri];
    }

    private function isGoogleConfigured(): bool
    {
        [$clientId, $clientSecret] = $this->getGoogleConfig();

        return $clientId !== '' && $clientSecret !== '';
    }
}
