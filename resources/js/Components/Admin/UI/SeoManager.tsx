import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { Search, Globe, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

export interface SeoFieldsData {
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    canonical_url: string;
    og_image: string;
    robots: string;
}

interface SeoManagerProps {
    data: SeoFieldsData;
    onChange: <K extends keyof SeoFieldsData>(field: K, value: SeoFieldsData[K]) => void;
    fallbackTitle?: string;
    fallbackDescription?: string;
    fallbackSlug?: string;
    fallbackImage?: string;
}

export function SeoManager({
    data,
    onChange,
    fallbackTitle = "",
    fallbackDescription = "",
    fallbackSlug = "",
    fallbackImage = "",
}: SeoManagerProps) {
    const displayTitle = data.meta_title || fallbackTitle || "Article Title — CuttingEdger";
    const displayDesc = data.meta_description || fallbackDescription || "Detailed article excerpt and architectural summary...";
    const displayUrl = data.canonical_url || `https://cuttingedger.com/blog/${fallbackSlug || "article-slug"}`;
    const displayOgImage = data.og_image || fallbackImage;

    const titleLength = (data.meta_title || "").length;
    const descLength = (data.meta_description || "").length;

    // Calculate dynamic SEO health score
    let score = 0;
    if (titleLength >= 30 && titleLength <= 60) score += 30;
    else if (titleLength > 0) score += 15;

    if (descLength >= 100 && descLength <= 160) score += 35;
    else if (descLength > 0) score += 20;

    if (data.meta_keywords?.trim()) score += 15;
    if (data.canonical_url?.trim()) score += 10;
    if (data.og_image?.trim() || fallbackImage) score += 10;

    const handleAutoGenerate = () => {
        if (!data.meta_title && fallbackTitle) {
            onChange("meta_title", `${fallbackTitle} — CuttingEdger Journal`);
        }
        if (!data.meta_description && fallbackDescription) {
            onChange("meta_description", fallbackDescription.slice(0, 155));
        }
        if (!data.canonical_url && fallbackSlug) {
            onChange("canonical_url", `https://cuttingedger.com/blog/${fallbackSlug}`);
        }
        if (!data.og_image && fallbackImage) {
            onChange("og_image", fallbackImage);
        }
    };

    return (
        <div className="space-y-4 rounded-lg border border-white/10 bg-[#0c0d12] p-4 text-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#d4ff00]" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                        DYNAMIC SEO & OPEN GRAPH SUITE
                    </span>
                    <Badge
                        variant="outline"
                        className={`text-[10px] font-mono ${
                            score >= 80
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : score >= 50
                                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                                : "border-rose-500/30 bg-rose-500/10 text-rose-400"
                        }`}
                    >
                        SEO Health: {score}%
                    </Badge>
                </div>
                <button
                    type="button"
                    onClick={handleAutoGenerate}
                    className="flex items-center gap-1.5 text-xs font-mono text-[#d4ff00] hover:text-[#b8dd00] bg-[#d4ff00]/10 border border-[#d4ff00]/30 px-2.5 py-1 rounded transition-colors"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    Auto-Fill From Post
                </button>
            </div>

            {/* Google SERP Preview Card */}
            <div className="rounded-md border border-white/5 bg-[#12131a] p-3 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    SEARCH ENGINE RESULT SNIPPET (SERP PREVIEW)
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-sans">
                    <Globe className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="truncate">{displayUrl}</span>
                </div>
                <div className="text-sm font-medium text-[#8ab4f8] hover:underline cursor-pointer truncate">
                    {displayTitle}
                </div>
                <div className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {displayDesc}
                </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono">
                        <label className="text-neutral-300">Meta Title Tag</label>
                        <span
                            className={
                                titleLength > 60
                                    ? "text-rose-400"
                                    : titleLength >= 30
                                    ? "text-emerald-400"
                                    : "text-neutral-500"
                            }
                        >
                            {titleLength} / 60 chars
                        </span>
                    </div>
                    <Input
                        placeholder={fallbackTitle || "Optimal length: 50-60 characters"}
                        value={data.meta_title || ""}
                        onChange={(e) => onChange("meta_title", e.target.value)}
                        className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300">
                        Meta Keywords (Comma separated)
                    </label>
                    <Input
                        placeholder="design engineering, spatial ui, reactive motion"
                        value={data.meta_keywords || ""}
                        onChange={(e) => onChange("meta_keywords", e.target.value)}
                        className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                    <label className="text-neutral-300">Meta Description</label>
                    <span
                        className={
                            descLength > 160
                                ? "text-rose-400"
                                : descLength >= 110
                                ? "text-emerald-400"
                                : "text-neutral-500"
                        }
                    >
                        {descLength} / 160 chars
                    </span>
                </div>
                <Textarea
                    rows={2}
                    placeholder={fallbackDescription || "Concise and compelling summary for Google and social previews (110-160 characters)"}
                    value={data.meta_description || ""}
                    onChange={(e) => onChange("meta_description", e.target.value)}
                    className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300">
                        Canonical URL
                    </label>
                    <Input
                        placeholder="https://cuttingedger.com/blog/..."
                        value={data.canonical_url || ""}
                        onChange={(e) => onChange("canonical_url", e.target.value)}
                        className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300">
                        Open Graph / Twitter Card Image URL
                    </label>
                    <Input
                        placeholder="https://images.unsplash.com/..."
                        value={data.og_image || ""}
                        onChange={(e) => onChange("og_image", e.target.value)}
                        className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300">
                        Robots Directives
                    </label>
                    <select
                        value={data.robots || "index, follow"}
                        onChange={(e) => onChange("robots", e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-[#12131a] border border-white/10 text-white text-sm focus:border-[#d4ff00] focus:outline-none"
                    >
                        <option value="index, follow">index, follow (Standard Public)</option>
                        <option value="noindex, follow">noindex, follow (Hidden from Search)</option>
                        <option value="noindex, nofollow">noindex, nofollow (Strictly Private)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
