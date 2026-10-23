<x-mail::message>
# New 3-Asset Pilot Request Inbound

A new prospective enterprise client has submitted sample assets for production testing.

### Lead Profile:
- **Order #:** `{{ $order->order_number }}`
- **Contact:** {{ $order->client_name }} ([{{ $order->client_email }}](mailto:{{ $order->client_email }}))
- **Phone:** {{ $order->client_phone ?? 'N/A' }}
- **Company:** {{ $order->company ?? 'N/A' }}
- **Role:** {{ $order->role ?? 'N/A' }}
- **Website:** {{ $order->website ?? 'N/A' }}
- **Service Requested:** {{ $order->service_name }}
- **Monthly Volume:** {{ $order->monthly_volume ?? 'Not Specified' }}
- **E-Commerce Platform:** {{ $order->platform ?? 'Not Specified' }}
- **Sample Assets Uploaded:** {{ count($order->images ?? []) }} files

---

### Special Instructions:
{{ $order->instructions ?? 'No custom instructions provided.' }}

---

### SEO & Marketing Attribution:
- **Landing URL:** `{{ $order->landing_page_url ?? 'Direct' }}`
- **Submission URL:** `{{ $order->submission_page_url ?? 'N/A' }}`
- **UTM Source:** `{{ $order->utm_source ?? 'N/A' }}`
- **UTM Medium:** `{{ $order->utm_medium ?? 'N/A' }}`
- **UTM Campaign:** `{{ $order->utm_campaign ?? 'N/A' }}`
- **Ad Click ID:** `{{ $order->click_id ?? 'None' }}`
- **IP Address:** `{{ $order->ip_address ?? 'N/A' }}`

<x-mail::button :url="url('/admin/orders')">
Inspect Order in Admin Dashboard
</x-mail::button>

Best regards,<br>
Cutting Edger Lead Router
</x-mail::message>
