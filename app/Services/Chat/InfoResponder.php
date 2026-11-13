<?php

namespace App\Services\Chat;

use App\Models\Capability;
use App\Models\ChatSession;
use App\Models\Faq;
use App\Services\Chat\Tools\CapabilityCatalogTool;
use App\Services\Notification\NotificationService;

/**
 * Answers visitor questions with information only: capabilities, turnaround, process and FAQs.
 * It never states prices, books, quotes, collects files or creates orders; it points visitors to the right page instead.
 */
class InfoResponder
{
    public const WELCOME_MESSAGE = '👋 Hi! Welcome to **CuttingEdger**. Ask me about our capabilities, how pricing works or how fast we deliver.';

    /** @var array<int, string> */
    public const WELCOME_REPLIES = [
        'What capabilities do you offer?',
        'How is pricing decided?',
        'How long does delivery take?',
        'How can I contact the team?',
    ];

    /** Words that appear in many questions and say nothing about a specific capability. */
    private const GENERIC_WORDS = [
        'about', 'tell', 'what', 'which', 'your', 'have', 'does', 'much', 'need', 'want', 'with', 'from', 'that', 'this',
        'image', 'images', 'photo', 'photos', 'book', 'call', 'tomorrow', 'today', 'meeting', 'demo', 'edit', 'editing', 'work', 'service', 'services', 'capability', 'capabilities',
        'offer', 'price', 'pricing', 'cost', 'quote', 'long', 'take', 'time', 'help', 'please', 'show', 'more', 'info',
    ];

    public function __construct(protected CapabilityCatalogTool $catalog) {}

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

        if (preg_match('/\b(pric\w*|cost\w*|rate\w*|how much|quote\w*|discount\w*|estimat\w*|fee\w*|budget|charge\w*|\$)\b/i', $text)) {
            return $this->reply(
                "We don't publish fixed prices, because every project is different. The price depends on the **number of images, how complex the work is, the turnaround you need** and the formats you want.\n\nShare a few sample files with the team and you will get a clear, fixed quote within one business day.",
                [$this->links('Get a quote', [['Contact the team', '/contact'], ['Order page', '/order']])],
                ['What capabilities do you offer?', 'How long does delivery take?'],
            );
        }

        if ($capability = $this->matchCapability($text)) {
            return $this->reply(
                "Here is what we do for **{$capability->title}**. Open the page for the full details.",
                [$this->catalog->detail($capability), $this->contactLinks()],
                ['See all capabilities', 'How is pricing decided?', 'How long does delivery take?'],
            );
        }

        if (preg_match('/\b(capabilit\w*|servic\w*|offer\w*|speciali[sz]\w*|what (do|can) you do|portfolio|catalog\w*)\b/i', $text)) {
            return $this->reply(
                'We work across four main capabilities: **2D, 3D, DTP and Video**. Each has several specialities. Tap one to see the details.',
                [$this->catalog->catalog()],
                ['How is pricing decided?', 'How long does delivery take?', 'How does the process work?'],
            );
        }

        if (preg_match('/\b(turnaround|how long|deliver\w*|sla|rush|express|deadline|fast|speed)\b/i', $text)) {
            return $this->reply(
                "Turnaround depends on the capability and the size of the batch. **Standard image work is typically delivered within 12–24 hours**, and urgent jobs can be rushed. Larger batches, 3D and video projects get a fixed delivery date before work starts.\n\nFiles arrive in the formats you need: layered PSD, transparent PNG, web-ready JPG/WebP and print TIFF.",
                [],
                ['How is pricing decided?', 'How does the process work?', 'Is my content confidential?'],
            );
        }

        if (preg_match('/\b(process|pipeline|workflow|how does it work|how do you work|steps?)\b/i', $text)) {
            return $this->reply(
                "Every project follows the same four steps:\n\n1. **Brief:** you share your files and style guide.\n2. **Expert execution:** senior artists do the work, with AI assistance where it helps.\n3. **Quality control:** every file is checked before it leaves the studio.\n4. **Secure delivery:** files arrive in your exact formats on the agreed date.",
                [],
                ['How is pricing decided?', 'Is my content confidential?', 'What capabilities do you offer?'],
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
                'Yes, we offer a **free sample**. Send a few images through the demo or contact form and we will return them edited so you can judge the quality first.',
                [$this->contactLinks()],
                ['How is pricing decided?', 'How long does delivery take?'],
            );
        }

        if (preg_match('/\b(contact\w*|book\w*|schedul\w*|demo|call|meeting|appointment|email|phone|reach|talk)\b/i', $text)) {
            return $this->reply(
                'The quickest way to reach us is the contact page. We reply within one business day, usually faster.',
                [$this->contactLinks()],
                ['What capabilities do you offer?', 'How is pricing decided?'],
            );
        }

        return $this->faqAnswer($text);
    }

    /**
     * Finds the capability the visitor is asking about: a sub-capability whose title shares the most words with
     * the question, or a main capability named by its tag or slug (2D, 3D, DTP, Video).
     */
    private function matchCapability(string $text): ?Capability
    {
        $words = array_values(array_unique(array_filter(
            preg_split('/[^a-z0-9]+/', $text) ?: [],
            fn (string $word) => strlen($word) >= 2 && ! in_array($word, self::GENERIC_WORDS, true)
        )));

        if ($words === []) {
            return null;
        }

        $best = null;
        $bestScore = 0;

        foreach (Capability::active()->whereNotNull('parent_id')->orderBy('sort_order')->get() as $capability) {
            $titleWords = preg_split('/[^a-z0-9]+/', strtolower($capability->title)) ?: [];
            $score = 0;

            foreach ($words as $word) {
                foreach ($titleWords as $titleWord) {
                    $sameStem = strlen($word) >= 5 && strlen($titleWord) >= 5
                        && (str_starts_with($word, $titleWord) || str_starts_with($titleWord, $word));

                    if ($word === $titleWord || $sameStem) {
                        $score++;
                        break;
                    }
                }
            }

            if ($score > $bestScore) {
                $best = $capability;
                $bestScore = $score;
            }
        }

        if ($best) {
            return $best;
        }

        foreach ($words as $word) {
            $main = Capability::active()->main()
                ->where(fn ($query) => $query->whereRaw('lower(tag) = ?', [$word])->orWhere('slug', $word))
                ->first();

            if ($main) {
                return $main;
            }
        }

        return null;
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
                'I can help with our capabilities, pricing, turnaround, process and file formats. Pick a topic below, or contact the team for anything else.',
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
            ]],
            ['What capabilities do you offer?', 'How is pricing decided?'],
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
            ['What capabilities do you offer?', 'How is pricing decided?'],
        );
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
