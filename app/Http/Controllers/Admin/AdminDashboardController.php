<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Capability;
use App\Models\ChatConsultation;
use App\Models\ChatSession;
use App\Models\ContactMessage;
use App\Models\DigitalTwin;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\Project;
use App\Models\TryOnLook;
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
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'digital_twins_count' => DigitalTwin::count(),
            'try_on_looks_count' => TryOnLook::count(),
            'total_projects' => Project::count(),
            'total_capabilities' => Capability::count(),
            'new_inquiries' => ContactMessage::where('status', 'new')->count(),
            'total_subscribers' => NewsletterSubscriber::count(),
            'upcoming_consultations' => ChatConsultation::where('scheduled_at', '>=', now())
                ->where('status', '!=', 'cancelled')
                ->count(),
            'total_chat_leads' => ChatSession::whereNotNull('lead_email')->count(),
        ];

        $recentOrders = Order::latest('id')->take(6)->get()->map(fn (Order $order) => [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'order_type' => $order->order_type ?? 'custom_order',
            'client_name' => $order->client_name,
            'client_email' => $order->client_email,
            'service_name' => $order->service_name,
            'total_price' => (float) $order->total_price,
            'status' => $order->status,
            'created_at_formatted' => $order->created_at->format('M j, Y'),
        ]);

        $recentInquiries = ContactMessage::latest()->take(5)->get();
        $featuredProjects = Project::with('category')->where('featured', true)->orderBy('sort_order')->take(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'recentInquiries' => $recentInquiries,
            'featuredProjects' => $featuredProjects,
        ]);
    }
}
