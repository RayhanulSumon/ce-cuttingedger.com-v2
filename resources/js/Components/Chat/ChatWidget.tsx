import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    X,
    Send,
    Paperclip,
    Sparkles,
    Minimize2,
    Maximize2,
    Calendar,
    Tag,
    Clock,
    Loader2,
    ArrowRight,
    Bot,
    User,
    CheckCircle2,
    Plus,
    RotateCcw,
    Copy,
    Check,
    UploadCloud,
    FileText,
    HelpCircle,
    Pencil,
    Trash2,
} from 'lucide-react';
import { QuoteCard } from './QuoteCard';
import { CalendarSlotPicker } from './CalendarSlotPicker';
import { BookingConfirmedCard } from './BookingConfirmedCard';
import { ServiceCatalogCard } from './ServiceCatalogCard';
import { FreeTrialConfirmedCard } from './FreeTrialConfirmedCard';
import { TrialQuotaExhaustedCard } from './TrialQuotaExhaustedCard';
import { OrderConfirmedCard } from './OrderConfirmedCard';

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
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<ChatMessageItem[]>([]);
    const [inputText, setInputText] = useState('');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);
    const [showNudgeBubble, setShowNudgeBubble] = useState(false);
    const [showQuickMenu, setShowQuickMenu] = useState(false);
    const [copiedId, setCopiedId] = useState<number | string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

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

    // 1. Initialize or resume session (lazy loading: only creates DB session on chat open or when resuming)
    const initSession = (force = false) => {
        if (isResetting) return;
        const storedSession = localStorage.getItem('ce_chat_session_id');
        if (!storedSession && !force) {
            return;
        }

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
    };

    // On initial page mount: only resume if visitor already had an ongoing session in localStorage
    useEffect(() => {
        const storedSession = localStorage.getItem('ce_chat_session_id');
        if (storedSession) {
            initSession(false);
        }
    }, []);

    // When visitor clicks to open the chat widget, initialize session if not already loaded
    useEffect(() => {
        if (isOpen && !sessionId && !isResetting) {
            initSession(true);
        }
    }, [isOpen, sessionId, isResetting]);

    // 2. Auto-scroll on new messages
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            setUnreadCount(0);
            setShowNudgeBubble(false);
        }
    }, [messages, isOpen]);

    // 3. User activity tracker & Inactivity Heartbeat (only checks when user has actually chatted)
    useEffect(() => {
        const updateActivity = () => {
            lastActivityRef.current = Date.now();
        };

        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('scroll', updateActivity);

        const interval = setInterval(() => {
            const idleTimeMs = Date.now() - lastActivityRef.current;
            // Only ping if chat has a valid session and at least one message has been exchanged
            if (idleTimeMs > 90000 && sessionId && messages.length > 0) {
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

        setShowQuickMenu(false);

        // Immediate reset command handling
        if (['/reset', '/clear', 'reset', 'clear'].includes(text.toLowerCase())) {
            handleResetChat();
            return;
        }

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

        const startTime = Date.now();
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

            // Natural typing delay (minimum 750ms - 1100ms) so typing indicator feels human and authentic
            const elapsed = Date.now() - startTime;
            const targetDelay = Math.min(1100, Math.max(750, 900 - elapsed));
            if (targetDelay > 0) {
                await new Promise((resolve) => setTimeout(resolve, targetDelay));
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

    // 5. Image Upload Handler (Handles single or multiple files with 25MB limit)
    const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB server safety limit

    const uploadFiles = async (files: File[]) => {
        if (files.length === 0) return;

        const oversizedFiles = files.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
        const validFiles = files.filter((f) => f.size <= MAX_FILE_SIZE_BYTES);

        if (oversizedFiles.length > 0) {
            const oversizedNames = oversizedFiles.map((f) => `${f.name} (${(f.size / (1024 * 1024)).toFixed(1)}MB)`).join(', ');
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + Math.random(),
                    sender: 'assistant',
                    content: `⚠️ **File Size Limit Notice:**\n\n${oversizedFiles.length === 1 ? 'This file' : 'These files'} exceed our 25MB direct upload limit:\n*${oversizedNames}*\n\n📁 **For large RAW, PSD, TIFF, or batch archives**, please share a **Google Drive, Dropbox, or WeTransfer link** right here in chat! Our retouchers will download directly from your cloud folder.`,
                    suggested_replies: [
                        'How do I share a Google Drive link?',
                        'Calculate Pricing First',
                        'Schedule Consultation Call',
                    ],
                    created_at: new Date().toISOString(),
                },
            ]);
        }

        if (validFiles.length === 0) {
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setIsUploading(true);
        try {
            const uploadedUrls: string[] = [];
            const base64List: string[] = [];
            let lastFileName = '';

            for (const file of validFiles) {
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
                if (uploadRes.ok && uploadData.url) {
                    uploadedUrls.push(uploadData.url);
                    if (uploadData.base64) base64List.push(uploadData.base64);
                    lastFileName = uploadData.filename;
                } else if (uploadData.error) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now() + Math.random(),
                            sender: 'assistant',
                            content: `⚠️ ${uploadData.error}`,
                            suggested_replies: ['Share Google Drive Link', 'Schedule Consultation Call'],
                            created_at: new Date().toISOString(),
                        },
                    ]);
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

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        uploadFiles(files);
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

    // 7. Restart conversation (forces brand new session and clears cookie)
    const handleResetChat = async () => {
        setIsResetting(true);
        try {
            const res = await fetch('/api/chat/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(sessionId ? { 'X-Chat-Session-Id': sessionId } : {}),
                },
            });
            const data = await res.json();
            if (data.session_id) {
                setSessionId(data.session_id);
                localStorage.setItem('ce_chat_session_id', data.session_id);
            }
            if (data.messages && Array.isArray(data.messages)) {
                setMessages(data.messages);
            }
            setInputText('');
            setShowQuickMenu(false);
        } catch (err) {
            console.error('Reset error:', err);
        } finally {
            setIsResetting(false);
        }
    };

    // 7.5. Edit user message (rewinds conversation so user can fix typos/misspellings)
    const handleEditUserMessage = (msgId: number | string, text: string, index: number) => {
        setInputText(text);
        // Rewind messages up to this index so the user can re-send their corrected text
        setMessages((prev) => prev.slice(0, index));
    };

    // 7.6. Delete user message
    const handleDeleteUserMessage = (msgId: number | string, index: number) => {
        setMessages((prev) => prev.filter((_, i) => i !== index));
    };

    // 8. Copy message content
    const handleCopy = (id: number | string, content: string) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

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
        <aside aria-label="Live Assistant" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end">
            {/* Inactivity / Exit Nudge Bubble */}
            <AnimatePresence>
                {showNudgeBubble && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="mb-3 mr-2 p-3.5 max-w-[290px] rounded-2xl bg-[#12141a]/95 border border-[#d4ff00]/40 shadow-2xl backdrop-blur-md cursor-pointer hover:border-[#d4ff00] transition-all"
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
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragOver(true);
                        }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragOver(false);
                            const files = Array.from(e.dataTransfer.files || []).filter(
                                (f) => f.type.startsWith('image/')
                            );
                            if (files.length > 0) uploadFiles(files);
                        }}
                        className={`relative flex flex-col rounded-3xl bg-[#0b0c10]/95 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden mb-3 transition-all duration-300 ${
                            isExpanded
                                ? 'w-[calc(100vw-2rem)] sm:w-[720px] h-[min(700px,80vh)]'
                                : 'w-[calc(100vw-2rem)] sm:w-[380px] md:w-[410px] h-[min(540px,78vh)]'
                        }`}
                    >
                        {/* Drag and Drop Active Overlay */}
                        {isDragOver && (
                            <div className="absolute inset-0 z-50 bg-[#0b0c10]/90 border-2 border-dashed border-[#d4ff00] rounded-3xl flex flex-col items-center justify-center gap-3 backdrop-blur-md p-6 text-center animate-in fade-in duration-200">
                                <div className="p-4 rounded-2xl bg-[#d4ff00]/10 text-[#d4ff00]">
                                    <UploadCloud className="w-12 h-12 animate-bounce" />
                                </div>
                                <h4 className="text-base font-bold text-white font-mono">
                                    Drop Photos Here
                                </h4>
                                <p className="text-xs text-white/60 max-w-[280px]">
                                    We will analyze the complexity and provide an instant price estimate.
                                </p>
                            </div>
                        )}

                        {/* Header */}
                        <div className="px-5 py-3.5 border-b border-white/10 bg-[#12141a]/90 flex items-center justify-between shrink-0">
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
                                        <span>24/7 Studio • Instant Estimates</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={handleResetChat}
                                    disabled={isResetting}
                                    className="px-2 py-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] font-mono border border-white/5 hover:border-white/15"
                                    title="Start fresh conversation"
                                >
                                    <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin text-[#d4ff00]' : ''}`} />
                                    <span className="hidden sm:inline">{isResetting ? 'Resetting...' : 'New Chat'}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:block"
                                    title={isExpanded ? 'Collapse' : 'Expand full view'}
                                >
                                    {isExpanded ? (
                                        <Minimize2 className="w-3.5 h-3.5" />
                                    ) : (
                                        <Maximize2 className="w-3.5 h-3.5" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
                            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
                        >
                            {messages.map((msg, index) => {
                                const isUser = msg.sender === 'user';
                                const isLatestAssistant =
                                    !isUser && index === messages.length - 1;

                                return (
                                    <div
                                        key={msg.id || index}
                                        className={`flex flex-col group ${isUser ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className="relative max-w-[88%]">
                                            <div
                                                className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
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
                                                                className="w-20 h-20 object-cover rounded-lg border border-white/20 shadow-md"
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Text Content */}
                                                <p className="whitespace-pre-wrap">{renderFormattedText(msg.content)}</p>
                                            </div>

                                            {/* Copy button on hover for assistant messages */}
                                            {!isUser && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(msg.id, msg.content)}
                                                    className="opacity-0 group-hover:opacity-100 absolute -bottom-5 left-1 text-[10px] text-white/40 hover:text-white flex items-center gap-1 transition-opacity"
                                                    title="Copy response"
                                                >
                                                    {copiedId === msg.id ? (
                                                        <>
                                                            <Check className="w-2.5 h-2.5 text-[#d4ff00]" />
                                                            <span className="text-[#d4ff00]">Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-2.5 h-2.5" />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                            {/* Edit & Delete controls for user messages */}
                                            {isUser && (
                                                <div className="opacity-0 group-hover:opacity-100 absolute -bottom-5 right-1 flex items-center gap-2 text-[10px] text-white/50 transition-opacity">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditUserMessage(msg.id, msg.content, index)}
                                                        className="hover:text-[#d4ff00] flex items-center gap-1 cursor-pointer transition-colors"
                                                        title="Edit & fix typo in message"
                                                    >
                                                        <Pencil className="w-2.5 h-2.5" />
                                                        <span>Edit</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteUserMessage(msg.id, index)}
                                                        className="hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                                                        title="Remove message"
                                                    >
                                                        <Trash2 className="w-2.5 h-2.5" />
                                                        <span>Delete</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Tool Cards (Quote / Calendar / Confirmation / Upload / Info) */}
                                        {msg.tool_cards && msg.tool_cards.length > 0 && (
                                            <div className="w-full mt-2.5">
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
                                                    if (card.type === 'free_trial_confirmed_card') {
                                                        return (
                                                            <FreeTrialConfirmedCard
                                                                key={cIdx}
                                                                card={card}
                                                                onSendPrompt={(text) => handleSendMessage(text)}
                                                            />
                                                        );
                                                    }
                                                    if (card.type === 'order_confirmed_card') {
                                                        return (
                                                            <OrderConfirmedCard
                                                                key={cIdx}
                                                                card={card}
                                                                onSendPrompt={(text) => handleSendMessage(text)}
                                                                onUploadClick={() => fileInputRef.current?.click()}
                                                            />
                                                        );
                                                    }
                                                    if (card.type === 'trial_quota_exhausted_card') {
                                                        return (
                                                            <TrialQuotaExhaustedCard
                                                                key={cIdx}
                                                                card={card}
                                                                onSendPrompt={(text) => handleSendMessage(text)}
                                                            />
                                                        );
                                                    }
                                                    if (card.type === 'reset_chat_prompt_card') {
                                                        return (
                                                            <div key={cIdx} className="my-2 p-4 rounded-2xl bg-[#151720] border border-[#d4ff00]/30 shadow-lg text-left space-y-2.5 animate-in fade-in duration-200">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1.5 rounded-lg bg-[#d4ff00]/10 text-[#d4ff00]">
                                                                        <RotateCcw className="w-4 h-4" />
                                                                    </div>
                                                                    <h4 className="text-xs font-bold text-white tracking-tight">{card.title || 'Start Fresh Conversation'}</h4>
                                                                </div>
                                                                <p className="text-[11px] text-white/70 leading-relaxed">{card.description}</p>
                                                                <button
                                                                    type="button"
                                                                    onClick={handleResetChat}
                                                                    disabled={isResetting}
                                                                    className="w-full py-2 px-3 rounded-xl bg-[#d4ff00] hover:bg-[#b8dd00] text-black font-semibold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                                                >
                                                                    <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                                                                    <span>{isResetting ? 'Resetting...' : (card.cta || 'Start Fresh Chat')}</span>
                                                                </button>
                                                            </div>
                                                        );
                                                    }
                                                    if (card.type === 'upload_prompt_card') {
                                                        return (
                                                            <div key={cIdx} className="my-2 p-4 rounded-2xl bg-[#d4ff00]/10 border border-[#d4ff00]/40 shadow-xl backdrop-blur-md text-left">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="p-1.5 rounded-lg bg-[#d4ff00] text-black">
                                                                        <UploadCloud className="w-4 h-4" />
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
                                                                    <UploadCloud className="w-3.5 h-3.5" />
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
                                                    if (card.type === 'service_catalog_card' || card.type === 'service_detail_card') {
                                                        return (
                                                            <ServiceCatalogCard
                                                                key={cIdx}
                                                                card={card}
                                                                onSendPrompt={(prompt) => handleSendMessage(prompt)}
                                                            />
                                                        );
                                                    }
                                                    if (card.type === 'booking_confirmed_card') {
                                                        return (
                                                            <BookingConfirmedCard
                                                                key={cIdx}
                                                                card={card}
                                                                onReschedule={() => {
                                                                    handleSendMessage('I would like to reschedule my consultation call');
                                                                }}
                                                            />
                                                        );
                                                    }
                                                    if (card.type === 'info_card') {
                                                        const hasServices = card.services && card.services.length > 0;
                                                        const hasFaqs = card.faqs && card.faqs.length > 0;
                                                        if (!hasServices && !hasFaqs) {
                                                            return null;
                                                        }

                                                        return (
                                                            <div key={cIdx} className="my-2 p-4 rounded-2xl bg-[#151720] border border-white/10 text-left space-y-2.5">
                                                                {hasServices && (
                                                                    <div>
                                                                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4ff00] block mb-1">
                                                                            Studio Services
                                                                        </span>
                                                                        {card.services.map((s: any, sI: number) => (
                                                                            <div key={sI} className="bg-white/5 p-2 rounded-lg my-1">
                                                                                <p className="text-xs font-bold text-white">{s.title}</p>
                                                                                <p className="text-[11px] text-white/60">{s.subtitle}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {hasFaqs && (
                                                                    <div>
                                                                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#00f5ff] block mb-1">
                                                                            FAQ Answers
                                                                        </span>
                                                                        {card.faqs.map((f: any, fI: number) => (
                                                                            <div key={fI} className="bg-white/5 p-2 rounded-lg my-1">
                                                                                <p className="text-xs font-semibold text-white">Q: {f.q}</p>
                                                                                <p className="text-[11px] text-white/70 mt-0.5">{f.a}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                        )}

                                        {/* INLINE SUGGESTION PILLS (Only directly below latest assistant message) */}
                                        {isLatestAssistant &&
                                            msg.suggested_replies &&
                                            msg.suggested_replies.length > 0 &&
                                            !isLoading && (
                                                <div className="mt-3 flex flex-wrap gap-1.5 w-full">
                                                    {msg.suggested_replies.map((reply, rIdx) => (
                                                        <button
                                                            key={rIdx}
                                                            type="button"
                                                            onClick={() => handleSendMessage(reply)}
                                                            className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#d4ff00]/15 hover:text-[#d4ff00] hover:border-[#d4ff00]/30 text-white/80 border border-white/10 transition-all text-left flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                                                        >
                                                            <span>{reply}</span>
                                                            <ArrowRight className="w-2.5 h-2.5 opacity-50 shrink-0" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                    </div>
                                );
                            })}

                            {/* Realistic Typing Indicator Bubble */}
                            {isLoading && (
                                <div className="flex items-start gap-2 max-w-[85%] animate-in fade-in duration-200">
                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#d4ff00]/20 to-[#00f5ff]/20 border border-white/15 flex items-center justify-center text-[#d4ff00] shrink-0 mt-0.5">
                                        <Bot className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="rounded-2xl rounded-tl-xs px-3.5 py-2.5 bg-[#151720] border border-white/10 shadow-md flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-bounce" />
                                        </div>
                                        <span className="text-[11px] font-mono text-white/50">CuttingEdger is typing...</span>
                                    </div>
                                </div>
                            )}

                            {isUploading && (
                                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#151720] border border-[#00f5ff]/30 text-[#00f5ff] text-xs w-fit">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span className="font-mono text-[11px]">Uploading sample photo batch...</span>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Box with + Quick Actions Menu */}
                        <div className="p-3 border-t border-white/10 bg-[#12141a] relative">
                            {/* Quick Actions Popover Menu */}
                            <AnimatePresence>
                                {showQuickMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full left-3 mb-2 w-72 rounded-2xl bg-[#151720]/95 border border-white/15 shadow-2xl backdrop-blur-xl p-2 z-50 space-y-1 font-mono text-xs"
                                    >
                                        <div className="px-2.5 py-1.5 text-[10px] text-white/40 uppercase tracking-wider font-bold border-b border-white/5">
                                            Quick Actions
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleSendMessage('Get an Instant Quote')}
                                            className="w-full px-2.5 py-2 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                                        >
                                            <Tag className="w-3.5 h-3.5 text-[#d4ff00]" />
                                            <span>Get Instant Quote</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSendMessage('Claim 3 Free Sample Edits')}
                                            className="w-full px-2.5 py-2 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
                                            <span>Claim 3 Free Sample Edits</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSendMessage('Schedule Consultation Call')}
                                            className="w-full px-2.5 py-2 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                                        >
                                            <Calendar className="w-3.5 h-3.5 text-[#00f5ff]" />
                                            <span>Book 15-Min Technical Call</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSendMessage('Turnaround SLAs')}
                                            className="w-full px-2.5 py-2 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                                        >
                                            <Clock className="w-3.5 h-3.5 text-[#ff3e8a]" />
                                            <span>Turnaround & SLAs</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowQuickMenu(false);
                                                fileInputRef.current?.click();
                                            }}
                                            className="w-full px-2.5 py-2 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-white/5 pt-2"
                                        >
                                            <UploadCloud className="w-3.5 h-3.5 text-white/60" />
                                            <span>Upload Batch Photos</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

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
                                    onChange={handleFileInputChange}
                                    accept="image/jpeg,image/png,image/webp,image/tiff"
                                    multiple
                                    className="hidden"
                                />

                                {/* Plus / Quick Action Toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowQuickMenu(!showQuickMenu)}
                                    title="Quick Actions Menu"
                                    className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                                        showQuickMenu
                                            ? 'bg-[#d4ff00] text-black rotate-45'
                                            : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                                    }`}
                                >
                                    <Plus className="w-4 h-4 transition-transform" />
                                </button>

                                {/* Paperclip Upload */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Attach sample photos"
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0 cursor-pointer"
                                >
                                    <Paperclip className="w-4 h-4" />
                                </button>

                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ask a question, pricing, turnaround, or edits..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#d4ff00] transition-colors"
                                />

                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isLoading}
                                    className="p-2 rounded-xl bg-[#d4ff00] hover:bg-[#b8dd00] text-black transition-all disabled:opacity-30 disabled:hover:bg-[#d4ff00] shrink-0 cursor-pointer shadow-md shadow-[#d4ff00]/20"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>

                            <div className="flex items-center justify-between text-[10px] text-white/40 pt-1.5 px-1 font-mono">
                                <span>We reply instantly • Ask us anything</span>
                                <span className="flex items-center gap-1 text-white/50">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" /> 100% Confidential
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
                className="relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-tr from-[#12141a] to-[#1c1f2b] border border-[#d4ff00]/40 text-[#d4ff00] shadow-2xl hover:border-[#d4ff00] transition-all flex items-center justify-center group cursor-pointer"
                aria-label="Toggle AI Chat Dialog"
            >
                {/* Glow ring */}
                <span className="absolute inset-0 rounded-2xl bg-[#d4ff00]/20 blur-md group-hover:bg-[#d4ff00]/30 transition-all -z-10" />

                {isOpen ? (
                    <Minimize2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                    <>
                        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[#d4ff00]" />
                        {/* Status dot */}
                        <span className="absolute -top-1 -right-1 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-[#d4ff00] border-2 border-[#0a0b0e]" />
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
