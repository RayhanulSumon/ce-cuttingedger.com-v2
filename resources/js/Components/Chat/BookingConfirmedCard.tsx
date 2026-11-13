import React from 'react';
import { CalendarCheck2, CalendarClock, Mail, RefreshCw } from 'lucide-react';

export interface BookingConfirmedCardProps {
    card: {
        consultation_id?: number;
        client_name: string;
        email: string;
        datetime_formatted: string;
        previous_datetime?: string;
        meeting_link_note?: string;
        status?: string;
        is_rescheduled?: boolean;
    };
    onReschedule?: (consultationId?: number) => void;
}

export function BookingConfirmedCard({ card, onReschedule }: BookingConfirmedCardProps) {
    const isRescheduled = Boolean(card.is_rescheduled);

    const formatLocalizedSlot = (slotDatetime?: string, fallback?: string) => {
        if (!slotDatetime) return { local: fallback || '', utc: '' };
        try {
            const d = new Date(slotDatetime);
            if (isNaN(d.getTime())) return { local: fallback || '', utc: '' };
            const userLocale = navigator.language || 'en-US';
            const localString = new Intl.DateTimeFormat(userLocale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            }).format(d);

            const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const utcString = new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZone: 'UTC',
            }).format(d);

            return {
                local: `${localString} (${userTz})`,
                utc: `${utcString} UTC`,
            };
        } catch {
            return { local: fallback || '', utc: '' };
        }
    };

    const slotDisplay = formatLocalizedSlot(card.slot_datetime, card.datetime_formatted);

    return (
        <div className={`my-2.5 p-4 rounded-2xl border shadow-xl backdrop-blur-md text-left transition-all ${
            isRescheduled
                ? 'bg-primary/10 border-primary/40 shadow-primary/5'
                : 'bg-primary/10 border-primary/40 shadow-primary/5'
        }`}>
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg text-white ${isRescheduled ? 'bg-primary' : 'bg-primary'}`}>
                        {isRescheduled ? <RefreshCw className="w-4 h-4" /> : <CalendarCheck2 className="w-4 h-4" />}
                    </span>
                    <div>
                        <h4 className="text-sm font-bold text-ink tracking-tight">
                            {isRescheduled ? 'Consultation Rescheduled' : 'Consultation Confirmed'}
                        </h4>
                        <span className={`text-[10px] font-mono uppercase tracking-wider ${isRescheduled ? 'text-primary-ink' : 'text-primary-ink'}`}>
                            15-Min Technical Intake Call
                        </span>
                    </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isRescheduled
                        ? 'bg-primary/20 text-primary-ink border border-primary/30'
                        : 'bg-primary/20 text-primary-ink border border-primary/30'
                }`}>
                    {card.status || (isRescheduled ? 'Rescheduled' : 'Confirmed')}
                </span>
            </div>

            <div className="bg-ink/[0.04] p-3 rounded-xl my-2 border border-ink/10 space-y-1.5 text-xs font-mono">
                {isRescheduled && card.previous_datetime && (
                    <div className="flex items-center justify-between text-ink/50 text-[11px] pb-1 border-b border-ink/10">
                        <span className="text-[10px] uppercase">Previous Slot</span>
                        <span className="line-through">{card.previous_datetime}</span>
                    </div>
                )}
                <div className="flex items-start justify-between text-ink/70 gap-2">
                    <span className="text-ink/40 text-[10px] uppercase shrink-0 pt-0.5">Slot</span>
                    <div className="text-right">
                        <span className="font-semibold text-ink block">{slotDisplay.local}</span>
                        {slotDisplay.utc && (
                            <span className="text-[10px] text-ink/50 block font-mono">{slotDisplay.utc}</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between text-ink/70">
                    <span className="text-ink/40 text-[10px] uppercase">Invitee</span>
                    <span className="text-ink">{card.client_name} ({card.email})</span>
                </div>
            </div>

            <p className="text-[11px] text-ink/70 flex items-start gap-1.5 mt-2">
                <Mail className="w-3.5 h-3.5 text-primary-ink shrink-0 mt-0.5" />
                <span>{card.meeting_link_note || 'Calendar invite and Google Meet link sent to your inbox.'}</span>
            </p>

            {/* Quick Reschedule Action */}
            <div className="mt-3 pt-2.5 border-t border-ink/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-ink/50">Need a different time?</span>
                <button
                    type="button"
                    onClick={() => onReschedule?.(card.consultation_id)}
                    className="py-1 px-2.5 rounded-lg bg-ink/[0.05] hover:bg-ink/10 text-ink font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                    <CalendarClock className="w-3.5 h-3.5 text-primary-ink" />
                    <span>Reschedule Slot</span>
                </button>
            </div>
        </div>
    );
}
