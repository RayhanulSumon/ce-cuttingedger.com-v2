<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DigitalTwin;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use ZipArchive;

class AdminOrderController extends Controller
{
    /**
     * Display a listing of client orders (Digital Twins, Virtual Try-On Quotes, Paid Orders & Free Trials).
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $paymentStatus = $request->query('payment_status');
        $type = $request->query('type');
        $search = $request->query('search');

        $query = Order::with(['chatSession', 'digitalTwin', 'tryOnLook'])->latest('id');

        if ($type === 'free_trial') {
            $query->where('payment_status', 'free_trial');
        } elseif ($type === 'digital_twin') {
            $query->where('order_type', 'like', 'digital_twin%');
        } elseif ($type === 'virtual_try_on') {
            $query->where('order_type', 'virtual_try_on_quote');
        } elseif ($type === 'paid') {
            $query->where('payment_status', '!=', 'free_trial');
        }

        if ($status && in_array($status, ['pending', 'in_production', 'review', 'completed', 'cancelled'], true)) {
            $query->where('status', $status);
        }

        if ($paymentStatus && in_array($paymentStatus, ['unpaid', 'paid', 'invoice_sent', 'free_trial'], true)) {
            $query->where('payment_status', $paymentStatus);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('client_name', 'like', "%{$search}%")
                    ->orWhere('client_email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('service_name', 'like', "%{$search}%");
            });
        }

        $orders = $query->paginate(15)->withQueryString()->through(fn (Order $order) => [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'order_type' => $order->order_type ?? 'custom_order',
            'digital_twin_id' => $order->digital_twin_id,
            'try_on_look_id' => $order->try_on_look_id,
            'chat_session_id' => $order->chat_session_id,
            'client_name' => $order->client_name,
            'client_email' => $order->client_email,
            'client_phone' => $order->client_phone,
            'company' => $order->company,
            'monthly_volume' => $order->monthly_volume,
            'service_name' => $order->service_name,
            'service_slug' => $order->service_slug,
            'complexity' => $order->complexity,
            'quantity' => $order->quantity,
            'uploaded_count' => $order->uploaded_count,
            'unit_price' => (float) $order->unit_price,
            'discount_percent' => $order->discount_percent,
            'total_price' => (float) $order->total_price,
            'currency' => $order->currency,
            'turnaround' => $order->turnaround,
            'images' => (array) ($order->images ?? []),
            'specifications' => (array) ($order->specifications ?? []),
            'completed_files' => (array) ($order->completed_files ?? []),
            'cloud_link' => $order->cloud_link,
            'instructions' => $order->instructions,
            'admin_notes' => $order->admin_notes,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'source' => $order->source,
            'is_free_trial' => $order->payment_status === 'free_trial' || $order->source === 'web_trial',
            'created_at' => $order->created_at->toISOString(),
            'created_at_formatted' => $order->created_at->format('M j, Y \a\t g:i A'),
        ]);

        $stats = [
            'total' => Order::count(),
            'pending' => Order::where('status', 'pending')->count(),
            'in_production' => Order::where('status', 'in_production')->count(),
            'completed' => Order::where('status', 'completed')->count(),
            'digital_twin_orders' => Order::where('order_type', 'like', 'digital_twin%')->count(),
            'try_on_quotes' => Order::where('order_type', 'virtual_try_on_quote')->count(),
            'total_trials' => Order::where('payment_status', 'free_trial')->count(),
            'pending_trials' => Order::where('payment_status', 'free_trial')->where('status', 'pending')->count(),
            'paid_orders' => Order::where('payment_status', '!=', 'free_trial')->count(),
            'total_revenue' => (float) Order::where('payment_status', 'paid')->sum('total_price'),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'currentStatus' => $status,
            'currentPaymentStatus' => $paymentStatus,
            'currentType' => $type,
            'searchTerm' => $search,
        ]);
    }

    /**
     * Update order status, payment status, and notes.
     * Automatically marks a Digital Twin as Sold Out when a Lifetime Copyright order is paid/completed.
     */
    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_production,review,completed,cancelled',
            'payment_status' => 'nullable|in:unpaid,paid,invoice_sent,free_trial',
            'admin_notes' => 'nullable|string|max:2000',
            'quantity' => 'nullable|integer|min:1',
            'total_price' => 'nullable|numeric|min:0',
        ]);

        $order->update($validated);

        if (
            $order->order_type === 'digital_twin_lifetime' &&
            $order->digital_twin_id &&
            ($order->payment_status === 'paid' || $order->status === 'completed')
        ) {
            DigitalTwin::find($order->digital_twin_id)?->update([
                'is_copyright_sold' => true,
            ]);
        }

        return redirect()->back()->with('success', "Order #{$order->order_number} updated successfully.");
    }

    /**
     * Download all uploaded files for an order as a ZIP archive, including labeled Try-On slots and specifications.
     */
    public function downloadZip(Order $order): BinaryFileResponse
    {
        $zipFileName = 'order-'.$order->order_number.'-files.zip';
        $tempDir = storage_path('app/temp');
        if (! file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }
        $zipPath = $tempDir.DIRECTORY_SEPARATOR.$zipFileName;

        $zip = new ZipArchive;
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            abort(500, 'Unable to create zip file.');
        }

        $publicDisk = Storage::disk('public');
        $specs = (array) ($order->specifications ?? []);
        $labeledFiles = (array) ($specs['labeled_files'] ?? []);

        if (! empty($labeledFiles)) {
            foreach ($labeledFiles as $slot => $imgUrl) {
                $urlPath = parse_url((string) $imgUrl, PHP_URL_PATH) ?: (string) $imgUrl;
                $relativeStorage = ltrim(preg_replace('#^/?storage/#', '', $urlPath), '/');

                if ($publicDisk->exists($relativeStorage)) {
                    $ext = pathinfo($relativeStorage, PATHINFO_EXTENSION) ?: 'jpg';
                    $zip->addFromString("{$slot}.{$ext}", (string) $publicDisk->get($relativeStorage));
                }
            }
        } else {
            $images = (array) ($order->images ?? []);
            $index = 1;
            foreach ($images as $imgUrl) {
                $urlPath = parse_url((string) $imgUrl, PHP_URL_PATH) ?: (string) $imgUrl;
                $relativeStorage = ltrim(preg_replace('#^/?storage/#', '', $urlPath), '/');

                if ($publicDisk->exists($relativeStorage)) {
                    $ext = pathinfo($relativeStorage, PATHINFO_EXTENSION) ?: 'jpg';
                    $zip->addFromString("image-{$index}.{$ext}", (string) $publicDisk->get($relativeStorage));
                    $index++;
                }
            }
        }

        $summary = "Order Number: #{$order->order_number}\n"
            ."Order Type: {$order->order_type}\n"
            ."Client: {$order->client_name} ({$order->client_email})\n"
            .'Company: '.($order->company ?: 'N/A')."\n"
            ."Service: {$order->service_name} ({$order->complexity})\n"
            ."Quantity: {$order->quantity} (Uploaded: {$order->uploaded_count})\n"
            .'Cloud Link: '.($order->cloud_link ?: 'None')."\n"
            .'Instructions / Other: '.($order->instructions ?: 'None')."\n";

        if (! empty($specs)) {
            $summary .= "\n--- Specifications ---\n".json_encode($specs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)."\n";
        }

        $zip->addFromString('order-details.txt', $summary);
        $zip->close();

        return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
    }

    /**
     * Delete an order.
     */
    public function destroy(Order $order): RedirectResponse
    {
        $order->delete();

        return redirect()->back()->with('success', "Order #{$order->order_number} deleted successfully.");
    }
}
