import React from 'react';
import { Download, X } from 'lucide-react';
import { ClientOrderItem, OrderStatusBadge } from './types';

interface ClientOrderDetailModalProps {
    order: ClientOrderItem | null;
    onClose: () => void;
}

/** Detail modal displaying order specifications, uploaded files, and studio deliverables. */
export function ClientOrderDetailModal({ order, onClose }: ClientOrderDetailModalProps) {
    if (!order) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-ink shadow-2xl sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-ink px-2.5 py-0.5 text-xs font-bold text-white">
                                #{order.order_number}
                            </span>
                            <OrderStatusBadge status={order.status} />
                        </div>
                        <h3 className="mt-2 text-lg font-bold text-ink">{order.service_name}</h3>
                        <p className="text-xs text-slate-500">Submitted on {order.created_at_formatted}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close order details"
                        className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-slate-100 text-ink hover:bg-slate-200"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="mt-5 space-y-5 text-xs">
                    {order.specifications && Object.keys(order.specifications).length > 0 && (
                        <div className="space-y-3 rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
                            <span className="block text-[11px] font-bold uppercase tracking-wider text-primary">
                                Order Specifications
                            </span>

                            {order.specifications.plan_name && (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                                                Credit Plan Snapshot
                                            </span>
                                            <strong className="text-ink">
                                                {order.specifications.plan_name}
                                            </strong>
                                        </div>
                                        <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                                                Total Credits
                                            </span>
                                            <strong className="text-ink">
                                                {Number(
                                                    order.specifications.total_credits ?? order.quantity
                                                ).toLocaleString()}{' '}
                                                Credits (
                                                {order.specifications.credits_activated
                                                    ? 'Activated'
                                                    : 'Pending Approval'}
                                                )
                                            </strong>
                                        </div>
                                    </div>
                                    {order.specifications.validity_days && (
                                        <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                                                Validity &amp; Expiry
                                            </span>
                                            <strong className="text-ink">
                                                Valid for {Number(order.specifications.validity_days)} days ·{' '}
                                                {order.specifications.expires_at_formatted
                                                    ? `Expires ${order.specifications.expires_at_formatted}`
                                                    : 'Starts upon admin approval'}
                                            </strong>
                                        </div>
                                    )}
                                    {Array.isArray(order.specifications.features_snapshot) &&
                                        order.specifications.features_snapshot.length > 0 && (
                                            <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                                                <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
                                                    Purchased Plan Benefits
                                                </span>
                                                <ul className="list-disc space-y-0.5 pl-4 text-slate-600">
                                                    {order.specifications.features_snapshot.map(
                                                        (feat: string, idx: number) => (
                                                            <li key={idx}>{feat}</li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                </div>
                            )}

                            {order.specifications.paid_with_credits && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                                        <span className="block text-[10px] font-bold uppercase text-slate-400">
                                            Credits Redeemed
                                        </span>
                                        <strong className="text-primary">
                                            {Number(order.specifications.credits_spent ?? 0).toLocaleString()} Credits
                                        </strong>
                                    </div>
                                    {order.specifications.remaining_credits !== undefined && (
                                        <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                                                Balance After Order
                                            </span>
                                            <strong className="text-ink">
                                                {Number(order.specifications.remaining_credits).toLocaleString()}{' '}
                                                Credits
                                            </strong>
                                        </div>
                                    )}
                                </div>
                            )}

                            {order.specifications.reference_twin_name && (
                                <div>
                                    <span className="text-slate-500">Reference / Model: </span>
                                    <strong className="text-ink">
                                        {order.specifications.reference_twin_name}
                                    </strong>
                                </div>
                            )}

                            {order.specifications.selected_model_name && (
                                <div>
                                    <span className="text-slate-500">Try-On Model: </span>
                                    <strong className="text-ink">
                                        {order.specifications.selected_model_name} (
                                        {order.specifications.selected_look_name})
                                    </strong>
                                </div>
                            )}

                            {order.specifications.attributes &&
                                Object.keys(order.specifications.attributes).length > 0 && (
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        {Object.entries(order.specifications.attributes).map(([k, v]) => (
                                            <div
                                                key={k}
                                                className="rounded-xl border border-slate-200 bg-white p-2.5"
                                            >
                                                <span className="block text-[10px] font-bold uppercase text-slate-400">
                                                    {k}
                                                </span>
                                                <span className="font-bold text-ink">
                                                    {typeof v === 'object' && v !== null
                                                        ? Object.entries(v)
                                                              .map(([subK, subV]) => `${subK}: ${subV}`)
                                                              .join(' | ')
                                                        : String(v)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                    )}

                    {order.instructions && (
                        <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                                Notes / Description
                            </span>
                            <p className="mt-1 text-ink">{order.instructions}</p>
                        </div>
                    )}

                    {order.images.length > 0 && (
                        <div>
                            <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Uploaded Files ({order.images.length})
                            </span>
                            <div className="grid grid-cols-3 gap-3">
                                {order.images.map((imgUrl, idx) => (
                                    <a
                                        key={idx}
                                        href={imgUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="overflow-hidden rounded-xl border border-slate-200 bg-[#f8fafc]"
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={`Attachment ${idx + 1}`}
                                            className="h-28 w-full object-cover"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {order.completed_files && order.completed_files.length > 0 && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                            <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                                Completed Studio Deliverables
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {order.completed_files.map((fileUrl, idx) => (
                                    <a
                                        key={idx}
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                                    >
                                        <Download size={13} />
                                        Download Deliverable #{idx + 1}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
