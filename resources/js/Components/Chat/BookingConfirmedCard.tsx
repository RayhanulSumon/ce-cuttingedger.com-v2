import React from 'react';
import { CalendarCheck2, Mail, ShieldCheck } from 'lucide-react';

export interface BookingConfirmedCardProps {
    card: {
        consultation_id?: number;
        client_name: string;
        email: string;
        datetime_formatted: string;
        meeting_link_note?: string;
        status?: string;
    };
}

export function BookingConfirmedCard({ card }: BookingConfirmedCardProps) {
    return (
        <div className="my-2 p-4 rounded-2xl bg-[#00f5ff]/10 border border-[#00f5ff]/40 shadow-xl backdrop-blur-md text-left">
            <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-[#00f5ff] text-black">
                    <CalendarCheck2 className="w-4 h-4" />
                </span>
                <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">Consultation Confirmed</h4>
                    <span className="text-[10px] text-[#00f5ff] font-mono uppercase tracking-wider">
                        15-Min Technical Intake Call
                    </span>
                </div>
            </div>

            <div className="bg-black/40 p-3 rounded-xl my-2 border border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-white/70">
                    <span className="text-white/40 text-[10px]">TIME</span>
                    <span className="font-semibold text-white">{card.datetime_formatted}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                    <span className="text-white/40 text-[10px]">INVITEE</span>
                    <span className="text-white">{card.client_name} ({card.email})</span>
                </div>
            </div>

            <p className="text-[11px] text-white/70 flex items-start gap-1.5 mt-2">
                <Mail className="w-3.5 h-3.5 text-[#00f5ff] shrink-0 mt-0.5" />
                <span>{card.meeting_link_note || 'Calendar invite and Google Meet link sent to your inbox.'}</span>
            </p>
        </div>
    );
}
