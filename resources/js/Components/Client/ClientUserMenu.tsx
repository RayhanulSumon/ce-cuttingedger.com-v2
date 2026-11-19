import React from 'react';
import { router } from '@inertiajs/react';
import { ChevronDown, Coins, LogOut, Settings, ShoppingBag } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { ClientAvatar } from './ClientAvatar';

interface ClientUserMenuProps {
    user?: {
        name?: string | null;
        email?: string | null;
        company?: string | null;
        avatar?: string | null;
    } | null;
    availableCredits: number;
}

/** Top-navbar client avatar trigger and dropdown menu for quick profile, navigation, and sign-out. */
export function ClientUserMenu({ user, availableCredits }: ClientUserMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Account menu"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200/90 bg-white py-1 pl-1 pr-2.5 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                    <ClientAvatar src={user?.avatar} name={user?.name} size="sm" />
                    <span className="hidden max-w-[120px] truncate text-xs font-semibold text-ink md:block">
                        {user?.name || 'Client'}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-60 rounded-2xl p-1.5">
                <div className="flex items-center gap-2.5 px-2.5 py-2">
                    <ClientAvatar src={user?.avatar} name={user?.name} size="md" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-ink">{user?.name || 'Client'}</p>
                        {user?.email && (
                            <p className="truncate text-[11px] text-slate-500">{user.email}</p>
                        )}
                        {user?.company && (
                            <p className="truncate text-[11px] font-medium text-slate-400">
                                {user.company}
                            </p>
                        )}
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onSelect={() => router.visit('/portal/settings', { preserveScroll: true })}
                    className="gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700"
                >
                    <Settings className="h-4 w-4 text-slate-400" />
                    <span>Profile &amp; Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onSelect={() => router.visit('/portal/credits', { preserveScroll: true })}
                    className="justify-between gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700"
                >
                    <span className="inline-flex items-center gap-2.5">
                        <Coins className="h-4 w-4 text-slate-400" />
                        <span>Credits &amp; Plans</span>
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold tabular-nums text-primary">
                        {availableCredits.toLocaleString()}
                    </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onSelect={() => router.visit('/portal/orders', { preserveScroll: true })}
                    className="gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700"
                >
                    <ShoppingBag className="h-4 w-4 text-slate-400" />
                    <span>My Orders</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onSelect={() => router.post('/logout')}
                    className="gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus:bg-rose-50 focus:text-rose-700"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
