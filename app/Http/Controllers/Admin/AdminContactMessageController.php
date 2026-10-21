<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminContactMessageController extends Controller
{
    /**
     * Display a listing of client inquiries.
     */
    public function index(): Response
    {
        $messages = ContactMessage::latest()->get();

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
        ]);
    }

    /**
     * Update inquiry status (read, replied, archived).
     */
    public function update(Request $request, ContactMessage $message): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:new,read,replied,archived'],
        ]);

        $message->update($validated);

        return redirect()->back()->with('success', 'Inquiry status updated.');
    }

    /**
     * Purge inquiry record.
     */
    public function destroy(ContactMessage $message): RedirectResponse
    {
        $message->delete();

        return redirect()->back()->with('success', 'Inquiry removed.');
    }
}
