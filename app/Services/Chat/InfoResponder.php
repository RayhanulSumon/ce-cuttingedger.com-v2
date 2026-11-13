<?php

namespace App\Services\Chat;

use App\Models\ChatSession;
use App\Models\Faq;
use App\Services\Chat\Tools\ServiceCatalogTool;
use App\Services\Notification\NotificationService;

/**
 * Answers visitor questions with information only: services, pricing, turnaround, process and FAQs.
 * It never books, quotes, collects files or creates orders; it points visitors to the right page instead.
 */
class InfoResponder
{
    public const WELCOME_MESSAGE = '👋 Hi! Welcome to **CuttingEdger**. Ask me about our services, pricing or turnaround.';

    /** @var array<int, string> */
    public const WELCOME_REPLIES = [
        'What services do you offer?',
        'How does pricing work?',
        'How long does delivery take?',
        'How can I contact the team?',
    ];

    /**
     * Retail rates shown by the pricing card.
     *
     * @var array<int, array{name: string, rate: string, turnaround: string}>
     */
    private const PRICING_ROWS = [
        ['name' => 'Clipping path / cutouts', 'rate' => '$0.45 – $0.49 / image', 'turnaround' => '12–24 h'],
        ['name' => 'Ghost mannequin', 'rate' => '$0.99 / image', 'turnaround' => '12–24 h'],
        ['name' => 'Natural / drop shadow', 'rate' => '$0.49 / image', 'turnaround' => '12–24 h'],
        ['name' => 'Multi-path / colour masking', 'rate' => '$1.25 / image', 'turnaround' => '12–24 h'],
        ['name' => 'Fashion & beauty retouching', 'rate' => '$1.99 – $3.99 / image', 'turnaround' => '12–24 h'],
        ['name' => 'Jewelry & macro retouching', 'rate' => '$2.49 – $4.99 / image', 'turnaround' => '12–36 h'],
    ];

    /**
     * @return array{content: string, tool_cards: array<int, array<string, mixed>>, suggested_replies: array<int, string>}
     */
    public function process(string $message, ?ChatSession $session = null): array
    {
        $text = strtolower(trim($message));

        if (preg_match('/\b(human|agent|operator|real person|speak to someone|talk to someone|talk to a person|representative|live specialist)\b/i', $text)) {
            return $this->humanHandoff($session);
        }

        if (preg_match('/^(hi|hello|hey|hola|salam|good (morning|afternoon|evening))\b/i', $text)) {
            return $this->reply(self::WELCOME_MESSAGE, [], self::WELCOME_REPLIES);
        }

        if (preg_match('/\b(pric\w*|cost\w*|rate\w*|how much|quote\w*|discount\w*|estimat\w*|fee\w*|\$)\b/i', $text)) {
            return $this->reply(
                'Pricing is per image and depends on the service. Volume discounts apply: **15% off at 100+ images** and **25% off at 500+**. For an exact quote, contact the team.',
                [$this->pricingCard(), $this->links('Need an exact price?', [['Contact the team', '/contact'], ['See pricing plans', '/pricing']])],
                ['What services do you offer?', 'How long does delivery take?'],
            );
        }

        if ($detail = $this->matchSpecificService($text)) {
            return $this->reply(
                'Here is everything about this service. Use the contact page when you are ready to start.',
                [(new ServiceCatalogTool)->execute(['service_slug' => $detail, 'action' => 'detail']), $this->contactLinks()],
                ['See all services', 'How does pricing work?', 'How long does delivery take?'],
            );
        }

        if (preg_match('/\b(servic\w*|offer\w*|capabilit\w*|speciali[sz]\w*|what (do|can) you do|portfolio|catalog\w*)\b/i', $text)) {
            return $this->reply(
                'We cover 2D retouching, 3D and digital twins, catalog layout and video. Tap a service for its details.',
                [(new ServiceCatalogTool)->execute(['action' => 'list'])],
                ['How does pricing work?', 'How long does delivery take?', 'How does the process work?'],
            );
        }

        if (preg_match('/\b(turnaround|how long|deliver\w*|sla|rush|express|deadline|fast|speed)\b/i', $text)) {
            return $this->reply(
                "**Standard turnaround is 12–24 hours.** Express rush jobs can be delivered in 6 hours. Large batches and 3D or video projects are scoped with a fixed delivery date before work starts.\n\nFiles are delivered in the formats you need: layered PSD, transparent PNG, web-ready JPG/WebP and print TIFF.",
                [],
                ['How does pricing work?', 'How does the process work?', 'Is my content confidential?'],
            );
        }

        if (preg_match('/\b(process|pipeline|workflow|how does it work|how do you work|steps?)\b/i', $text)) {
            return $this->reply(
                "Every project follows the same four steps:\n\n1. **Ingestion & calibration:** you share your files and style guide, and we set up colour profiles.\n2. **Expert execution:** senior artists do the work by hand at high zoom, with AI assistance where it helps.\n3. **Quality control:** every file passes two supervisors and an art director.\n4. **Secure delivery:** files arrive in your exact formats within 12–24 hours.",
                [],
                ['How does pricing work?', 'Is my content confidential?', 'What services do you offer?'],
            );
        }

        if (preg_match('/\b(format\w*|file types?|psd|tiff|png|jpe?g|webp|size limit|upload\w*|send (you )?(files|images|photos))\b/i', $text)) {
            return $this->reply(
                "We accept **JPG, PNG, WebP, TIFF, PSD, PDF and ZIP** archives up to 25 MB per file. Larger batches can be shared through a cloud link.\n\nTo send files, use the contact or demo form and we will reply with next steps.",
                [$this->contactLinks()],
                ['How long does delivery take?', 'Is my content confidential?'],
            );
        }

        if (preg_match('/\b(confidential\w*|nda|secur\w*|privacy|private|safe|train\w*)\b/i', $text)) {
            return $this->reply(
                'Every project can be covered by an **NDA**, files are kept on encrypted storage, and your images are **never used to train public models**.',
                [$this->links('Policies', [['NDA & confidentiality', '/nda-compliance'], ['Privacy policy', '/privacy']])],
                ['How does the process work?', 'How can I contact the team?'],
            );
        }

        if (preg_match('/\b(free|trial|sample|test|try)\b/i', $text)) {
            return $this->reply(
                'Yes, we offer a **free sample**. Send a few images through the demo or contact form and we will return them retouched so you can judge the quality first.',
                [$this->contactLinks()],
                ['How does pricing work?', 'How long does delivery take?'],
            );
        }

        if (preg_match('/\b(contact\w*|book\w*|schedul\w*|demo|call|meeting|appointment|email|phone|reach|talk)\b/i', $text)) {
            return $this->reply(
                'The quickest way to reach us is the contact page. We reply within one business day, usually faster.',
                [$this->contactLinks()],
                ['What services do you offer?', 'How does pricing work?'],
            );
        }

        return $this->faqAnswer($text);
    }

