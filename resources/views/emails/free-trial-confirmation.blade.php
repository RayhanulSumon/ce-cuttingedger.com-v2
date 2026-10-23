<x-mail::message>
# Transmission Confirmed — Your Pilot is In Motion

Hello {{ $order->client_name }},

Thank you for choosing **Cutting Edger**. Your complimentary 3-asset production pilot has been assigned to our senior retouching artisans.

### Pilot Order Details:
- **Pilot Reference:** `{{ $order->order_number }}`
- **Service Focus:** {{ $order->service_name }}
- **Turnaround SLA:** 24 Business Hours
- **Status:** In Studio Production

---

### Need Custom Volume Pricing or Fast SLAs?
Accelerate your workflow onboarding by reserving a 15-minute Discovery Call with a Technical Art Director.

<x-mail::button :url="$calendlyUrl">
Book a 15-Minute Discovery Call
</x-mail::button>

If you have additional instructions or source files to attach, simply reply directly to this email.

Best regards,<br>
**Cutting Edger Studio Operations**<br>
[cuttingedger.com](https://cuttingedger.com)
</x-mail::message>
