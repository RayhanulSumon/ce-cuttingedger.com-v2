<x-mail::message>
@php
    $heading = match ($order->order_type) {
        'digital_twin_preset' => 'New Digital Twin Preset Order',
        'digital_twin_custom' => 'New Digital Twin Custom Order',
        'digital_twin_lifetime' => 'New Digital Twin Lifetime Order',
        'virtual_try_on_order' => 'New Virtual Try-On Order',
        default => $order->payment_status === 'free_trial' ? 'New 3-Asset Pilot Request' : 'New Order Received',
    };
@endphp

# {{ $heading }}

A new submission has been recorded (`{{ $order->order_number }}`).

<x-mail::table>
| Field | Details |
| :--- | :--- |
| **Order #** | `{{ $order->order_number }}` |
| **Order Type** | {{ $order->order_type }} |
| **Client** | {{ $order->client_name }} ([{{ $order->client_email }}](mailto:{{ $order->client_email }})) |
| **Phone** | {{ $order->client_phone ?? 'N/A' }} |
| **Company** | {{ $order->company ?? 'N/A' }} |
| **Service** | {{ $order->service_name }} |
| **Total** | {{ $order->currency }} {{ number_format((float) $order->total_price, 2) }} |
| **Uploaded Files** | {{ count($order->images ?? []) }} file(s) |
| **IP & Location** | `{{ $order->ip_address ?? 'N/A' }}` ({{ $ipLocation ?? 'Unknown' }}) |
</x-mail::table>

@if ($order->instructions)
<x-mail::panel>
**Instructions / Brief:**

{{ $order->instructions }}
</x-mail::panel>
@endif

<x-mail::button :url="url('/admin/orders')">
Inspect Order in Admin Dashboard
</x-mail::button>

Best regards,<br>
Cutting Edger Lead Router
</x-mail::message>
