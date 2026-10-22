import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    X,
    Send,
    Paperclip,
    Sparkles,
    Minimize2,
    Calendar,
    Tag,
    Clock,
    Loader2,
    ArrowUpRight,
    Bot,
    User,
    CheckCircle2,
} from 'lucide-react';
import { QuoteCard } from './QuoteCard';
import { CalendarSlotPicker } from './CalendarSlotPicker';
import { BookingConfirmedCard } from './BookingConfirmedCard';

interface ChatMessageItem {
    id: number | string;
    sender: 'user' | 'assistant' | 'system';
    content: string;
    attachments?: string[];
    tool_cards?: any[];
    suggested_replies?: string[];
    created_at?: string;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessageItem[]>([]);
    const [inputText, setInputText] = useState('');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);
    const [showNudgeBubble, setShowNudgeBubble] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const lastActivityRef = useRef<number>(Date.now());

    // Prevent Lenis smooth scroll from intercepting mouse wheel/touch in messages
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const stopScrollPropagation = (e: Event) => {
            e.stopPropagation();
        };

        el.addEventListener('wheel', stopScrollPropagation, { passive: false });
        el.addEventListener('touchmove', stopScrollPropagation, { passive: false });

        return () => {
            el.removeEventListener('wheel', stopScrollPropagation);
            el.removeEventListener('touchmove', stopScrollPropagation);
        };
    }, [isOpen]);

    // 1. Initialize or resume session
    useEffect(() => {
        const storedSession = localStorage.getItem('ce_chat_session_id');
        fetch('/api/chat/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...(storedSession ? { 'X-Chat-Session-Id': storedSession } : {}),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.session_id) {
                    setSessionId(data.session_id);
                    localStorage.setItem('ce_chat_session_id', data.session_id);
                }
                if (data.messages && Array.isArray(data.messages)) {
                    setMessages(data.messages);
                }
            })
            .catch((err) => console.error('Chat init error:', err));
    }, []);

    // 2. Auto-scroll on new messages
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            setUnreadCount(0);
            setShowNudgeBubble(false);
        }
    }, [messages, isOpen]);

    // 3. User activity tracker & Inactivity Heartbeat (Checks if paused for > 2 min)
    useEffect(() => {
        const updateActivity = () => {
            lastActivityRef.current = Date.now();
        };

        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('scroll', updateActivity);

        const interval = setInterval(() => {
            const idleTimeMs = Date.now() - lastActivityRef.current;
            // If idle on page for > 90 seconds
            if (idleTimeMs > 90000 && sessionId) {
                fetch('/api/chat/inactivity-check', {
                    headers: {
                        'X-Chat-Session-Id': sessionId,
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.nudge) {
                            setMessages((prev) => [...prev, data.nudge]);
                            setNudgeMessage(data.nudge.content);
                            if (!isOpen) {
                                setShowNudgeBubble(true);
                                setUnreadCount((c) => c + 1);
                            }
                        }
                    })
                    .catch(() => {});
            }
        }, 30000);

        return () => {
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('scroll', updateActivity);
            clearInterval(interval);
        };
    }, [sessionId, isOpen]);

    // 4. Send Message Handler
    const handleSendMessage = async (textToSend?: string) => {
        const text = (textToSend || inputText).trim();
        if (!text || isLoading) return;

        const optimisticId = `user-${Date.now()}`;
        const newMsg: ChatMessageItem = {
            id: optimisticId,
            sender: 'user',
            content: text,
            created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(sessionId ? { 'X-Chat-Session-Id': sessionId } : {}),
                },
                body: JSON.stringify({ message: text }),
            });

            const data = await res.json();
            if (data.session_id) {
                setSessionId(data.session_id);
                localStorage.setItem('ce_chat_session_id', data.session_id);
            }

            if (data.message) {
                setMessages((prev) => [...prev, data.message]);
            }
        } catch (err) {
            console.error('Error sending message:', err);
            setMessages((prev) => [
                ...prev,
                {
                    id: `error-${Date.now()}`,
                    sender: 'assistant',
                    content: "I had a brief connection glitch. Please choose one of the options below or ask again!",
                    suggested_replies: ['Calculate Pricing', 'Schedule a Call', 'Claim 3 Free Edits'],
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // 5. Image Upload Handler
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadedUrls: string[] = [];
            const base64List: string[] = [];
            let lastFileName = '';

            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);

                const uploadRes = await fetch('/api/chat/upload', {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        ...(sessionId ? { 'X-Chat-Session-Id': sessionId } : {}),
                    },
                    body: formData,
                });

                const uploadData = await uploadRes.json();
                if (uploadData.url) {
                    uploadedUrls.push(uploadData.url);
                    if (uploadData.base64) base64List.push(uploadData.base64);
                    lastFileName = uploadData.filename;
                }
            }

            if (uploadedUrls.length > 0) {
                const msgText = uploadedUrls.length === 1
                    ? `Uploaded sample image: ${lastFileName}`
                    : `Uploaded batch of ${uploadedUrls.length} images for editing`;

                const msgRes = await fetch('/api/chat/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        ...(sessionId ? { 'X-Chat-Session-Id': sessionId } : {}),
                    },
                    body: JSON.stringify({
                        message: msgText,
                        attachments: uploadedUrls,
                        images_base64: base64List,
                    }),
                });

                const data = await msgRes.json();
                if (data.message) {
                    setMessages((prev) => [...prev, data.message]);
                }
            }
        } catch (err) {
            console.error('Upload error:', err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // 6. Slot Booking Submission
    const handleBookSlot = async (bookingData: any) => {
        const res = await fetch('/api/chat/book-slot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...(sessionId ? { 'X-Chat-Session-Id': sessionId } : {}),
            },
            body: JSON.stringify(bookingData),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Unable to confirm booking');
        }

        if (data.message) {
            setMessages((prev) => [...prev, data.message]);
        }
    };

    const latestSuggestedReplies = messages[messages.length - 1]?.suggested_replies || [];

    // Helper for rendering simple markdown bold
    const renderFormattedText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={i} className="text-white font-semibold">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return part;
        });
    };

    return (
        <aside aria-label="Live Assistant" className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {/* Inactivity / Exit Nudge Bubble */}
            <AnimatePresence>
                {showNudgeBubble && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="mb-3 mr-2 p-3.5 max-w-[280px] rounded-2xl bg-[#12141a]/95 border border-[#d4ff00]/40 shadow-2xl backdrop-blur-md cursor-pointer hover:border-[#d4ff00] transition-all"
                    >
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#d4ff00] flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Quick Question?
                            </span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowNudgeBubble(false);
                                }}
                                className="text-white/40 hover:text-white"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                        <p className="text-xs text-white/90 leading-relaxed">
                            {nudgeMessage || "Test our quality with 3 free image edits! Zero cost, zero commitment."}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Dialog Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        data-lenis-prevent="true"
                        data-lenis-prevent-wheel="true"
                        data-lenis-prevent-touch="true"
                        className="w-[360px] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col rounded-3xl bg-[#0b0c10]/95 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden mb-3"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-white/10 bg-[#12141a]/80 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#d4ff00]/20 to-[#00f5ff]/20 border border-white/20 flex items-center justify-center text-[#d4ff00]">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#d4ff00] ring-2 ring-[#0b0c10]" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-white tracking-tight">CuttingEdger Assistant</h3>
                                    </div>
                                    <p className="text-[10px] text-white/50 font-mono flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse" />
                                        <span>Instant Retouch Quotes & Booking</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                    title="Close chat"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Scroll Area */}
                        <div
                            ref={scrollContainerRef}
                            data-lenis-prevent="true"
                            data-lenis-prevent-wheel="true"
                            data-lenis-prevent-touch="true"
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                            style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
                            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10"
                        >
                            {messages.map((msg, index) => {
                                const isUser = msg.sender === 'user';
                                return (
                                    <div
                                        key={msg.id || index}
                                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                                                isUser
                                                    ? 'bg-[#d4ff00] text-black font-medium rounded-br-xs shadow-md shadow-[#d4ff00]/10'
                                                    : 'bg-[#151720] text-white/90 border border-white/5 rounded-bl-xs shadow-md'
                                            }`}
                                        >
                                            {/* Attached Images */}
                                            {msg.attachments && msg.attachments.length > 0 && (
                                                <div className="mb-2 flex flex-wrap gap-1.5">
                                                    {msg.attachments.map((url, i) => (
                                                        <img
                                                            key={i}
                                                            src={url}
                                                            alt="Attached sample"
                                                            className="w-16 h-16 object-cover rounded-lg border border-white/20"
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Text Content */}
                                            <p className="whitespace-pre-wrap">{renderFormattedText(msg.content)}</p>
                                        </div>

                                        {/* Tool Cards (Quote / Calendar / Confirmation / Upload) */}
                                        {msg.tool_cards && msg.tool_cards.length > 0 && (
                                            <div className="w-full mt-2">
                                                {msg.tool_cards.map((card: any, cIdx: number) => {
                                                    if (card.type === 'quote_card') {
                                                        return (
                                                            <QuoteCard
                                                                key={cIdx}
                                                                card={card}
                                                                onSelectReply={(text) => handleSendMessage(text)}
                                                                onUploadClick={() => fileInputRef.current?.click()}
                                                            />
                                                        );
                                                    }
                                                    if (card.type === 'upload_prompt_card') {
                                                        return (
                                                            <div key={cIdx} className="my-2 p-4 rounded-2xl bg-[#d4ff00]/10 border border-[#d4ff00]/40 shadow-xl backdrop-blur-md text-left">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="p-1.5 rounded-lg bg-[#d4ff00] text-black">
                                                                        <Paperclip className="w-4 h-4" />
                                                                    </span>
                                                                    <div>
                                                                        <h4 className="text-sm font-bold text-white tracking-tight">{card.title}</h4>
                                                                        <span className="text-[10px] text-[#d4ff00] font-mono">Ready to process</span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-white/80 my-2 leading-relaxed">{card.description}</p>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => fileInputRef.current?.click()}
                                                                    className="w-full py-2.5 px-4 rounded-xl bg-[#d4ff00] hover:bg-[#b8dd00] text-black font-semibold text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#d4ff00]/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                                                                >
                                                                    <Paperclip className="w-3.5 h-3.5" />
                                                                    <span>{card.cta || 'Select Images to Upload'}</span>
                                                                </button>
                                                            </div>
                                                        );
                                                    }
                                                    if (card.type === 'calendar_slot_picker') {
                                                        return (
                                                            <CalendarSlotPicker
                                                                key={cIdx}
                                                                card={card}
                                                                onBookSlot={handleBookSlot}
                                                            />
                                                        );
                                                    }
                                                    if (card.type === 'booking_confirmed_card') {
                                                        return <BookingConfirmedCard key={cIdx} card={card} />;
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Loading Indicator */}
                            {isLoading && (
                                <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#151720] border border-white/5 text-white/60 text-xs w-fit">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4ff00]" />
                                    <span className="font-mono text-[11px]">Thinking & calculating...</span>
                                </div>
                            )}

                            {isUploading && (
                                <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#151720] border border-[#00f5ff]/30 text-[#00f5ff] text-xs w-fit">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span className="font-mono text-[11px]">Uploading sample photo...</span>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Quick Reply Chips */}
                        {latestSuggestedReplies.length > 0 && !isLoading && (
                            <div className="px-4 py-2 border-t border-white/5 bg-[#0e1015]/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                                {latestSuggestedReplies.map((reply, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleSendMessage(reply)}
                                        className="text-[11px] font-mono px-3 py-1 rounded-full bg-white/5 hover:bg-[#d4ff00]/10 hover:text-[#d4ff00] text-white/70 whitespace-nowrap border border-white/5 transition-all shrink-0 active:scale-95"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Box */}
                        <div className="p-3 border-t border-white/10 bg-[#12141a]">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/jpeg,image/png,image/webp,image/tiff"
                                    multiple
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Drop or upload a photo to calculate price"
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0"
                                >
                                    <Paperclip className="w-4 h-4" />
                                </button>

                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type a question or ask for a quote..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#d4ff00] transition-colors"
                                />

                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isLoading}
                                    className="p-2 rounded-xl bg-[#d4ff00] hover:bg-[#b8dd00] text-black transition-all disabled:opacity-30 disabled:hover:bg-[#d4ff00] shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                            <div className="flex items-center justify-between text-[10px] text-white/40 pt-1.5 px-1 font-mono">
                                <span>Drop image for instant price</span>
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" /> 24/7 Studio Ready
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Launcher Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-4 rounded-2xl bg-gradient-to-tr from-[#12141a] to-[#1c1f2b] border border-[#d4ff00]/40 text-[#d4ff00] shadow-2xl hover:border-[#d4ff00] transition-all flex items-center justify-center group"
                aria-label="Toggle AI Chat Dialog"
            >
                {/* Glow ring */}
                <span className="absolute inset-0 rounded-2xl bg-[#d4ff00]/20 blur-md group-hover:bg-[#d4ff00]/30 transition-all -z-10" />

                {isOpen ? (
                    <Minimize2 className="w-6 h-6 text-white" />
                ) : (
                    <>
                        <MessageSquare className="w-6 h-6 text-[#d4ff00]" />
                        {/* Status dot */}
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#d4ff00] border-2 border-[#0a0b0e]" />
                    </>
                )}

                {unreadCount > 0 && !isOpen && (
                    <span className="absolute -top-2 -left-2 px-1.5 py-0.5 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold shadow-md">
                        {unreadCount}
                    </span>
                )}
            </motion.button>
        </aside>
    );
}
