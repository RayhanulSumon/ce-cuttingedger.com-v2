<?php

namespace App\Services\Logs;

use Illuminate\Support\Facades\File;

class LaravelLogReader
{
    /**
     * Only the newest part of a log file is parsed to keep memory bounded on large files.
     */
    public const MAX_READ_BYTES = 5 * 1024 * 1024;

    /**
     * Maximum characters kept for an entry's full detail (message + stack trace).
     */
    private const MAX_DETAIL_CHARS = 30000;

    /**
     * @var array<int, string>
     */
    public const LEVELS = ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'];

    private const ENTRY_PATTERN = '/^\[(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[+-]\d{2}:?\d{2}|Z)?)\]\s+([\w-]+)\.(\w+):\s?(.*)$/s';

    public function directory(): string
    {
        return storage_path('logs');
    }

    /**
     * List available log files, newest first.
     *
     * @return array<int, array{name: string, size: int, modified_at: string}>
     */
    public function files(): array
    {
        if (! File::isDirectory($this->directory())) {
            return [];
        }

        return collect(File::files($this->directory()))
            ->filter(fn (\SplFileInfo $file): bool => strtolower($file->getExtension()) === 'log')
            ->sortByDesc(fn (\SplFileInfo $file): int => $file->getMTime())
            ->map(fn (\SplFileInfo $file): array => [
                'name' => $file->getFilename(),
                'size' => $file->getSize(),
                'modified_at' => date(DATE_ATOM, $file->getMTime()),
            ])
            ->values()
            ->all();
    }

    /**
     * Resolve a requested file name to an absolute path inside the logs directory, or null if it is not a known log file.
     */
    public function resolvePath(?string $fileName): ?string
    {
        $available = array_column($this->files(), 'name');

        if ($fileName === null || $fileName === '') {
            $fileName = in_array('laravel.log', $available, true) ? 'laravel.log' : ($available[0] ?? null);
        }

        if ($fileName === null || ! in_array(basename($fileName), $available, true)) {
            return null;
        }

        return $this->directory().DIRECTORY_SEPARATOR.basename($fileName);
    }

    /**
     * Parse the tail of a log file into entries, newest first.
     *
     * @return array{entries: array<int, array{id: int, datetime: string, environment: string, level: string, message: string, details: string}>, truncated: bool}
     */
    public function read(string $path): array
    {
        $size = (int) filesize($path);
        $offset = max(0, $size - self::MAX_READ_BYTES);

        $handle = fopen($path, 'rb');

        if ($handle === false) {
            return ['entries' => [], 'truncated' => false];
        }

        fseek($handle, $offset);
        $content = (string) stream_get_contents($handle);
        fclose($handle);

        $content = str_replace("\r\n", "\n", $content);
        $chunks = preg_split('/\n(?=\[\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2})/', $content) ?: [];

        if ($offset > 0 && $chunks !== []) {
            array_shift($chunks);
        }

        $entries = [];

        foreach ($chunks as $chunk) {
            $entry = $this->parseEntry($chunk);

            if ($entry !== null) {
                $entries[] = $entry;
            }
        }

        $entries = array_reverse($entries);

        foreach ($entries as $index => &$entry) {
            $entry['id'] = $index + 1;
        }
        unset($entry);

        return ['entries' => $entries, 'truncated' => $offset > 0];
    }

    /**
     * Empty a log file without deleting it so the running workers keep a valid handle.
     */
    public function clear(string $path): void
    {
        file_put_contents($path, '');
    }

    /**
     * @return array{id: int, datetime: string, environment: string, level: string, message: string, details: string}|null
     */
    private function parseEntry(string $chunk): ?array
    {
        $chunk = trim($chunk);

        if (! preg_match(self::ENTRY_PATTERN, $chunk, $matches)) {
            return null;
        }

        $body = $matches[4];
        $firstLine = strtok($body, "\n") ?: '';

        return [
            'id' => 0,
            'datetime' => $matches[1],
            'environment' => $matches[2],
            'level' => strtolower($matches[3]),
            'message' => mb_strimwidth($firstLine, 0, 300, '…'),
            'details' => mb_strimwidth($body, 0, self::MAX_DETAIL_CHARS, "\n… (truncated)"),
        ];
    }
}
