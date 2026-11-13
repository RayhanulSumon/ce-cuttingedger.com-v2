import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, Loader2, CheckCircle2, RefreshCw, CalendarClock } from 'lucide-react';

export interface CalendarSlotPickerProps {
    card: {
        title: string;
        description: string;
        timezone: string;
        is_reschedule?: boolean;
        existing_booking?: {
            consultation_id: number;
            current_time_formatted: string;
            client_name?: string;
            client_email?: string;
            status?: string;
        } | null;
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
        consultation_id?: number;
        is_reschedule?: boolean;
    }) => Promise<void>;
}

export function CalendarSlotPicker({ card, onBookSlot }: CalendarSlotPickerProps) {
    const isReschedule = Boolean(card.is_reschedule || card.existing_booking);
    const existing = card.existing_booking;

    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState<{ time: string; iso: string } | null>(null);
    const [name, setName] = useState(existing?.client_name || '');
    const [email, setEmail] = useState(existing?.client_email || '');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
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
                notes: notes.trim() || undefined,
                consultation_id: existing?.consultation_id,
                is_reschedule: isReschedule,
            });
            setSelectedSlot(null);
        } catch (err: any) {
            setError(err?.message || 'Booking failed. Please try another slot.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`my-2 p-4 rounded-2xl border shadow-2xl backdrop-blur-md text-left transition-all ${
            isReschedule
                ? 'bg-white/95 border-primary/40'
                : 'bg-white/95 border-primary/30'
        }`}>
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-ink/10">
                <span className={`p-1.5 rounded-lg ${isReschedule ? 'bg-primary/15 text-primary-ink' : 'bg-primary/10 text-primary-ink'}`}>
                    {isReschedule ? <CalendarClock className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                </span>
                <div>
                    <h4 className="text-sm font-bold text-ink tracking-tight">{card.title}</h4>
                    <span className="text-[10px] text-ink/50 font-mono">
                        Timezone: {card.timezone} • 15 min duration
                    </span>
                </div>
            </div>

            {/* Existing booking notice if rescheduling */}
            {isReschedule && existing?.current_time_formatted && (
                <div className="mb-3 p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-2 text-xs font-mono">
                    <RefreshCw className="w-3.5 h-3.5 text-primary-ink shrink-0 mt-0.5" />
                    <div className="text-ink/80">
                        <span className="text-primary-ink font-bold block">Rescheduling Current Booking</span>
                        <span>Currently booked for: {existing.current_time_formatted}</span>
                    </div>
                </div>
            )}

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
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                            selectedDayIndex === idx
                                ? isReschedule
                                    ? 'bg-primary text-white font-bold shadow-md'
                                    : 'bg-primary text-white shadow-md'
                                : 'bg-ink/[0.03] text-ink/70 hover:bg-ink/[0.05]'
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
                            className={`py-2 px-1 text-center rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                isSelected
                                    ? 'bg-primary text-white font-bold shadow-md scale-102'
                                    : 'bg-ink/[0.03] text-ink hover:bg-ink/[0.05] border border-ink/10'
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
                <form onSubmit={handleSubmit} className="mt-3 p-3 rounded-xl bg-ink/[0.04] border border-ink/10 space-y-2 animate-in fade-in slide-in-from-top-2">
                    <div className="text-[11px] font-mono text-primary-ink flex items-center gap-1 pb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                            {isReschedule ? 'New Slot:' : 'Selected:'} {activeDay.label} at {selectedSlot.time}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                            type="text"
                            required
                            placeholder="Your Name *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-ink/[0.03] border border-ink/10 rounded-lg text-xs text-ink placeholder-faint focus:outline-none focus:border-primary"
                        />
                        <input
                            type="email"
                            required
                            placeholder="Your Email *"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-ink/[0.03] border border-ink/10 rounded-lg text-xs text-ink placeholder-faint focus:outline-none focus:border-primary"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="WhatsApp / Phone (Optional)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-ink/[0.03] border border-ink/10 rounded-lg text-xs text-ink placeholder-faint focus:outline-none focus:border-primary"
                    />
                    <textarea
                        rows={2}
                        placeholder="What would you like to discuss? (e.g. ghost mannequin, turnaround, 3D specs) (Optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-ink/[0.03] border border-ink/10 rounded-lg text-xs text-ink placeholder-faint focus:outline-none focus:border-primary resize-none"
                    />

                    {error && (
                        <p className="text-[11px] text-red-400 font-mono">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-3 rounded-lg text-white font-semibold text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer ${
                            isReschedule
                                ? 'bg-primary hover:bg-primary-hover'
                                : 'bg-primary hover:bg-primary-hover'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>{isReschedule ? 'Rescheduling Slot...' : 'Reserving Slot...'}</span>
                            </>
                        ) : (
                            <>
                                {isReschedule ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>Confirm Rescheduled Time</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Confirm Consultation</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </>
                                )}
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
