<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatConsultation;
use App\Models\ChatSession;
use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use App\Models\Project;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the Studio Admin Dashboard.
     */
    public function index(): Response
    {
        $stats = [
            'total_projects' => Project::count(),
            'total_services' => Service::count(),
            'new_inquiries' => ContactMessage::where('status', 'new')->count(),
            'total_subscribers' => NewsletterSubscriber::count(),
            'upcoming_consultations' => ChatConsultation::where('scheduled_at', '>=', now())
                ->where('status', '!=', 'cancelled')
                ->count(),
            'total_chat_leads' => ChatSession::whereNotNull('lead_email')->count(),
        ];

        $recentInquiries = ContactMessage::latest()->take(5)->get();
        $featuredProjects = Project::with('category')->where('featured', true)->orderBy('sort_order')->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentInquiries' => $recentInquiries,
            'featuredProjects' => $featuredProjects,
        ]);
    }
}
