import React, { useEffect, useRef, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Camera,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    ShieldCheck,
    Trash2,
    Upload,
    User,
} from 'lucide-react';
import { AdminPageHeader } from '@/Components/Admin/UI/AdminPageHeader';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { ClientAvatar } from './ClientAvatar';

const ACCEPTED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AVATAR_BYTES = 4 * 1024 * 1024;

interface ClientSettingsSectionProps {
    user?: {
        name?: string | null;
        email?: string | null;
        company?: string | null;
        phone?: string | null;
        avatar?: string | null;
    } | null;
    availableCredits: number;
    activePlanName?: string | null;
}

/** Redesigned Client Portal Profile & Settings workspace with avatar upload, profile form, and password security. */
export function ClientSettingsSection({
    user,
    availableCredits,
    activePlanName,
}: ClientSettingsSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarRemoving, setAvatarRemoving] = useState(false);
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const profileForm = useForm({
        name: user?.name || '',
        company: user?.company || '',
        phone: user?.phone || '',
    });

    const passwordForm = useForm({
        password: '',
        password_confirmation: '',
    });

    const clearPreview = () => {
        setPreviewUrl((current) => {
            if (current) {
                URL.revokeObjectURL(current);
            }
            return null;
        });
    };

    const uploadAvatarFile = (file: File) => {
        setAvatarError(null);

        if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
            setAvatarError('Please choose a JPG, PNG, or WebP image file.');
            return;
        }

        if (file.size > MAX_AVATAR_BYTES) {
            setAvatarError('Image size must be 4 MB or smaller.');
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl((previous) => {
            if (previous) {
                URL.revokeObjectURL(previous);
            }
            return objectUrl;
        });

        router.post(
            route('client.portal.avatar', undefined, false),
            { avatar: file },
            {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,
                only: ['auth', 'flash'],
                onStart: () => setAvatarUploading(true),
                onError: (errors) => {
                    clearPreview();
                    setAvatarError(errors.avatar || 'Unable to upload profile picture.');
                },
                onSuccess: () => {
                    clearPreview();
                    setAvatarError(null);
                },
                onFinish: () => {
                    setAvatarUploading(false);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                },
            }
        );
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadAvatarFile(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        if (avatarUploading || avatarRemoving) {
            return;
        }
        const file = event.dataTransfer.files?.[0];
        if (file) {
            uploadAvatarFile(file);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarError(null);
        router.delete(route('client.portal.avatar.destroy', undefined, false), {
            preserveScroll: true,
            preserveState: true,
            only: ['auth', 'flash'],
            onStart: () => setAvatarRemoving(true),
            onSuccess: () => clearPreview(),
            onError: () => setAvatarError('Unable to remove profile picture right now.'),
            onFinish: () => setAvatarRemoving(false),
        });
    };

    const handleProfileSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        profileForm.post(route('client.portal.profile', undefined, false), {
            preserveScroll: true,
            preserveState: true,
            only: ['auth', 'flash'],
            onSuccess: () => profileForm.setDefaults(),
        });
    };

    const handlePasswordSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        passwordForm.post(route('client.portal.password', undefined, false), {
            preserveScroll: true,
            preserveState: true,
            only: ['auth', 'flash'],
            onSuccess: () => passwordForm.reset(),
        });
    };

    const passwordMeetsLength = passwordForm.data.password.length >= 8;
    const passwordsMatch =
        passwordForm.data.password.length > 0 &&
        passwordForm.data.password === passwordForm.data.password_confirmation;
    const displayedAvatar = previewUrl ?? user?.avatar;
    const avatarBusy = avatarUploading || avatarRemoving;

    return (
        <div className="max-w-5xl space-y-6">
            <AdminPageHeader
                title="Profile & Settings"
                description="Manage your profile picture, personal details, and account security."
            />

            {/* Card 1: Profile Photo & Account Identity */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    'rounded-2xl border bg-white p-6 shadow-xs transition-colors',
                    isDragging ? 'border-primary bg-primary/[0.03]' : 'border-slate-200/90'
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-5">
                        <button
                            type="button"
                            disabled={avatarBusy}
                            onClick={() => fileInputRef.current?.click()}
                            aria-label="Upload profile picture"
                            className="group relative shrink-0 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed"
                        >
                            <ClientAvatar
                                src={displayedAvatar}
                                name={user?.name}
                                size="xl"
                                className="ring-4 ring-slate-100"
                            />
                            <span
                                className={cn(
                                    'absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/50 text-white transition-opacity',
                                    avatarUploading
                                        ? 'opacity-100'
                                        : 'opacity-0 group-hover:opacity-100'
                                )}
                            >
                                {avatarUploading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Camera className="h-5 w-5" />
                                )}
                            </span>
                        </button>

                        <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="truncate text-lg font-bold text-ink">
                                    {user?.name || 'Client Account'}
                                </h2>
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Verified
                                </span>
                            </div>

                            <p className="truncate text-sm text-slate-600">
                                {user?.email}
                                {user?.company ? ` · ${user.company}` : ''}
                            </p>

                            <p className="text-xs text-slate-500">
                                {activePlanName || 'Pay-As-You-Go'} ·{' '}
                                <span className="font-semibold tabular-nums text-ink">
                                    {availableCredits.toLocaleString()} credits available
                                </span>
                            </p>

                            <p className="pt-0.5 text-[11px] text-slate-400">
                                JPG, PNG, or WebP · Max 4 MB · Click photo or drag &amp; drop here
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
                        <Button
                            type="button"
                            disabled={avatarBusy}
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2 bg-primary text-xs font-semibold text-white hover:bg-primary-hover cursor-pointer"
                        >
                            {avatarUploading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Upload className="h-3.5 w-3.5" />
                            )}
                            <span>
                                {avatarUploading
                                    ? 'Uploading...'
                                    : user?.avatar
                                      ? 'Change Photo'
                                      : 'Upload Photo'}
                            </span>
                        </Button>

                        {user?.avatar && (
                            <Button
                                type="button"
                                variant="outline"
                                disabled={avatarBusy}
                                onClick={handleRemoveAvatar}
                                className="gap-1.5 border-slate-200 bg-white text-xs font-semibold text-rose-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                            >
                                {avatarRemoving ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Trash2 className="h-3.5 w-3.5" />
                                )}
                                <span>{avatarRemoving ? 'Removing...' : 'Remove'}</span>
                            </Button>
                        )}
                    </div>
                </div>

                {avatarError && (
                    <div
                        role="alert"
                        className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700"
                    >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{avatarError}</span>
                    </div>
                )}
            </div>

            {/* Lower 12-Column Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Personal Details Form */}
                <form
                    onSubmit={handleProfileSubmit}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs lg:col-span-7"
                >
                    <div className="space-y-5">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                <User className="h-4 w-4" />
                            </span>
                            <div>
                                <h2 className="text-base font-bold text-ink">Personal Details</h2>
                                <p className="text-xs text-slate-500">
                                    Keep your studio contact name, brand, and phone number current.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="client-profile-name"
                                    className="block text-xs font-semibold text-slate-700"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="client-profile-name"
                                    type="text"
                                    required
                                    value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                />
                                {profileForm.errors.name && (
                                    <p className="mt-1 text-xs text-rose-600">
                                        {profileForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <span className="block text-xs font-semibold text-slate-700">
                                    Email Address
                                </span>
                                <div className="mt-1.5 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500">
                                    <span className="truncate">{user?.email || '—'}</span>
                                    <Lock
                                        aria-label="Verified account email"
                                        className="h-3.5 w-3.5 shrink-0 text-slate-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="client-profile-company"
                                    className="block text-xs font-semibold text-slate-700"
                                >
                                    Brand / Company
                                </label>
                                <input
                                    id="client-profile-company"
                                    type="text"
                                    value={profileForm.data.company}
                                    onChange={(e) => profileForm.setData('company', e.target.value)}
                                    placeholder="Optional"
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                />
                                {profileForm.errors.company && (
                                    <p className="mt-1 text-xs text-rose-600">
                                        {profileForm.errors.company}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="client-profile-phone"
                                    className="block text-xs font-semibold text-slate-700"
                                >
                                    Phone / WhatsApp
                                </label>
                                <input
                                    id="client-profile-phone"
                                    type="tel"
                                    value={profileForm.data.phone}
                                    onChange={(e) => profileForm.setData('phone', e.target.value)}
                                    placeholder="Optional"
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                />
                                {profileForm.errors.phone && (
                                    <p className="mt-1 text-xs text-rose-600">
                                        {profileForm.errors.phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <span className="text-xs font-medium text-slate-500">
                            {profileForm.isDirty ? 'Unsaved changes' : 'Up to date'}
                        </span>
                        <Button
                            type="submit"
                            disabled={profileForm.processing}
                            className="bg-primary text-xs font-semibold text-white hover:bg-primary-hover cursor-pointer"
                        >
                            {profileForm.processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>

                {/* Password & Security Form */}
                <form
                    onSubmit={handlePasswordSubmit}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs lg:col-span-5"
                >
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                <ShieldCheck className="h-4 w-4" />
                            </span>
                            <div>
                                <h2 className="text-base font-bold text-ink">
                                    Password &amp; Security
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Choose a strong password of at least 8 characters.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="client-new-password"
                                className="block text-xs font-semibold text-slate-700"
                            >
                                New Password
                            </label>
                            <div className="relative mt-1.5">
                                <input
                                    id="client-new-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={passwordForm.data.password}
                                    onChange={(e) =>
                                        passwordForm.setData('password', e.target.value)
                                    }
                                    placeholder="Min. 8 characters"
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-sm text-ink focus:border-primary focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {passwordForm.errors.password && (
                                <p className="mt-1 text-xs text-rose-600">
                                    {passwordForm.errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="client-confirm-password"
                                className="block text-xs font-semibold text-slate-700"
                            >
                                Confirm New Password
                            </label>
                            <div className="relative mt-1.5">
                                <input
                                    id="client-confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) =>
                                        passwordForm.setData(
                                            'password_confirmation',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Re-enter password"
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-sm text-ink focus:border-primary focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    aria-label={
                                        showConfirmPassword
                                            ? 'Hide confirm password'
                                            : 'Show confirm password'
                                    }
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {passwordForm.errors.password_confirmation && (
                                <p className="mt-1 text-xs text-rose-600">
                                    {passwordForm.errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <ul className="space-y-1.5 pt-1 text-xs">
                            <li
                                className={cn(
                                    'flex items-center gap-2',
                                    passwordMeetsLength ? 'text-emerald-700' : 'text-slate-400'
                                )}
                            >
                                <Check className="h-3.5 w-3.5 shrink-0" />
                                <span>At least 8 characters</span>
                            </li>
                            <li
                                className={cn(
                                    'flex items-center gap-2',
                                    passwordsMatch ? 'text-emerald-700' : 'text-slate-400'
                                )}
                            >
                                <Check className="h-3.5 w-3.5 shrink-0" />
                                <span>Passwords match</span>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4">
                        <Button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="w-full bg-primary text-xs font-semibold text-white hover:bg-primary-hover cursor-pointer"
                        >
                            {passwordForm.processing ? 'Updating...' : 'Update Password'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
