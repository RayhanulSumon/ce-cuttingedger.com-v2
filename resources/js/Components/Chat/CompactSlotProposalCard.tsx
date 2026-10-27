import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, Loader2, Mail, User } from 'lucide-react';

export interface CompactSlotProposalCardProps {
    card: {
        type: string;
        date_label: string;
        requested_time?: string;
        selected_time: string;
        slot_datetime: string;
        available_slots?: Array<{ time: string; iso: string }>;
        is_exact?: boolean;
        message: string;
    };
    onBookSlot: (bookingData: {
        slot_datetime: string;
        name: string;
        email: string;
        notes?: string;
    }) => Promise<void>;
    onShowAllTimes: () => void;
    initialName?: string;
    initialEmail?: string;
}

export function CompactSlotProposalCard({
    card,
    onBookSlot,
    onShowAllTimes,
    initialName = '',
    initialEmail = '',
}: CompactSlotProposalCardProps) {
    const [name, setName] = useState(initialName);
    const [email, setEmail] = useState(initialEmail);
    const [selectedTime, setSelectedTime] = useState(card.selected_time);
    const [selectedIso, setSelectedIso] = useState(card.slot_datetime);
    const [showForm, setShowForm] = useState(!initialEmail);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleConfirm = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!name.trim()) {
            setError('Please provide your name.');
            setShowForm(true);
            return;
        }

        if (!email.trim() || !email.includes('@')) {
            setError('Please enter a valid work or business email.');
            setShowForm(true);
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            await onBookSlot({
                slot_datetime: selectedIso || card.slot_datetime,
                name: name.trim(),
                email: email.trim(),
                notes: card.requested_time ? `Requested: ${card.requested_time}` : undefined,
            });
            setIsConfirmed(true);
        } catch (err: any) {
            setError(err?.message || 'Unable to confirm booking. Please try another slot or check your email.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isConfirmed) {
        return (
            <div className="my-2 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-xl text-left animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-semibold font-mono">
                        Session Confirmed for {card.date_label} at {selectedTime}!
                    </span>
                </div>
            </div>
        );
    }

    const formatHeaderTime = () => {
        if (!selectedIso) return `${card.date_label} at ${selectedTime}`;
        try {
            const d = new Date(selectedIso);
            if (isNaN(d.getTime())) return `${card.date_label} at ${selectedTime}`;
            const userLocale = navigator.language || 'en-US';
            const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const localFormatted = new Intl.DateTimeFormat(userLocale, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            }).format(d);
            return `${localFormatted} (${userTz}) • ${selectedTime} UTC`;
        } catch {
            return `${card.date_label} at ${selectedTime}`;
        }
    };

    return (
        <div className="my-2 p-3.5 rounded-2xl bg-[#151720] border border-[#00f5ff]/30 shadow-xl text-left">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/30">
                    <Calendar className="w-4 h-4" />
                </span>
                <div>
                    <h4 className="text-xs font-bold text-white tracking-tight">
                        {formatHeaderTime()}
                    </h4>
                    <span className="text-[10px] text-[#00f5ff] font-mono">15-min Technical Intake Call</span>
                </div>
            </div>

            <p className="text-[11px] text-white/80 mb-2.5 leading-relaxed">{card.message}</p>

            {/* Quick Slot Selector Chips */}
            {card.available_slots && card.available_slots.length > 0 && (
                <div className="my-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                    <span className="text-[10px] text-white/50 uppercase font-mono tracking-wider block">
                        Available Times for {card.date_label}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {card.available_slots.map((slot) => {
                            const isSelected = selectedTime === slot.time;
                            return (
                                <button
                                    key={slot.time}
                                    type="button"
                                    onClick={() => {
                                        setSelectedTime(slot.time);
                                        setSelectedIso(slot.iso);
                                    }}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                                        isSelected
                                            ? 'bg-[#00f5ff] text-black font-bold shadow-md shadow-[#00f5ff]/20 scale-[1.02]'
                                            : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}
                                >
                                    {slot.time}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Error banner */}
            {error && (
                <div className="mb-3 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-mono">
                    {error}
                </div>
            )}

            {/* Inline Name / Email form if required */}
            {showForm ? (
                <form onSubmit={handleConfirm} className="space-y-2 mb-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="relative">
                            <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-white/40" />
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (error) setError(null);
                                }}
                                required
                                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#00f5ff]"
                            />
                        </div>
                        <div className="relative">
                            <Mail className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-white/40" />
                            <input
                                type="email"
                                placeholder="Work Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError(null);
                                }}
                                required
                                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#00f5ff]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-2 px-3 rounded-xl bg-[#00f5ff] hover:bg-[#00d0db] disabled:opacity-50 text-black font-semibold text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#00f5ff]/20"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            <span>Confirm & Book {selectedTime}</span>
                        </button>
                        <button
                            type="button"
                            onClick={onShowAllTimes}
                            className="py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono transition-all border border-white/10 cursor-pointer"
                        >
                            All Dates
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleConfirm()}
                        disabled={isSubmitting}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#00f5ff] hover:bg-[#00d0db] disabled:opacity-50 text-black font-semibold text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#00f5ff]/20"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        <span>Confirm {selectedTime}</span>
                    </button>
                    <button
                        type="button"
                        onClick={onShowAllTimes}
                        className="py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono transition-all border border-white/10 cursor-pointer"
                    >
                        All Dates
                    </button>
                </div>
            )}
        </div>
    );
}
