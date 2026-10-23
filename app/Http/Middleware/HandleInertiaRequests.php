<?php

namespace App\Http\Middleware;

use App\Models\ChatConsultation;
use App\Models\ContactMessage;
use App\Models\Order;
use App\Models\Service;
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

        return [
            ...parent::share($request),
            'settings' => [
                'brand_name' => $dbSettings['brand_name'] ?? config('app.name', 'Cutting Edger'),
                'tagline' => $dbSettings['tagline'] ?? 'AI-Driven Visual Performance & Post-Production Agency.',
                'contact_email' => $dbSettings['contact_email'] ?? 'hello@cuttingedger.com',
                'contact_phone' => $dbSettings['contact_phone'] ?? '+1 (409) 995-2565',
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
                    'status' => $request->user()->status,
                    'role' => $request->user()->role?->name,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'admin_badges' => fn () => $request->user()?->isAdmin() ? [
                'pending_orders' => Order::where('status', 'pending')->where('payment_status', '!=', 'free_trial')->count(),
                'pending_consultations' => ChatConsultation::where('status', 'pending')->count(),
                'pending_trials' => Order::where('status', 'pending')->where('payment_status', 'free_trial')->count(),
                'unread_leads' => ContactMessage::where('inquiry_type', 'chat_lead')->where('status', 'new')->count(),
                'new_messages' => ContactMessage::where('inquiry_type', '!=', 'chat_lead')->where('status', 'new')->count(),
            ] : null,
            'services_nav' => function () {
                try {
                    return Service::whereNull('parent_id')
                        ->with(['children' => fn ($q) => $q->orderBy('sort_order')])
                        ->orderBy('sort_order')
                        ->get()
                        ->map(function (Service $pillar) {
                            $children = $pillar->children->map(function (Service $child) use ($pillar) {
                                return [
                                    'id' => $child->id,
                                    'title' => $child->title,
                                    'slug' => $child->slug,
                                    'path' => "/services/{$pillar->slug}/{$child->slug}",
                                    'subtitle' => $child->subtitle,
                                    'icon' => $child->icon ?: 'Sparkles',
                                ];
                            })->values()->all();

                            return [
                                'id' => $pillar->id,
                                'title' => $pillar->title,
                                'slug' => $pillar->slug,
                                'path' => "/services/{$pillar->slug}",
                                'subtitle' => $pillar->subtitle,
                                'icon' => $pillar->icon ?: 'Layers',
                                'accent_color' => $pillar->accent_color ?: '#d4ff00',
                                'children' => $children,
                            ];
                        })->values()->all();
                } catch (\Throwable $e) {
                    return [];
                }
            },
        ];
    }
}
