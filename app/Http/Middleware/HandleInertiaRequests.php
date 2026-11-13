<?php

namespace App\Http\Middleware;

use App\Models\Capability;
use App\Models\ChatConsultation;
use App\Models\ContactMessage;
use App\Models\Order;
use App\Models\Setting;
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
        $dbSettings = [];
        try {
            $dbSettings = Setting::pluck('value', 'key')->all();
        } catch (\Throwable $e) {
            // Silently fallback if db is migrating
        }

        $phones = Setting::parsePhones($dbSettings['contact_phones'] ?? 'USA | +1 (409) 995-2565');

        return [
            ...parent::share($request),
            'settings' => [
                'brand_name' => $dbSettings['brand_name'] ?? config('app.name', 'Cutting Edger'),
                'tagline' => $dbSettings['tagline'] ?? 'AI-Driven Visual Performance & Post-Production Agency.',
                'contact_email' => $dbSettings['contact_email'] ?? 'hello@cuttingedger.com',
                'contact_phones' => $phones,
                'contact_phone' => $phones[0]['number'] ?? '',
                'whatsapp_number' => $dbSettings['whatsapp_number'] ?? '',
                'office_address' => $dbSettings['office_address'] ?? 'Artisan Center, Level-7, House# 57/9, West Panthapath, Dhaka 1215',
                'calendly_url' => $dbSettings['calendly_url'] ?? 'https://calendly.com/cuttingedger/discovery-call',
                'socials' => [
                    'twitter' => 'https://twitter.com/cutting_edger',
                    'instagram' => 'https://instagram.com/cuttingedgerinc',
                    'linkedin' => 'https://linkedin.com/company/cutting-edger',
                    'facebook' => 'https://facebook.com/CuttingEdgerInc',
                    'youtube' => 'https://youtube.com/channel/UCJS-gaoOogk-552jQfRYPBQ',
                ],
            ],
            'auth' => [
                'user' => fn () => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'company' => $request->user()->company,
                    'phone' => $request->user()->phone,
                    'avatar' => $request->user()->avatar,
                    'email_verified_at' => $request->user()->email_verified_at?->toISOString(),
                    'status' => $request->user()->status,
                    'role' => $request->user()->getRoleNames()->first() ?? $request->user()->role?->name,
                    'permissions' => $request->user()->getAllPermissions()->pluck('name')->values()->all(),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'admin_badges' => fn () => $request->user()?->isAdmin() ? [
                'pending_orders' => Order::where('status', 'pending')->count(),
                'pending_consultations' => ChatConsultation::where('status', 'pending')->count(),
                'unread_leads' => ContactMessage::where('inquiry_type', 'chat_lead')->where('status', 'new')->count(),
                'new_messages' => ContactMessage::where('inquiry_type', '!=', 'chat_lead')->where('status', 'new')->count(),
            ] : null,
            'capabilities_nav' => function () {
                try {
                    return Capability::active()->main()
                        ->with(['children' => fn ($query) => $query->active()])
                        ->orderBy('sort_order')
                        ->get()
                        ->map(fn (Capability $main) => [
                            'id' => $main->id,
                            'title' => $main->title,
                            'tag' => $main->tag,
                            'slug' => $main->slug,
                            'path' => $main->path,
                            'subtitle' => $main->subtitle,
                            'icon' => $main->icon,
                            'children' => $main->children->map(fn (Capability $child) => [
                                'id' => $child->id,
                                'title' => $child->title,
                                'slug' => $child->slug,
                                'path' => $child->path,
                                'subtitle' => $child->subtitle,
                                'icon' => $child->icon,
                            ])->values()->all(),
                        ])->values()->all();
                } catch (\Throwable) {
                    return [];
                }
            },
        ];
    }
}
