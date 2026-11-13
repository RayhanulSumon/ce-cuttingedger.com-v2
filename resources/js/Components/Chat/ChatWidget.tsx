import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Maximize2, MessageSquare, Minimize2, RotateCcw, Send, User, X } from 'lucide-react';
import { ChatCard, InfoCards } from './InfoCards';

interface ChatMessageItem {
    id: number | string;
    sender: 'user' | 'assistant' | 'system' | 'operator';
    content: string;
    tool_cards?: ChatCard[];
    suggested_replies?: string[];
    created_at?: string;
}

const SESSION_KEY = 'ce_chat_session_id';
const POLL_MS = 3000;

/** Renders **bold** inside a line. */
function formatInline(text: string): React.ReactNode[] {
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
            <strong key={i} className="font-bold text-ink">
                {part.slice(2, -2)}
            </strong>
        ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
        ),
    );
}

/** Small markdown subset: paragraphs, bullets and numbered steps. */
function MessageText({ content, onDark = false }: { content: string; onDark?: boolean }) {
    const lines = content.split('\n');

    return (
        <div className={`space-y-1.5 text-[13px] leading-relaxed ${onDark ? 'text-white [&_strong]:text-white' : 'text-ink-2'}`}>
            {lines.map((raw, i) => {
                const line = raw.trim();
                if (!line) {
                    return <div key={i} className="h-1" />;
                }
                const bullet = line.match(/^[*-]\s+(.*)$/);
                if (bullet) {
                    return (
                        <p key={i} className="flex gap-2">
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{formatInline(bullet[1])}</span>
                        </p>
                    );
                }
                const step = line.match(/^(\d+)[.)]\s+(.*)$/);
                if (step) {
                    return (
                        <p key={i} className="flex gap-2.5">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-bold text-primary-ink">
                                {step[1]}
                            </span>
                            <span>{formatInline(step[2])}</span>
                        </p>
                    );
                }
                return <p key={i}>{formatInline(line)}</p>;
            })}
        </div>
    );
}

function TypingDots() {
    return (
        <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm border border-ink/10 bg-surface px-4 py-3 shadow-sm" aria-label="Assistant is typing">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                />
            ))}
        </div>
    );
}

/**
 * Information-only assistant: answers questions about services, pricing, turnaround and the process,
 * and points visitors to the contact page for anything else. It never books, quotes or collects files.
 */
