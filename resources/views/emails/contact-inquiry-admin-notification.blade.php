<x-mail::message>
# New Project Brief Inbound

A prospective client has submitted an inquiry through the Cutting Edger website.

### Contact Profile:
- **Name:** {{ $contactMessage->name }} ([{{ $contactMessage->email }}](mailto:{{ $contactMessage->email }}))
- **Company:** {{ $contactMessage->company ?? 'N/A' }}
- **Role:** {{ $contactMessage->role ?? 'N/A' }}
- **Website:** {{ $contactMessage->website ?? 'N/A' }}
- **Service Focus:** {{ $contactMessage->service_interest ?? 'General' }}
- **Monthly Volume:** {{ $contactMessage->monthly_volume ?? 'N/A' }}
- **Budget Tier:** {{ $contactMessage->budget ?? 'N/A' }}

---

### Project Message:
{{ $contactMessage->message }}

---

### SEO & Marketing Attribution:
- **Landing URL:** `{{ $contactMessage->landing_page_url ?? 'Direct' }}`
- **Submission URL:** `{{ $contactMessage->submission_page_url ?? 'N/A' }}`
- **UTM Source:** `{{ $contactMessage->utm_source ?? 'N/A' }}`
- **UTM Medium:** `{{ $contactMessage->utm_medium ?? 'N/A' }}`
- **UTM Campaign:** `{{ $contactMessage->utm_campaign ?? 'N/A' }}`
- **Ad Click ID:** `{{ $contactMessage->click_id ?? 'None' }}`
- **IP Address:** `{{ $contactMessage->ip_address ?? 'N/A' }}`

<x-mail::button :url="url('/admin/messages')">
View Messages in Admin
</x-mail::button>

Best regards,<br>
Cutting Edger Lead Router
</x-mail::message>
