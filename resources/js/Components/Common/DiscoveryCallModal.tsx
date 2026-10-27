import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    X,
    CheckCircle2,
    Loader2,
    Sparkles,
    Shield,
    Video,
    AlertCircle,
} from 'lucide-react';

interface AvailableDay {
    date: string;
    label: string;
    slots: Array<{
        time: string;
        iso: string;
    }>;
}

interface DiscoveryCallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DiscoveryCallModal({ isOpen, onClose }: DiscoveryCallModalProps) {
    const [days, setDays] = useState<AvailableDay[]>([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState<{ time: string; iso: string } | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [service, setService] = useState('Catalog Optimization & Retouching');
    const [notes, setNotes] = useState('');
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [confirmedBooking, setConfirmedBooking] = useState<{
        datetime_formatted: string;
        name: string;
        email: string;
    } | null>(null);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Fetch live slots whenever modal opens
    useEffect(() => {
        if (!isOpen) {
            setConfirmedBooking(null);
            setErrorMessage(null);
            return;
        }

        setIsLoadingSlots(true);
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

        fetch(`/api/chat/available-slots?timezone=${encodeURIComponent(timezone)}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.days && Array.isArray(data.days) && data.days.length > 0) {
                    setDays(data.days);
                    setSelectedDayIndex(0);
                    if (data.days[0].slots && data.days[0].slots.length > 0) {
                        setSelectedSlot(data.days[0].slots[0]);
                    }
                }
            })
            .catch((err) => {
                console.error('Failed to load consultation slots:', err);
                // Fallback static upcoming days
                const now = new Date();
                const fallbackDays: AvailableDay[] = [];
                for (let i = 1; i <= 4; i++) {
                    const d = new Date(now);
                    d.setDate(d.getDate() + i);
                    if (d.getDay() === 0 || d.getDay() === 6) continue;
                    fallbackDays.push({
                        date: d.toISOString().split('T')[0],
                        label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                        slots: [
                            { time: '10:00 AM', iso: new Date(d.setHours(10, 0, 0, 0)).toISOString() },
                            { time: '11:30 AM', iso: new Date(d.setHours(11, 30, 0, 0)).toISOString() },
                            { time: '02:00 PM', iso: new Date(d.setHours(14, 0, 0, 0)).toISOString() },
                            { time: '03:30 PM', iso: new Date(d.setHours(15, 30, 0, 0)).toISOString() },
                        ],
                    });
                }
                setDays(fallbackDays);
                if (fallbackDays[0]?.slots[0]) {
                    setSelectedSlot(fallbackDays[0].slots[0]);
                }
            })
            .finally(() => {
                setIsLoadingSlots(false);
            });
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!selectedSlot) {
            setErrorMessage('Please pick an available time slot.');
            return;
        }

        if (!name.trim() || !email.trim()) {
            setErrorMessage('Please enter your full name and work email.');
            return;
        }

        setIsSubmitting(true);

        try {
            const storedSession = localStorage.getItem('ce_chat_session_id');

            const res = await fetch('/api/chat/book-slot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(storedSession ? { 'X-Chat-Session-Id': storedSession } : {}),
                },
                body: JSON.stringify({
                    slot_datetime: selectedSlot.iso,
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim() || null,
                    service: service,
                    notes: notes.trim() || null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage(data.message || 'Unable to confirm appointment. Please try another slot.');
                return;
            }

            setConfirmedBooking({
                datetime_formatted: data.datetime_formatted || selectedSlot.time,
                name: name.trim(),
                email: email.trim(),
            });
        } catch (err) {
            console.error('Booking submission error:', err);
            setErrorMessage('Connection error. Please try again or reach us at contact@cuttingedger.com.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const activeDay = days[selectedDayIndex] || days[0];

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50 duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="w-full max-w-2xl bg-[#0e1017] border border-white/15 rounded-3xl shadow-2xl overflow-hidden relative text-white animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Strip */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-accent/10 border border-accent/30 text-accent">
                            <Video className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-sm tracking-tight text-white flex items-center gap-2">
                                <span>Schedule a Visual Performance Discovery Call</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent/15 text-accent border border-accent/30 font-semibold">
                                    15-Min Live Screen Share
                                </span>
                            </h3>
                            <p className="text-[11px] text-neutral-400">
                                Review catalog standards, SLA turnaround, and custom volume pricing.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6">
                    {confirmedBooking ? (
                        /* Success View */
                        <div className="py-8 text-center space-y-4 animate-in fade-in-50 duration-300">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-xl font-display font-bold text-white">
                                    Consultation Call Confirmed!
                                </h4>
                                <p className="text-xs text-neutral-300 max-w-md mx-auto">
                                    We have reserved your slot for <span className="text-accent font-mono font-semibold">{confirmedBooking.datetime_formatted}</span>. A calendar invitation with screen-share details has been queued for <span className="text-white font-mono">{confirmedBooking.email}</span>.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-sm mx-auto text-left text-xs font-mono space-y-2">
                                <div className="flex items-center justify-between text-neutral-400">
                                    <span>Host:</span>
                                    <span className="text-white">Cutting Edger Studio Leads</span>
                                </div>
                                <div className="flex items-center justify-between text-neutral-400">
                                    <span>Client Name:</span>
                                    <span className="text-white">{confirmedBooking.name}</span>
                                </div>
                                <div className="flex items-center justify-between text-neutral-400">
                                    <span>Duration:</span>
                                    <span className="text-emerald-400 font-semibold">15 Minutes (Google Meet / Zoom)</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-8 py-3 rounded-xl bg-accent text-black font-semibold text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Booking Form View */
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {errorMessage && (
                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            {/* Slot Selection */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-mono uppercase text-accent font-bold flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>1. Select Preferred Date & Time</span>
                                    </label>
                                    <span className="text-[11px] font-mono text-neutral-400">
                                        All times auto-adjusted to your local timezone
                                    </span>
                                </div>

                                {isLoadingSlots ? (
                                    <div className="p-8 text-center text-xs text-neutral-400 font-mono flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-accent" />
                                        <span>Loading live calendar availability...</span>
                                    </div>
                                ) : (
                                    <>
                                        {/* Day Tabs */}
                                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                                            {days.map((day, idx) => {
                                                const isSelected = idx === selectedDayIndex;
                                                return (
                                                    <button
                                                        key={day.date}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedDayIndex(idx);
                                                            if (day.slots && day.slots.length > 0) {
                                                                setSelectedSlot(day.slots[0]);
                                                            }
                                                        }}
                                                        className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
                                                            isSelected
                                                                ? 'bg-accent text-black font-bold shadow-md shadow-[#fbb718]/10'
                                                                : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
                                                        }`}
                                                    >
                                                        {day.label}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Time Slot Buttons */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                                            {activeDay?.slots.map((slot) => {
                                                const isSlotSelected = selectedSlot?.iso === slot.iso;
                                                return (
                                                    <button
                                                        key={slot.iso}
                                                        type="button"
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={`px-3 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                                            isSlotSelected
                                                                ? 'bg-accent/15 text-accent border-2 border-accent font-bold shadow-sm'
                                                                : 'bg-white/[0.04] text-neutral-300 hover:bg-white/10 hover:text-white border border-white/10'
                                                        }`}
                                                    >
                                                        <Clock className="w-3 h-3" />
                                                        <span>{slot.time}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Contact Details Grid */}
                            <div className="space-y-3 pt-2 border-t border-white/10">
                                <label className="text-xs font-mono uppercase text-accent font-bold block">
                                    2. Your Information & Brief
                                </label>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono uppercase text-neutral-400">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Sarah Jenkins"
                                            required
                                            className="w-full h-9 rounded-xl bg-neutral-900 border border-white/10 text-xs px-3 text-white focus:outline-none focus:border-accent"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono uppercase text-neutral-400">
                                            Work Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="sarah@brand.com"
                                            required
                                            className="w-full h-9 rounded-xl bg-neutral-900 border border-white/10 text-xs px-3 text-white focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono uppercase text-neutral-400">
                                            Phone / WhatsApp (Optional)
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full h-9 rounded-xl bg-neutral-900 border border-white/10 text-xs px-3 text-white focus:outline-none focus:border-accent"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono uppercase text-neutral-400">
                                            Service Discipline
                                        </label>
                                        <select
                                            value={service}
                                            onChange={(e) => setService(e.target.value)}
                                            className="w-full h-9 rounded-xl bg-neutral-900 border border-white/10 text-xs px-3 text-white focus:outline-none focus:border-accent"
                                        >
                                            <option value="Catalog Optimization & Retouching">1. Catalog Optimization & Retouching</option>
                                            <option value="Color Standardization">2. Color Standardization & Multi-Colorways</option>
                                            <option value="White-Label Studio Extension">3. White-Label Agency Extension</option>
                                            <option value="Virtual Production & 3D CGI">4. Virtual Production & 3D CGI</option>
                                            <option value="Custom High-Volume Enterprise SLA">Enterprise High-Volume Retouching</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-mono uppercase text-neutral-400">
                                        Project Scope or Questions (Optional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="e.g. We have ~2,500 apparel SKUs per month requiring ghost mannequin and delta-E matching..."
                                        rows={2}
                                        className="w-full rounded-xl bg-neutral-900 border border-white/10 text-xs p-3 text-white focus:outline-none focus:border-accent resize-none"
                                    />
                                </div>
                            </div>

                            {/* Trust & Submit */}
                            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
                                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono">
                                    <Shield className="w-3.5 h-3.5 text-accent" />
                                    <span>Protected under Strict Mutual NDA</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2.5 rounded-xl text-xs font-mono text-neutral-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !selectedSlot}
                                        className="px-6 py-2.5 rounded-xl bg-accent text-black font-semibold text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-lg shadow-[#fbb718]/15 disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Confirming...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>Confirm Call Slot</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
