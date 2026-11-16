<x-mail::message>
# New Contact Inquiry Inbound

A prospective client has submitted an inquiry through the Cutting Edger contact form.

<x-mail::table>
| Field | Details |
| :--- | :--- |
| **Name** | {{ $contactMessage->name }} |
| **Email** | [{{ $contactMessage->email }}](mailto:{{ $contactMessage->email }}) |
| **Phone** | {{ $contactMessage->phone ?? 'N/A' }} |
| **Company** | {{ $contactMessage->company ?? 'N/A' }} |
| **Website** | {{ $contactMessage->website ?? 'N/A' }} |
| **Capability Needed** | {{ $contactMessage->service_interest ?? 'General' }} |
| **IP & Location** | `{{ $contactMessage->ip_address ?? 'N/A' }}` ({{ $ipLocation ?? 'Unknown' }}) |
</x-mail::table>

<x-mail::panel>
**Description / Message:**

{{ $contactMessage->message }}
</x-mail::panel>

<x-mail::button :url="url('/admin/messages')">
View Messages in Admin
</x-mail::button>

Best regards,<br>
Cutting Edger Lead Router
</x-mail::message>
