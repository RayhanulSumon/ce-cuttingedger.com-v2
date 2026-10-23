<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Job;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate dynamic XML sitemap conforming to Google & Bing standards.
     */
    public function index(): Response
    {
        $entries = [];

        // Static core indexable pages
        $staticPages = [
            ['url' => url('/'), 'priority' => '1.0', 'changefreq' => 'daily', 'lastmod' => date('Y-m-d')],
            ['url' => url('/services'), 'priority' => '0.9', 'changefreq' => 'weekly', 'lastmod' => date('Y-m-d')],
            ['url' => url('/case-studies'), 'priority' => '0.9', 'changefreq' => 'weekly', 'lastmod' => date('Y-m-d')],
            ['url' => url('/pricing'), 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => date('Y-m-d')],
            ['url' => url('/reviews'), 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => date('Y-m-d')],
            ['url' => url('/about'), 'priority' => '0.7', 'changefreq' => 'monthly', 'lastmod' => date('Y-m-d')],
            ['url' => url('/contact'), 'priority' => '0.8', 'changefreq' => 'monthly', 'lastmod' => date('Y-m-d')],
            ['url' => url('/faq'), 'priority' => '0.7', 'changefreq' => 'monthly', 'lastmod' => date('Y-m-d')],
            ['url' => url('/nda-compliance'), 'priority' => '0.6', 'changefreq' => 'monthly', 'lastmod' => date('Y-m-d')],
            ['url' => url('/cookie-policy'), 'priority' => '0.5', 'changefreq' => 'yearly', 'lastmod' => date('Y-m-d')],
            ['url' => url('/esg-policy'), 'priority' => '0.5', 'changefreq' => 'yearly', 'lastmod' => date('Y-m-d')],
            ['url' => url('/privacy'), 'priority' => '0.5', 'changefreq' => 'yearly', 'lastmod' => date('Y-m-d')],
            ['url' => url('/terms'), 'priority' => '0.5', 'changefreq' => 'yearly', 'lastmod' => date('Y-m-d')],
            ['url' => url('/careers'), 'priority' => '0.6', 'changefreq' => 'weekly', 'lastmod' => date('Y-m-d')],
            ['url' => url('/blog'), 'priority' => '0.8', 'changefreq' => 'daily', 'lastmod' => date('Y-m-d')],
        ];

        foreach ($staticPages as $page) {
            $entries[] = $page;
        }

        // Services & Child Sub-services (Only indexable)
        $services = Service::where('is_noindex', false)->with('parent')->get();
        foreach ($services as $service) {
            $entries[] = [
                'url' => url($service->path),
                'priority' => $service->parent_id ? '0.85' : '0.9',
                'changefreq' => 'weekly',
                'lastmod' => $service->updated_at?->format('Y-m-d') ?? date('Y-m-d'),
            ];
        }

        // Case studies (Only indexable)
        $projects = Project::where('is_noindex', false)->get();
        foreach ($projects as $project) {
            $entries[] = [
                'url' => url("/case-studies/{$project->slug}"),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $project->updated_at?->format('Y-m-d') ?? date('Y-m-d'),
            ];
        }

        // Active Careers
        $jobs = Job::where('is_open', true)->get();
        foreach ($jobs as $job) {
            $entries[] = [
                'url' => url("/careers/{$job->slug}"),
                'priority' => '0.6',
                'changefreq' => 'weekly',
                'lastmod' => $job->updated_at?->format('Y-m-d') ?? date('Y-m-d'),
            ];
        }

        // Published Blogs
        $blogs = Blog::where('status', 'published')->get();
        foreach ($blogs as $blog) {
            $entries[] = [
                'url' => url("/blog/{$blog->slug}"),
                'priority' => '0.7',
                'changefreq' => 'weekly',
                'lastmod' => $blog->updated_at?->format('Y-m-d') ?? date('Y-m-d'),
            ];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($entries as $entry) {
            $xml .= "  <url>\n";
            $xml .= '    <loc>'.htmlspecialchars($entry['url']).'</loc>'."\n";
            $xml .= '    <lastmod>'.$entry['lastmod'].'</lastmod>'."\n";
            $xml .= '    <changefreq>'.$entry['changefreq'].'</changefreq>'."\n";
            $xml .= '    <priority>'.$entry['priority'].'</priority>'."\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200)
            ->header('Content-Type', 'application/xml; charset=utf-8');
    }
}