export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<ChatMessageItem[]>([]);
    const [inputText, setInputText] = useState('');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [operatorName, setOperatorName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const headers = useCallback(
        (id: string | null): HeadersInit => ({
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(id ? { 'X-Chat-Session-Id': id } : {}),
        }),
        [],
    );

    const applyState = useCallback((data: any) => {
        if (data.session_id) {
            setSessionId(data.session_id);
            try {
                localStorage.setItem(SESSION_KEY, data.session_id);
            } catch {
                // Storage can be blocked; the chat still works for this visit.
            }
        }
        if (data.operator_name !== undefined) {
            setOperatorName(data.operator_name);
        }
    }, []);

    const initSession = useCallback(async () => {
        let stored: string | null = null;
        try {
            stored = localStorage.getItem(SESSION_KEY);
        } catch {
            stored = null;
        }

        try {
            const res = await fetch('/api/chat/session', { method: 'POST', headers: headers(stored), body: '{}' });
            const data = await res.json();
            applyState(data);
            if (Array.isArray(data.messages)) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Chat init error:', error);
        }
    }, [applyState, headers]);

    // Resume an earlier conversation quietly; start a new one only when the visitor opens the chat.
    useEffect(() => {
        try {
            if (localStorage.getItem(SESSION_KEY)) {
                void initSession();
            }
        } catch {
            // ignore
        }
    }, [initSession]);

    useEffect(() => {
        if (isOpen && !sessionId && !isResetting) {
            void initSession();
        }
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen, sessionId, isResetting, initSession]);

    // A human operator can join the conversation from the admin panel; poll for their replies.
    const lastServerId = messages.reduce((max, m) => {
        const id = typeof m.id === 'number' ? m.id : Number.parseInt(String(m.id), 10);
        return Number.isNaN(id) || String(m.id).startsWith('user-') ? max : Math.max(max, id);
    }, 0);

    useEffect(() => {
        if (!sessionId) {
            return;
        }
        const timer = window.setInterval(async () => {
            if (isLoading) {
                return;
            }
            try {
                const res = await fetch(`/api/chat/poll?after_id=${lastServerId}`, { headers: headers(sessionId) });
                const data = await res.json();
                applyState(data);

                const incoming: ChatMessageItem[] = (data.messages ?? []).filter((m: ChatMessageItem) => m.sender !== 'user');
                if (incoming.length === 0) {
                    return;
                }
                setMessages((prev) => {
                    const fresh = incoming.filter((m) => !prev.some((p) => String(p.id) === String(m.id)));
                    if (fresh.length === 0) {
                        return prev;
                    }
                    if (!isOpen) {
                        setUnreadCount((count) => count + fresh.length);
                    }
                    return [...prev, ...fresh];
                });
            } catch {
                // Polling is best effort.
            }
        }, POLL_MS);

        return () => window.clearInterval(timer);
    }, [sessionId, lastServerId, isLoading, isOpen, headers, applyState]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, isLoading, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        inputRef.current?.focus({ preventScroll: true });
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    const send = async (textToSend?: string) => {
        const text = (textToSend ?? inputText).trim();
        if (!text || isLoading) {
            return;
        }

        const optimisticId = `user-${Date.now()}`;
        setMessages((prev) => [...prev, { id: optimisticId, sender: 'user', content: text, created_at: new Date().toISOString() }]);
        setInputText('');
        setIsLoading(true);

        const startedAt = Date.now();
        try {
            const res = await fetch('/api/chat/message', { method: 'POST', headers: headers(sessionId), body: JSON.stringify({ message: text }) });
            const data = await res.json();
            applyState(data);

            // Keep the typing dots up for a moment so the reply never just blinks in.
            const wait = Math.max(0, 600 - (Date.now() - startedAt));
            if (wait > 0) {
                await new Promise((resolve) => window.setTimeout(resolve, wait));
            }

            setMessages((prev) => {
                const next = prev.map((m) => (m.id === optimisticId ? { ...m, id: data.user_message_id ?? m.id } : m));
                if (data.message && !next.some((m) => String(m.id) === String(data.message.id))) {
                    next.push(data.message);
                }
                return next;
            });
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `error-${Date.now()}`,
                    sender: 'assistant',
                    content: 'Something went wrong on my side. Please try again, or contact the team directly.',
                    suggested_replies: ['What capabilities do you offer?', 'How is pricing decided?'],
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const resetChat = async () => {
        setIsResetting(true);
        try {
            const res = await fetch('/api/chat/reset', { method: 'POST', headers: headers(sessionId), body: '{}' });
            const data = await res.json();
            applyState(data);
            setMessages(Array.isArray(data.messages) ? data.messages : []);
            setInputText('');
        } catch (error) {
            console.error('Reset error:', error);
        } finally {
            setIsResetting(false);
        }
    };

    const lastAssistantIndex = messages.reduce((last, m, i) => (m.sender !== 'user' ? i : last), -1);

    return (
        <aside aria-label="Assistant" className="fixed bottom-4 right-4 z-[100] flex flex-col items-end sm:bottom-6 sm:right-6">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.96 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        onWheel={(event) => event.stopPropagation()}
                        onTouchMove={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-label="Chat assistant"
                        className={`mb-3 flex origin-bottom-right flex-col overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-[0_32px_80px_-24px_color-mix(in_srgb,var(--color-ink)_55%,transparent)] ${
                            isExpanded
                                ? 'h-[min(720px,82vh)] w-[calc(100vw-2rem)] sm:w-[640px]'
                                : 'h-[min(600px,80vh)] w-[calc(100vw-2rem)] sm:w-[400px]'
                        }`}
                    >
                        {/* Header */}
                        <div className="flex shrink-0 items-center justify-between gap-3 bg-gradient-to-br from-secondary to-ink px-5 py-4 text-white">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover shadow-md">
                                    {operatorName ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-secondary bg-emerald-400" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-sm font-bold leading-tight">
                                        {operatorName ? `${operatorName} · CuttingEdger` : 'CuttingEdger Assistant'}
                                    </span>
                                    <span className="block text-[11px] text-white/60">
                                        {operatorName ? 'Live specialist' : 'Ask about capabilities, pricing and delivery'}
                                    </span>
                                </span>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <button
                                    type="button"
                                    onClick={resetChat}
                                    disabled={isResetting}
                                    title="Start a new chat"
                                    aria-label="Start a new chat"
                                    className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    <RotateCcw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded((value) => !value)}
                                    title={isExpanded ? 'Smaller' : 'Larger'}
                                    aria-label={isExpanded ? 'Make chat smaller' : 'Make chat larger'}
                                    className="hidden h-8 w-8 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:grid"
                                >
                                    {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    title="Close"
                                    aria-label="Close chat"
                                    className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} data-scrollable className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-page px-4 py-5">
                            {messages.map((message, index) => {
                                const isUser = message.sender === 'user';
                                const isLast = index === lastAssistantIndex;

                                return (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}
                                    >
                                        {message.sender === 'operator' && (
                                            <span className="text-[10.5px] font-semibold text-primary-ink">{operatorName || 'CuttingEdger team'}</span>
                                        )}

                                        <div
                                            className={`max-w-[88%] rounded-2xl px-4 py-2.5 ${
                                                isUser
                                                    ? 'rounded-br-sm bg-gradient-to-br from-primary-hover to-primary-ink shadow-md shadow-primary/25'
                                                    : 'rounded-bl-sm border border-ink/10 bg-surface shadow-sm'
                                            }`}
                                        >
                                            <MessageText content={message.content} onDark={isUser} />
                                        </div>

                                        {!isUser && (message.tool_cards ?? []).length > 0 && (
                                            <div className="w-full max-w-[96%] space-y-2">
                                                {(message.tool_cards ?? []).map((card, i) => (
                                                    <InfoCards key={`${message.id}-${i}`} card={card} onAsk={send} />
                                                ))}
                                            </div>
                                        )}

                                        {!isUser && isLast && !isLoading && (message.suggested_replies ?? []).length > 0 && (
                                            <div className="flex max-w-[96%] flex-wrap gap-1.5">
                                                {(message.suggested_replies ?? []).map((reply) => (
                                                    <button
                                                        key={reply}
                                                        type="button"
                                                        onClick={() => send(reply)}
                                                        className="rounded-full border border-ink/10 bg-surface px-3.5 py-1.5 text-[12px] font-semibold text-ink-2 shadow-sm transition-[transform,border-color,color] duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary-ink"
                                                    >
                                                        {reply}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                            {isLoading && <TypingDots />}
                        </div>

                        {/* Input */}
                        <div className="shrink-0 border-t border-ink/10 bg-surface px-4 pb-3 pt-3">
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    void send();
                                }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputText}
                                    onChange={(event) => setInputText(event.target.value)}
                                    maxLength={2000}
                                    placeholder="Ask about capabilities, pricing or delivery…"
                                    aria-label="Your question"
                                    className="min-w-0 flex-1 rounded-full border border-ink/10 bg-page px-4 py-2.5 text-[13px] text-ink placeholder-faint outline-none transition-colors focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isLoading}
                                    aria-label="Send"
                                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-primary-hover disabled:translate-y-0 disabled:opacity-40"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                            <p className="mt-2 text-center text-[10.5px] text-subtle">
                                Information only. For quotes and orders, <Link href="/contact" prefetch className="font-semibold text-primary-ink hover:underline">contact the team</Link>.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating launcher */}
            <motion.button
                type="button"
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsOpen((value) => !value)}
                className="group relative grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-gradient-to-br from-primary via-primary to-primary-hover text-white shadow-[0_18px_36px_-10px_color-mix(in_srgb,var(--color-primary)_70%,transparent),inset_0_1px_0_rgba(255,255,255,0.45)] sm:h-16 sm:w-16"
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
                aria-expanded={isOpen}
            >
                {!isOpen && <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-primary/30 [animation-duration:2.6s]" />}
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-2 top-1 h-1/2 rounded-full bg-gradient-to-b from-white/35 to-transparent" />

                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={isOpen ? 'close' : 'chat'}
                        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                    >
                        {isOpen ? (
                            <X className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.4} />
                        ) : (
                            <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" fillOpacity={0.2} strokeWidth={2.2} />
                        )}
                    </motion.span>
                </AnimatePresence>

                {!isOpen && <span aria-hidden="true" className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-primary bg-emerald-400" />}

                {unreadCount > 0 && !isOpen && (
                    <span className="absolute -left-1 -top-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center font-mono text-[10px] font-bold text-white shadow-md">
                        {unreadCount}
                    </span>
                )}
            </motion.button>
        </aside>
    );
}
