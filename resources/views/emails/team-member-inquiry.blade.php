<x-mail::message>
# Direct Advisory Inquiry

Hello {{ $memberName }},

You have received a direct advisory and commission inquiry through your profile page on **CuttingEdger**.

**Sender Details:**
- **Name:** {{ $senderName }}
- **Email:** [{{ $senderEmail }}](mailto:{{ $senderEmail }})
@if($senderWebsite)
- **Website:** {{ $senderWebsite }}
@endif

---

### Message:
{{ $inquiryMessage }}

---

<x-mail::button :url="'mailto:' . $senderEmail">
Reply to {{ $senderName }}
</x-mail::button>

Best regards,<br>
{{ config('app.name') }} Studio Engine
</x-mail::message>
