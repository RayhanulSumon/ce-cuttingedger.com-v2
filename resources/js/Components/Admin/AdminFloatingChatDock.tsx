import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, router } from "@inertiajs/react";
import {
    MessageSquare,
    X,
    Minus,
    Maximize2,
    Send,
    Bot,
    User,
    CheckCheck,
    Check,
    AlertCircle,
    ExternalLink,
    Loader2,
    Shield,
    Radio,
} from "lucide-react";
import { echo } from "@laravel/echo-react";
import { cn } from "@/lib/utils";

interface FloatingSession {
    sessionId: string;
    leadName: string;
    isMinimized: boolean;
    unreadCount?: number;
}

interface BannerAlert {
    sessionId: string;
    leadName: string;
    userText: string;
    ipAddress?: string;
    adminUrl?: string;
}

interface FloatingMessage {
    id: number | string;
    sender: "user" | "assistant" | "system" | "operator";
    content: string;
    is_read?: boolean;
    created_at_formatted?: string;
}

function playAlertChime() {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch {
        // AudioContext silent catch
    }
}

export function AdminFloatingChatDock() {
    const [floatingChats, setFloatingChats] = useState<FloatingSession[]>([]);
    const [bannerAlert, setBannerAlert] = useState<BannerAlert | null>(null);

    // Listen on Reverb admin-notifications channel
    useEffect(() => {
        try {
            const echoInstance = echo();
            if (!echoInstance) return;

            const channel = echoInstance.channel("admin-notifications");

            const handleTakeover = (data: any) => {
                playAlertChime();
                setBannerAlert({
                    sessionId: data.session_id,
                    leadName: data.lead_name || "Anonymous Visitor",
                    userText: data.user_text || "Requested to speak with a human specialist.",
                    ipAddress: data.ip_address,
                    adminUrl: data.admin_url,
                });
            };

            channel.listen("LiveChatTakeoverRequested", handleTakeover);
            channel.listen(".LiveChatTakeoverRequested", handleTakeover);
            channel.listen("chat.takeover_requested", handleTakeover);
            channel.listen(".chat.takeover_requested", handleTakeover);

            return () => {
                echoInstance.leaveChannel("admin-notifications");
            };
        } catch {
            // Echo connection safe catch
        }
    }, []);

    // Global custom event listener to open a floating chat window from anywhere in the admin UI
    useEffect(() => {
        const handleOpenEvent = (e: any) => {
            const { sessionId, leadName } = e.detail || {};
            if (!sessionId) return;
            openFloatingChat(sessionId, leadName || "Visitor");
        };

        window.addEventListener("open-admin-floating-chat", handleOpenEvent);
        return () => window.removeEventListener("open-admin-floating-chat", handleOpenEvent);
    }, []);

    const openFloatingChat = (sessionId: string, leadName: string) => {
        setFloatingChats((prev) => {
            const existing = prev.find((c) => c.sessionId === sessionId);
            if (existing) {
                return prev.map((c) =>
                    c.sessionId === sessionId ? { ...c, isMinimized: false } : c
                );
            }
            // Limit to at most 3 simultaneous floating cards
            const trimmed = prev.length >= 3 ? prev.slice(1) : prev;
            return [...trimmed, { sessionId, leadName, isMinimized: false }];
        });
    };

    const closeFloatingChat = (sessionId: string) => {
        setFloatingChats((prev) => prev.filter((c) => c.sessionId !== sessionId));
    };

    const toggleMinimize = (sessionId: string) => {
        setFloatingChats((prev) =>
            prev.map((c) =>
                c.sessionId === sessionId ? { ...c, isMinimized: !c.isMinimized } : c
            )
        );
    };

    return (
        <>
            {/* Top-Right Instant Live Chat Alert Banner */}
            {bannerAlert && (
                <div className="fixed top-18 right-6 z-50 w-96 rounded-2xl bg-[#141724] border border-amber-500/50 shadow-2xl p-4 text-white animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                            </span>
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                                🚨 Live Chat Takeover Requested
                            </span>
                        </div>
                        <button
                            onClick={() => setBannerAlert(null)}
                            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="mt-2.5 bg-black/40 rounded-xl p-2.5 border border-white/5">
                        <div className="text-xs font-semibold text-white truncate">
                            {bannerAlert.leadName}
                        </div>
                        <div className="text-[11px] text-neutral-300 mt-0.5 line-clamp-2 italic">
                            "{bannerAlert.userText}"
                        </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                        <button
                            onClick={() => {
                                openFloatingChat(bannerAlert.sessionId, bannerAlert.leadName);
                                setBannerAlert(null);
                            }}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <Radio className="w-3.5 h-3.5 animate-pulse" />
                            <span>Join Live Chat</span>
                        </button>
                        <Link
                            href={`/admin/chat-sessions?id=${bannerAlert.sessionId}`}
                            onClick={() => setBannerAlert(null)}
                            className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors flex items-center gap-1"
                        >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Bottom-Right Dock of Floating Chat Windows */}
            <div className="fixed bottom-3 right-6 z-50 flex items-end gap-3 pointer-events-none">
                {floatingChats.map((chat) => (
                    <div key={chat.sessionId} className="pointer-events-auto">
                        <FloatingChatCard
                            sessionId={chat.sessionId}
                            leadName={chat.leadName}
                            isMinimized={chat.isMinimized}
                            onToggleMinimize={() => toggleMinimize(chat.sessionId)}
                            onClose={() => closeFloatingChat(chat.sessionId)}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

function FloatingChatCard({
    sessionId,
    leadName,
    isMinimized,
    onToggleMinimize,
    onClose,
}: {
    sessionId: string;
    leadName: string;
    isMinimized: boolean;
    onToggleMinimize: () => void;
    onClose: () => void;
}) {
    const [messages, setMessages] = useState<FloatingMessage[]>([]);
    const [chatMode, setChatMode] = useState<"bot" | "operator">("bot");
    const [operatorName, setOperatorName] = useState<string | null>(null);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastTypingSentRef = useRef<number>(0);

    // Initial load transcript
    useEffect(() => {
        fetch(`/admin/chat-sessions/${sessionId}`, {
            headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.session) {
                    setChatMode(data.session.mode || "bot");
                    setOperatorName(data.session.operator_name || null);
                }
                if (data.messages) {
                    setMessages(data.messages);
                }
            })
            .catch(() => {});
    }, [sessionId]);

    // Native mouse wheel scroll handler
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const handleWheel = (e: WheelEvent) => {
            e.stopPropagation();
            el.scrollTop += e.deltaY;
        };
        el.addEventListener("wheel", handleWheel, { passive: true });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [isMinimized]);

    // Reverb WebSocket subscription for this session
    useEffect(() => {
        try {
            const echoInstance = echo();
            if (!echoInstance) return;

            const channel = echoInstance.channel(`chat.${sessionId}`);

            const onMessage = (data: any) => {
                const newMsg = data.message || data;
                setMessages((prev) => {
                    if (prev.some((m) => String(m.id) === String(newMsg.id))) return prev;
                    return [...prev, newMsg];
                });
                if (isMinimized && newMsg.sender === "user") {
                    setUnreadCount((c) => c + 1);
                    playAlertChime();
                }
            };

            const onRead = (data: any) => {
                const ids = data.message_ids || [];
                setMessages((prev) =>
                    prev.map((m) =>
                        ids.length === 0 || ids.includes(m.id) ? { ...m, is_read: true } : m
                    )
                );
            };

            const onTyping = (data: any) => {
                if (data.sender === "user" && data.is_typing) {
                    setIsUserTyping(true);
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => setIsUserTyping(false), 3500);
                } else if (data.sender === "user" && !data.is_typing) {
                    setIsUserTyping(false);
                }
            };

            channel.listen("ChatMessageSent", onMessage);
            channel.listen(".ChatMessageSent", onMessage);
            channel.listen("ChatMessageRead", onRead);
            channel.listen(".ChatMessageRead", onRead);
            channel.listen("ChatUserTyping", onTyping);
            channel.listen(".ChatUserTyping", onTyping);

            return () => {
                echoInstance.leaveChannel(`chat.${sessionId}`);
            };
        } catch {}
    }, [sessionId, isMinimized]);

    useEffect(() => {
        if (!isMinimized) {
            setUnreadCount(0);
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isMinimized]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const text = inputText.trim();
        if (!text || isLoading) return;

        setInputText("");
        setIsLoading(true);

        try {
            const res = await fetch(`/admin/chat-sessions/${sessionId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as any)?.content || "",
                },
                body: JSON.stringify({ content: text }),
            });
            const data = await res.json();
            if (data.message) {
                setChatMode("operator");
                setMessages((prev) => {
                    if (prev.some((m) => String(m.id) === String(data.message.id))) return prev;
                    return [...prev, data.message];
                });
            }
        } catch {
        } finally {
            setIsLoading(false);
        }
    };

    const handleTakeoverToggle = async () => {
        const endpoint =
            chatMode === "operator"
                ? `/admin/chat-sessions/${sessionId}/release`
                : `/admin/chat-sessions/${sessionId}/takeover`;

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as any)?.content || "",
                },
            });
            const data = await res.json();
            if (data.session) {
                setChatMode(data.session.mode);
                setOperatorName(data.session.operator_name || null);
            }
            if (data.announcement) {
                setMessages((prev) => [...prev, data.announcement]);
            }
        } catch {}
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
        const now = Date.now();
        if (now - lastTypingSentRef.current > 1500) {
            lastTypingSentRef.current = now;
            fetch(`/admin/chat-sessions/${sessionId}/typing`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as any)?.content || "",
                },
                body: JSON.stringify({ is_typing: true }),
            }).catch(() => {});
        }
    };

    if (isMinimized) {
        return (
            <button
                onClick={onToggleMinimize}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#141724] border border-cyan-500/40 shadow-xl text-white hover:bg-[#1a1e30] transition-all cursor-pointer"
            >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold max-w-[120px] truncate">{leadName}</span>
                {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                        {unreadCount}
                    </span>
                )}
            </button>
        );
    }

    return (
        <div className="w-84 sm:w-90 h-[460px] rounded-2xl bg-[#0e1017] border border-white/15 shadow-2xl flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="p-3 bg-[#141722] border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                    <span
                        className={cn(
                            "w-2 h-2 rounded-full shrink-0",
                            chatMode === "operator" ? "bg-cyan-400 animate-pulse" : "bg-neutral-500"
                        )}
                    />
                    <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{leadName}</div>
                        <div className="text-[10px] font-mono text-neutral-400">
                            {chatMode === "operator" ? `Live (${operatorName || "You"})` : "AI Bot"}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={handleTakeoverToggle}
                        title={chatMode === "operator" ? "Release to Bot" : "Take Over Chat"}
                        className={cn(
                            "px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer",
                            chatMode === "operator"
                                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25"
                                : "bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
                        )}
                    >
                        {chatMode === "operator" ? "Release" : "Takeover"}
                    </button>
                    <Link
                        href={`/admin/chat-sessions?id=${sessionId}`}
                        title="Open Full Messenger"
                        className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                        onClick={onToggleMinimize}
                        title="Minimize"
                        className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={onClose}
                        title="Close"
                        className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Messages Feed */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#090a0f] text-xs"
            >
                {messages.map((m) => {
                    const isUser = m.sender === "user";
                    const isOperator = m.sender === "operator";
                    return (
                        <div
                            key={m.id}
                            className={cn(
                                "flex flex-col max-w-[85%]",
                                isUser ? "ml-auto items-end" : "mr-auto items-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "p-2.5 rounded-2xl text-[12px] leading-relaxed break-words shadow-xs",
                                    isUser
                                        ? "bg-amber-500/20 text-amber-50 border border-amber-500/30 rounded-tr-xs"
                                        : isOperator
                                        ? "bg-cyan-950/70 text-cyan-50 border border-cyan-500/30 rounded-tl-xs"
                                        : "bg-[#161822] text-neutral-200 border border-white/10 rounded-tl-xs"
                                )}
                            >
                                {m.content}
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-neutral-500 mt-0.5 px-1 font-mono">
                                <span>{m.created_at_formatted || ""}</span>
                                {isUser && (
                                    <span>
                                        {m.is_read ? (
                                            <CheckCheck className="w-3 h-3 text-cyan-400 inline" />
                                        ) : (
                                            <Check className="w-3 h-3 text-neutral-500 inline" />
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}

                {isUserTyping && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] w-fit font-mono">
                        <span>Client is typing</span>
                        <span className="flex gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-amber-400 animate-bounce" />
                            <span className="w-1 h-1 rounded-full bg-amber-400 animate-bounce [animation-delay:150ms]" />
                            <span className="w-1 h-1 rounded-full bg-amber-400 animate-bounce [animation-delay:300ms]" />
                        </span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-2.5 bg-[#141722] border-t border-white/10 flex items-center gap-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Type live message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-30 transition-all cursor-pointer"
                >
                    <Send className="w-3.5 h-3.5" />
                </button>
            </form>
        </div>
    );
}

