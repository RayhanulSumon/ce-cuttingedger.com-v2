<?php

namespace App\Services\Security;

use Illuminate\Http\UploadedFile;

class LinkAndFileSecurityGuard
{
    /**
     * Strict whitelist of trusted cloud storage domains.
     *
     * @var array<string>
     */
    protected array $whitelistedDomains = [
        'drive.google.com',
        'docs.google.com',
        'dropbox.com',
        'www.dropbox.com',
        'we.tl',
        'wetransfer.com',
        'www.wetransfer.com',
        '1drv.ms',
        'onedrive.live.com',
        'sharepoint.com',
        'box.com',
        'app.box.com',
    ];

    /**
     * Dangerous executable and script file extensions that must never be accepted.
     *
     * @var array<string>
     */
    protected array $blockedExtensions = [
        'exe', 'bat', 'sh', 'vbs', 'scr', 'cmd', 'ps1',
        'php', 'phtml', 'phar', 'cgi', 'pl', 'py', 'rb',
        'js', 'jsp', 'asp', 'aspx', 'msi', 'jar', 'apk',
        'bin', 'com', 'inf', 'reg', 'hta', 'cpl', 'iso',
        'dll', 'so', 'dylib', 'elf', 'wsf', 'scf',
    ];

    /**
     * Allowed image/graphic file MIME types for retouching uploads.
     *
     * @var array<string>
     */
    protected array $allowedMimeTypes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/webp',
        'image/tiff',
        'image/x-tiff',
        'image/vnd.adobe.photoshop',
        'image/x-photoshop',
        'application/photoshop',
        'application/psd',
        'application/x-photoshop',
    ];

    /**
     * Validate an external link submitted by client.
     * Enforces HTTPS, domain whitelisting, SSRF protection, and blocks malicious executable payloads.
     *
     * @return array{valid: bool, reason: string|null, domain: string|null}
     */
    public function validateCloudLink(string $url): array
    {
        $trimmed = trim($url);

        // 1. Enforce HTTPS only (no insecure http://, javascript:, data:, file:)
        if (! str_starts_with(strtolower($trimmed), 'https://')) {
            return [
                'valid' => false,
                'reason' => 'For security, only secure https:// links are accepted.',
                'domain' => null,
            ];
        }

        // 2. Parse URL and validate host
        $parts = parse_url($trimmed);
        if (! is_array($parts) || empty($parts['host'])) {
            return [
                'valid' => false,
                'reason' => 'Invalid link format. Please provide a full URL.',
                'domain' => null,
            ];
        }

        $host = strtolower($parts['host']);

        // 3. SSRF Protection: Block localhost, loopbacks, internal IPs, private networks
        if (
            $host === 'localhost' ||
            str_starts_with($host, '127.') ||
            str_starts_with($host, '10.') ||
            str_starts_with($host, '192.168.') ||
            str_starts_with($host, '169.254.') || // AWS metadata endpoint
            preg_match('/^172\.(1[6-9]|2[0-9]|3[0-1])\./', $host) ||
            $host === '::1' ||
            filter_var($host, FILTER_VALIDATE_IP)
        ) {
            return [
                'valid' => false,
                'reason' => 'Internal network and IP addresses are strictly prohibited.',
                'domain' => $host,
            ];
        }

        // 4. Domain Whitelisting: Must match trusted cloud storage providers
        $isWhitelisted = false;
        foreach ($this->whitelistedDomains as $allowed) {
            if ($host === $allowed || str_ends_with($host, '.'.$allowed)) {
                $isWhitelisted = true;
                break;
            }
        }

        if (! $isWhitelisted) {
            return [
                'valid' => false,
                'reason' => 'For security, we only accept links from trusted cloud storage providers: Google Drive, Dropbox, WeTransfer, OneDrive, or Box.',
                'domain' => $host,
            ];
        }

        // 5. Block dangerous executable / script paths
        $path = strtolower($parts['path'] ?? '');
        $ext = pathinfo($path, PATHINFO_EXTENSION);
        if (! empty($ext) && in_array($ext, $this->blockedExtensions, true)) {
            return [
                'valid' => false,
                'reason' => "Files with .{$ext} executable extensions are blocked for security.",
                'domain' => $host,
            ];
        }

        return [
            'valid' => true,
            'reason' => null,
            'domain' => $host,
        ];
    }

    /**
     * Inspect an uploaded file before storing it on the server.
     * Prevents webshells, PHP injection, polyglot files, and double extensions.
     *
     * @return array{valid: bool, reason: string|null}
     */
    public function inspectUploadedFile(UploadedFile $file): array
    {
        // 1. Check client extension
        $clientExt = strtolower($file->getClientOriginalExtension());
        if (in_array($clientExt, $this->blockedExtensions, true)) {
            return [
                'valid' => false,
                'reason' => "Executable or script files (.{$clientExt}) cannot be uploaded.",
            ];
        }

        // 2. Prevent double extension attack (e.g. evil.php.jpg or payload.sh.png)
        $originalName = strtolower($file->getClientOriginalName());
        foreach ($this->blockedExtensions as $dangerousExt) {
            if (str_contains($originalName, ".{$dangerousExt}.")) {
                return [
                    'valid' => false,
                    'reason' => 'Double extension file names containing executable extensions are blocked.',
                ];
            }
        }

        // 3. Inspect file MIME type
        $mime = $file->getMimeType() ?? '';
        if (! in_array($mime, $this->allowedMimeTypes, true) && ! str_starts_with($mime, 'image/')) {
            return [
                'valid' => false,
                'reason' => 'Invalid file type. Only standard images (JPEG, PNG, WEBP, TIFF, PSD) are allowed.',
            ];
        }

        // 4. Scan file content for embedded PHP/script tags (webshell & polyglot protection)
        $realPath = $file->getRealPath();
        if ($realPath && file_exists($realPath)) {
            // Read first 8KB (header) and last 4KB (footer) of file
            $handle = fopen($realPath, 'rb');
            if ($handle) {
                $header = fread($handle, 8192) ?: '';
                fseek($handle, -4096, SEEK_END);
                $footer = fread($handle, 4096) ?: '';
                fclose($handle);

                $sample = strtolower($header.$footer);
                if (
                    str_contains($sample, '<?php') ||
                    str_contains($sample, '<?=') ||
                    str_contains($sample, '<script') ||
                    str_contains($sample, '<%') ||
                    str_contains($sample, 'eval(') ||
                    str_contains($sample, 'system(') ||
                    str_contains($sample, 'passthru(')
                ) {
                    return [
                        'valid' => false,
                        'reason' => 'File rejected: suspicious script code detected inside file.',
                    ];
                }
            }
        }

        return ['valid' => true, 'reason' => null];
    }

    /**
     * Sanitize a filename to prevent directory traversal and script execution attacks.
     */
    public function sanitizeFileName(string $filename): string
    {
        $clean = str_replace(["\0", '../', '..\\', './', '.\\'], '', $filename);
        $clean = preg_replace('/[^a-zA-Z0-9_\-\. ]/', '', $clean) ?? 'unnamed';

        $ext = strtolower(pathinfo($clean, PATHINFO_EXTENSION));
        if (in_array($ext, $this->blockedExtensions, true)) {
            $clean .= '.txt';
        }

        return $clean;
    }
}
