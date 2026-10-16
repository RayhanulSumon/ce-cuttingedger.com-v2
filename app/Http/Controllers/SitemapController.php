<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\TeamMember;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate dynamic sitemap.xml.
     */
    public function index(): Response
    {
        $urls = [
            url('/'),
            url('/about'),
            url('/services'),
            url('/work'),
            url('/team'),
            url('/careers'),
            url('/pricing'),
            url('/faq'),
            url('/blog'),
            url('/contact'),
            url('/privacy'),
            url('/terms'),
        ];

        foreach (Project::all() as $project) {
            $urls[] = url("/work/{$project->slug}");
        }

        foreach (Service::all() as $service) {
            $urls[] = url("/services/{$service->slug}");
        }

        foreach (TeamMember::all() as $member) {
            $urls[] = url("/team/{$member->slug}");
        }

        foreach (Job::where('is_open', true)->get() as $job) {
            $urls[] = url("/careers/{$job->slug}");
        }

        foreach (Post::all() as $post) {
            $urls[] = url("/blog/{$post->slug}");
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($urls as $url) {
            $xml .= '<url>';
            $xml .= '<loc>'.htmlspecialchars($url).'</loc>';
            $xml .= '<lastmod>'.date('Y-m-d').'</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.8</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200)
            ->header('Content-Type', 'application/xml');
    }
}
