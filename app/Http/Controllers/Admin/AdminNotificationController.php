<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{
    /**
     * Get recent notifications and unread count for current administrator.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'notifications' => [],
                'unread_count' => 0,
            ]);
        }

        $notifications = $user->notifications()
            ->latest()
            ->take(25)
            ->get()
            ->map(function ($n) {
                $data = is_array($n->data) ? $n->data : json_decode($n->data, true);

                return [
                    'id' => $n->id,
                    'type' => $n->type,
                    'title' => $data['title'] ?? 'Notification',
                    'message' => $data['message'] ?? '',
                    'url' => $data['admin_url'] ?? null,
                    'data' => $data,
                    'is_read' => $n->read_at !== null,
                    'read_at' => $n->read_at?->toISOString(),
                    'created_at' => $n->created_at->toISOString(),
                    'created_at_formatted' => $n->created_at->diffForHumans(),
                ];
            });

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $user->unreadNotifications()->count(),
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()?->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json(['success' => true]);
    }

    /**
     * Mark all unread notifications as read.
     */
    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()?->unreadNotifications->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * Delete a single notification.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $request->user()?->notifications()->where('id', $id)->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Clear all notifications for the current user.
     */
    public function clearAll(Request $request): JsonResponse
    {
        $request->user()?->notifications()->delete();

        return response()->json(['success' => true]);
    }
}
