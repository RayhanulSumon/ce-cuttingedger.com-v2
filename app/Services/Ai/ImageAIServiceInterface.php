<?php

namespace App\Services\Ai;

use App\Models\AiJob;

interface ImageAIServiceInterface
{
    /**
     * Submit an asynchronous background removal job.
     *
     * @return array<string, mixed>
     */
    public function generateBackgroundRemoval(AiJob $job, string $imageUrl): array;

    /**
     * Submit an asynchronous virtual try-on job.
     *
     * @param  array<string, mixed>  $options
     * @return array<string, mixed>
     */
    public function generateVirtualTryOn(AiJob $job, string $personImageUrl, string $garmentImageUrl, array $options = []): array;
}
