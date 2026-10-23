<x-mail::message>
# Inquiry Transmitted Successfully

Hello {{ $contactMessage->name }},

Thank you for reaching out to **Cutting Edger**. We have received your project specifications and technical requirements.

One of our Senior Production Directors will review your brief and follow up with tailored estimates, turnaround schedules, and pipeline recommendations.

### Your Transmission Summary:
- **Service Interest:** {{ $contactMessage->service_interest ?? 'General Inquiries' }}
- **Company:** {{ $contactMessage->company ?? 'N/A' }}
- **Estimated Volume:** {{ $contactMessage->monthly_volume ?? 'N/A' }}

---

### Need Immediate Alignment?
Skip the email queue and lock in a 15-minute Discovery Call with our production team:

<x-mail::button :url="$calendlyUrl">
Schedule a Discovery Call
</x-mail::button>

Best regards,<br>
**Cutting Edger Studio Partnerships**<br>
[cuttingedger.com](https://cuttingedger.com)
</x-mail::message>
