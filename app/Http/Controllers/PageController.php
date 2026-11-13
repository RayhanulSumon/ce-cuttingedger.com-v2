<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Faq;
use App\Models\PricingPlan;
use App\Models\Setting;
use App\Models\TeamMember;
use App\Services\Catalog\CatalogCacheService;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display studio philosophy & about page.
     */
    public function about(): Response
    {
        $leadership = TeamMember::where('featured', true)->take(4)->get();
        $clients = Client::orderBy('sort_order')->take(8)->get();

        return Inertia::render('About', [
            'leadership' => $leadership,
            'clients' => $clients,
        ]);
    }

    /**
     * Display transparent engagement pricing.
     */
    public function pricing(): Response
    {
        $plans = PricingPlan::orderBy('sort_order')->get();
        $faqs = Faq::where('category', 'Financials')->orWhere('category', 'General')->take(4)->get();

        return Inertia::render('Pricing', [
            'plans' => $plans,
            'faqs' => $faqs,
        ]);
    }

    /**
     * Display the full Digital Twins catalogue backed by the cached database catalog.
     */
    public function digitalTwins(): Response
    {
        return Inertia::render('DigitalTwins/Index', [
            'digitalTwins' => CatalogCacheService::getAllDigitalTwins(),
        ]);
    }

    /**
     * Display dedicated Thank You page with Calendly booking embed.
     */
    public function thankYou(): Response
    {
        return Inertia::render('ThankYou');
    }

    /**
     * Display Cookie Policy compliance page.
     */
    public function cookiePolicy(): Response
    {
        return Inertia::render('Legal/CookiePolicy');
    }

    /**
     * Display NDA & Client Confidentiality compliance page.
     */
    public function ndaCompliance(): Response
    {
        return Inertia::render('Trust/NdaCompliance');
    }

    /**
     * Display ESG (Environmental, Social, Governance) Policy page.
     */
    public function esgPolicy(): Response
    {
        return Inertia::render('Trust/EsgPolicy');
    }

    /**
     * Display privacy policy.
     */
    public function privacy(): Response
    {
        return Inertia::render('Privacy');
    }

    /**
     * Display terms of service.
     */
    public function terms(): Response
    {
        return Inertia::render('Terms');
    }

    /**
     * Generate dynamic robots.txt from admin settings.
     */
    public function robots(): HttpResponse
    {
        $content = Setting::where('key', 'robots_txt_content')->value('value');

        if (! $content) {
            $content = "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /thank-you\n\nSitemap: ".url('/sitemap.xml')."\n";
        }

        return response($content, 200)
            ->header('Content-Type', 'text/plain');
    }
}
