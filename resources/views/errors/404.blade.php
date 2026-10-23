<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>404 — Void Trajectory | CuttingEdger</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: #0a0b0e;
            color: #ffffff;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
            position: relative;
            overflow-x: hidden;
        }
        .glow {
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            width: 36rem;
            height: 20rem;
            background: rgba(212, 255, 0, 0.08);
            border-radius: 9999px;
            filter: blur(160px);
            pointer-events: none;
        }
        .container {
            max-width: 680px;
            width: 100%;
            text-align: center;
            position: relative;
            z-index: 10;
        }
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.35rem 1rem;
            border-radius: 9999px;
            background: rgba(212, 255, 0, 0.1);
            border: 1px solid rgba(212, 255, 0, 0.3);
            color: #d4ff00;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 2rem;
        }
        .error-code {
            font-size: clamp(6rem, 16vw, 10rem);
            font-weight: 900;
            line-height: 1;
            letter-spacing: -0.05em;
            background: linear-gradient(180deg, #ffffff 0%, #a3a3a3 70%, #404040 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        h1 {
            font-size: clamp(1.4rem, 3.5vw, 2rem);
            font-weight: 800;
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
        }
        p {
            color: #a3a3a3;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 2.5rem;
            max-width: 520px;
            margin-left: auto;
            margin-right: auto;
        }
        .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            justify-content: center;
            align-items: center;
        }
        .btn-primary {
            background-color: #d4ff00;
            color: #000000;
            font-weight: 800;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0.9rem 2rem;
            border-radius: 9999px;
            text-decoration: none;
            transition: all 0.2s ease;
        }
        .btn-primary:hover {
            background-color: #c2eb00;
            box-shadow: 0 0 25px rgba(212, 255, 0, 0.35);
        }
        .btn-secondary {
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0.9rem 1.75rem;
            border-radius: 9999px;
            text-decoration: none;
            transition: all 0.2s ease;
        }
        .btn-secondary:hover {
            border-color: #d4ff00;
            color: #d4ff00;
        }
    </style>
</head>
<body>
    <div class="glow"></div>
    <div class="container">
        <div class="badge">// ERROR 404 &bull; VOID TRAJECTORY</div>
        <div class="error-code">404</div>
        <h1>Signal Lost Beyond Perimeter</h1>
        <p>The coordinate you requested does not exist, was decommissioned, or migrated to a new canonical URL. Return to our flagship or contact our visual production team.</p>
        <div class="actions">
            <a href="/" class="btn-primary">Return to Flagship</a>
            <a href="/services" class="btn-secondary">Explore Services</a>
        </div>
    </div>
</body>
</html>
