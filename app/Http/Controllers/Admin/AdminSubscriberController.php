<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminSubscriberController extends Controller
{
    /**
     * Display a listing of newsletter subscribers.
     */
    public function index(): Response
    {
        $subscribers = NewsletterSubscriber::latest()->get();

        return Inertia::render('Admin/Subscribers/Index', [
            'subscribers' => $subscribers,
        ]);
    }

    /**
     * Remove subscriber.
     */
    public function destroy(NewsletterSubscriber $subscriber): RedirectResponse
    {
        $subscriber->delete();

        return redirect()->back()->with('success', 'Subscriber removed.');
    }
}
