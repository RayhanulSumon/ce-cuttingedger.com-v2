<x-mail::message>
# New Project Brief Inbound

A prospective client has submitted an inquiry through the Cutting Edger website.

### Contact Profile:
- **Name:** {{ $contactMessage->name }} ([{{ $contactMessage->email }}](mailto:{{ $contactMessage->email }}))
- **Phone:** {{ $contactMessage->phone ?? 'N/A' }}
- **Company:** {{ $contactMessage->company ?? 'N/A' }}
- **Website:** {{ $contactMessage->website ?? 'N/A' }}
- **Service Focus:** {{ $contactMessage->service_interest ?? 'General' }}
- **IP Address:** {{ $contactMessage->ip_address ?? 'N/A' }}

---

### Project Message:
{{ $contactMessage->message }}

<x-mail::button :url="url('/admin/messages')">
View Messages in Admin
</x-mail::button>

Best regards,<br>
Cutting Edger Lead Router
</x-mail::message>
