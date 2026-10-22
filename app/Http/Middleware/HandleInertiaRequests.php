<?php

namespace App\Http\Middleware;

use App\Models\ChatConsultation;
use App\Models\ContactMessage;
use App\Models\FreeTrialRequest;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'settings' => [
                'brand_name' => config('app.name', 'CUTTING EDGER'),
                'tagline' => 'Crafting digital supremacy through kinetic engineering and radical design.',
                'contact_email' => 'hello@cuttingedger.com',
                'contact_phone' => '+1 (800) 555-EDGE',
                'office_address' => '742 Mission St, Design District, San Francisco, CA',
                'socials' => [
                    'twitter' => 'https://twitter.com',
                    'instagram' => 'https://instagram.com',
                    'linkedin' => 'https://linkedin.com',
                    'github' => 'https://github.com',
                    'dribbble' => 'https://dribbble.com',
                ],
            ],
            'auth' => [
                'user' => fn () => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'status' => $request->user()->status,
                    'role' => $request->user()->role?->name,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'admin_badges' => fn () => $request->user()?->isAdmin() ? [
                'pending_consultations' => ChatConsultation::where('status', 'pending')->count(),
                'pending_trials' => FreeTrialRequest::where('status', 'pending')->count(),
                'unread_leads' => ContactMessage::where('inquiry_type', 'chat_lead')->where('status', 'new')->count(),
                'new_messages' => ContactMessage::where('inquiry_type', '!=', 'chat_lead')->where('status', 'new')->count(),
            ] : null,
        ];
    }
}
