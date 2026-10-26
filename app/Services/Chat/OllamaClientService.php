<?php

namespace App\Services\Chat;

use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OllamaClientService
{
    protected string $baseUrl;

    protected string $model;

    protected string $visionModel;

    protected int $timeout;

    protected float $temperature;

    protected bool $enabled;

    public function __construct()
    {
        $this->baseUrl = rtrim((string) config('chat.llm.base_url', 'http://127.0.0.1:11434'), '/');
        $this->model = (string) config('chat.llm.model', 'qwen2.5:14b');
        $this->visionModel = (string) config('chat.llm.vision_model', 'qwen2-vl:7b');
        $this->timeout = (int) config('chat.llm.timeout', 60);
        $this->temperature = (float) config('chat.llm.temperature', 0.4);
        $this->enabled = (bool) config('chat.llm.enabled', true);
    }

    /**
     * Check if the Ollama server on the Windows Server is online.
     */
    public function isAvailable(): bool
    {
        if (! $this->enabled) {
            return false;
        }

        return Cache::remember('ollama_online_status', 15, function (): bool {
            try {
                $response = Http::timeout(2)->get("{$this->baseUrl}/api/version");

                return $response->successful();
            } catch (Exception) {
                return false;
            }
        });
    }

    /**
     * Send chat request to Ollama with optional tools and images.
     *
     * @param  array<int, array<string, mixed>>  $messages
     * @param  array<int, array<string, mixed>>  $tools
     * @param  array<int, string>  $imagesBase64
     * @return array<string, mixed>|null
     */
    public function chat(array $messages, array $tools = [], array $imagesBase64 = []): ?array
    {
        if (! $this->isAvailable()) {
            return null;
        }

        $useVision = ! empty($imagesBase64);
        $activeModel = $useVision ? $this->visionModel : $this->model;

        // If images present, attach to last user message
        if ($useVision && ! empty($messages)) {
            $lastIndex = count($messages) - 1;
            if (($messages[$lastIndex]['role'] ?? '') === 'user') {
                $messages[$lastIndex]['images'] = $imagesBase64;
            }
        }

        $payload = [
            'model' => $activeModel,
            'messages' => $messages,
            'stream' => false,
            'options' => [
                'temperature' => $this->temperature,
                'num_ctx' => 2048,
            ],
        ];

        if (! empty($tools) && ! $useVision) {
            $payload['tools'] = $tools;
        }

        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->baseUrl}/api/chat", $payload);

            if ($response->successful()) {
                return $response->json();
            }

            Log::warning('Ollama returned non-200 response', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (Exception $e) {
            Log::info('Ollama request timed out or server offline, switching to fallback', [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }
}
