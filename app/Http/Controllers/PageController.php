<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\PricingPlan;
use App\Models\TeamMember;
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

        return Inertia::render('About', [
            'leadership' => $leadership,
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
     * Display accessible FAQ page.
     */
    public function faq(): Response
    {
        $faqs = Faq::orderBy('sort_order')->get();
        $categories = Faq::select('category')->distinct()->pluck('category');

        return Inertia::render('Faq', [
            'faqs' => $faqs,
            'categories' => $categories,
        ]);
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
     * Generate dynamic robots.txt.
     */
    public function robots(): HttpResponse
    {
        $content = "User-agent: *\nAllow: /\nSitemap: ".url('/sitemap.xml')."\n";

        return response($content, 200)
            ->header('Content-Type', 'text/plain');
    }
}