    /**
     * @return array{content: string, tool_cards: array<int, array<string, mixed>>, suggested_replies: array<int, string>}
     */
    private function faqAnswer(string $text): array
    {
        $words = array_filter(preg_split('/\W+/', $text) ?: [], fn (string $word) => strlen($word) > 3);
        $faqs = collect();

        foreach ($words as $word) {
            $faqs = $faqs->merge(
                Faq::where('question', 'like', "%{$word}%")->orWhere('answer', 'like', "%{$word}%")->take(2)->get()
            );
        }
        $faqs = $faqs->unique('id')->take(3);

        if ($faqs->isEmpty()) {
            return $this->reply(
                'I can help with our services, pricing, turnaround, process and file formats. Pick a topic below, or contact the team for anything else.',
                [$this->contactLinks()],
                self::WELCOME_REPLIES,
            );
        }

        return $this->reply(
            'Here is what I found:',
            [[
                'type' => 'info_card',
                'topic' => $text,
                'faqs' => $faqs->map(fn ($faq) => ['q' => $faq->question, 'a' => $faq->answer])->values()->all(),
                'services' => [],
                'pricing_plans' => [],
            ]],
            ['What services do you offer?', 'How does pricing work?'],
        );
    }

    /**
     * @return array{content: string, tool_cards: array<int, array<string, mixed>>, suggested_replies: array<int, string>}
     */
    private function humanHandoff(?ChatSession $session): array
    {
        if ($session) {
            $session->requestHuman();
            try {
                app(NotificationService::class)->toAllAdmins()->send('chat_takeover_requested', [
                    'title' => '🚨 Live Chat Takeover Requested',
                    'message' => 'Visitor requested to speak with a human specialist.',
                    'session_id' => $session->id,
                    'admin_url' => url('/admin/chat-sessions?id='.$session->id),
                    'timestamp' => now()->toISOString(),
                ]);
            } catch (\Throwable) {
                // A failed notification must never break the visitor's chat.
            }
        }

        return $this->reply(
            "I've let our team know. A specialist will join this chat shortly. You can also reach us through the contact page.",
            [$this->contactLinks()],
            ['What services do you offer?', 'How does pricing work?'],
        );
    }

    /** Finds a specific service slug the visitor is asking about. */
    private function matchSpecificService(string $text): ?string
    {
        $map = [
            'background-removal' => '/\b(clipping|cutout\w*|background removal|path)\b/i',
            'ghost-mannequin' => '/\b(ghost|mannequin\w*|manequin\w*)\b/i',
            'jewelry-retouch' => '/\b(jewel\w*)\b/i',
            'high-end-model-retouch' => '/\b(retouch\w*|beauty|fashion retouch)\b/i',
            '3d-modeling-and-rendering' => '/\b(3d|cgi|render\w*|digital twin\w*)\b/i',
            'desktop-publishing' => '/\b(dtp|publishing|layout)\b/i',
        ];

        foreach ($map as $slug => $pattern) {
            if (preg_match($pattern, $text)) {
                return $slug;
            }
        }

        return null;
    }

    /** @return array<string, mixed> */
    private function pricingCard(): array
    {
        return [
            'type' => 'pricing_card',
            'title' => 'Per-image rates',
            'rows' => self::PRICING_ROWS,
            'notes' => ['100+ images: 15% off', '500+ images: 25% off', 'Final price is confirmed before work starts'],
        ];
    }

    /** @return array<string, mixed> */
    private function contactLinks(): array
    {
        return $this->links('Next step', [['Contact the team', '/contact'], ['Order page', '/order']]);
    }

    /**
     * @param  array<int, array{0: string, 1: string}>  $links
     * @return array<string, mixed>
     */
    private function links(string $title, array $links): array
    {
        return [
            'type' => 'link_card',
            'title' => $title,
            'links' => array_map(fn (array $link) => ['label' => $link[0], 'href' => $link[1]], $links),
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $cards
     * @param  array<int, string>  $replies
     * @return array{content: string, tool_cards: array<int, array<string, mixed>>, suggested_replies: array<int, string>}
     */
    private function reply(string $content, array $cards, array $replies): array
    {
        return ['content' => $content, 'tool_cards' => $cards, 'suggested_replies' => $replies];
    }
}
