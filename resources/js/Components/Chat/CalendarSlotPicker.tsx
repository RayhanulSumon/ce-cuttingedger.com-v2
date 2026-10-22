import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export interface CalendarSlotPickerProps {
    card: {
        title: string;
        description: string;
        timezone: string;
        days: Array<{
            date: string;
            label: string;
            slots: Array<{
                time: string;
                iso: string;
            }>;
        }>;
    };
    onBookSlot: (bookingData: {
        slot_datetime: string;
        name: string;
        email: string;
        phone?: string;
        notes?: string;
    }) => Promise<void>;
}

export function CalendarSlotPicker({ card, onBookSlot }: CalendarSlotPickerProps) {
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState<{ time: string; iso: string } | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const activeDay = card.days[selectedDayIndex] || card.days[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot) {
            setError('Please choose a time slot.');
            return;
        }
        if (!email.trim() || !name.trim()) {
            setError('Please provide your name and email.');
            return;
        }

        setError(null);
        setIsSubmitting(true);
        try {
            await onBookSlot({
                slot_datetime: selectedSlot.iso,
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim() || undefined,
            });
            setSelectedSlot(null);
        } catch (err: any) {
            setError(err?.message || 'Booking failed. Please try another slot.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="my-2 p-4 rounded-2xl bg-[#12141a]/95 border border-[#00f5ff]/30 shadow-2xl backdrop-blur-md text-left">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                <span className="p-1.5 rounded-lg bg-[#00f5ff]/10 text-[#00f5ff]">
                    <Calendar className="w-4 h-4" />
                </span>
                <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{card.title}</h4>
                    <span className="text-[10px] text-white/50 font-mono">
                        Timezone: {card.timezone} • 15 min duration
                    </span>
                </div>
            </div>

            {/* Day Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {card.days.map((day, idx) => (
                    <button
                        key={day.date}
                        type="button"
                        onClick={() => {
                            setSelectedDayIndex(idx);
                            setSelectedSlot(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
                            selectedDayIndex === idx
                                ? 'bg-[#00f5ff] text-black shadow-md'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                    >
                        {day.label}
                    </button>
                ))}
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-3 gap-1.5 my-3">
                {activeDay?.slots.map((slot) => {
                    const isSelected = selectedSlot?.iso === slot.iso;
                    return (
                        <button
                            key={slot.iso}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 px-1 text-center rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1 ${
                                isSelected
                                    ? 'bg-[#d4ff00] text-black font-bold shadow-md scale-102'
                                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                            }`}
                        >
                            <Clock className="w-3 h-3 opacity-60" />
                            <span>{slot.time}</span>
                        </button>
                    );
                })}
            </div>

            {/* Selected Slot Form */}
            {selectedSlot && (
                <form onSubmit={handleSubmit} className="mt-3 p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 animate-in fade-in slide-in-from-top-2">
                    <div className="text-[11px] font-mono text-[#d4ff00] flex items-center gap-1 pb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selected: {activeDay.label} at {selectedSlot.time}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                            type="text"
                            required
                            placeholder="Your Name *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00f5ff]"
                        />
                        <input
                            type="email"
                            required
                            placeholder="Your Email *"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00f5ff]"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="WhatsApp / Phone (Optional)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00f5ff]"
                    />

                    {error && (
                        <p className="text-[11px] text-red-400 font-mono">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2 px-3 rounded-lg bg-[#00f5ff] hover:bg-[#00d8e6] text-black font-semibold text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Reserving Slot...</span>
                            </>
                        ) : (
                            <>
                                <span>Confirm Consultation</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
