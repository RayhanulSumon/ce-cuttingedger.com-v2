import React from 'react';
import { usePage } from '@inertiajs/react';
import { ClientSettingsSection } from '@/Components/Client/ClientSettingsSection';
import { SeoHead } from '@/Components/Common/SeoHead';
import { getClientLayout } from '@/Layouts/Client/ClientLayout';
import { PageProps } from '@/types';

interface ClientSettingsProps {
    availableCredits?: number;
    activePlanName?: string | null;
}

export default function ClientSettings({
    availableCredits = 0,
    activePlanName = null,
}: ClientSettingsProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user ?? null;

    return (
        <>
            <SeoHead
                title="Settings — Client Workspace"
                description="Manage your profile picture, personal contact details, and password security."
            />

            <ClientSettingsSection
                user={user}
                availableCredits={user?.credits_balance ?? availableCredits}
                activePlanName={user?.active_plan_name ?? activePlanName}
            />
        </>
    );
}

ClientSettings.layout = getClientLayout;
