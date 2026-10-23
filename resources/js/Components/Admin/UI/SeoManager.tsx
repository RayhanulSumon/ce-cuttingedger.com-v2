import React, { useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import {
    Search,
    Globe,
    Sparkles,
    Bot,
} from "lucide-react";
import {
    Select,
    SelectGroup,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

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

    const titleLength = (data.meta_title || "").length;
    const descLength = (data.meta_description || "").length;

    // Automatically synchronize Canonical URL and OG Image in the background
    useEffect(() => {
        if (fallbackSlug) {
            const expectedCanonical = `https://cuttingedger.com/blog/${fallbackSlug}`;
            if (!data.canonical_url || data.canonical_url.startsWith("https://cuttingedger.com/blog/")) {
                if (data.canonical_url !== expectedCanonical) {
                    onChange("canonical_url", expectedCanonical);
                }
            }
        }
    }, [fallbackSlug, data.canonical_url, onChange]);

    useEffect(() => {
        if (fallbackImage !== undefined) {
            const targetOg = fallbackImage || "";
            if (data.og_image !== targetOg) {
                onChange("og_image", targetOg);
            }
        }
    }, [fallbackImage, data.og_image, onChange]);

    // Calculate dynamic SEO health score
    let score = 0;
    if (titleLength >= 30 && titleLength <= 60) score += 30;
    else if (titleLength > 0) score += 15;

    if (descLength >= 100 && descLength <= 160) score += 35;
    else if (descLength > 0) score += 20;

    if (data.meta_keywords?.trim()) score += 15;
    if (data.canonical_url?.trim() || fallbackSlug) score += 10;
    if (data.og_image?.trim() || fallbackImage) score += 10;

    const handleAutoGenerate = () => {
        if (!data.meta_title && fallbackTitle) {
            onChange("meta_title", `${fallbackTitle} — CuttingEdger Journal`);
        }
        if (!data.meta_description && fallbackDescription) {
            onChange("meta_description", fallbackDescription.slice(0, 155));
        }
        if (fallbackSlug) {
            onChange("canonical_url", `https://cuttingedger.com/blog/${fallbackSlug}`);
        }
        if (fallbackImage) {
            onChange("og_image", fallbackImage);
        }
    };

    return (
        <div className="space-y-4 rounded-lg border border-white/10 bg-[#0c0d12] p-4 text-white">
            {/* Hidden background inputs to guarantee form payload submission */}
            <input type="hidden" name="canonical_url" value={data.canonical_url || ""} />
            <input type="hidden" name="og_image" value={data.og_image || ""} />

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
                    className="flex items-center gap-1.5 text-xs font-mono text-[#d4ff00] hover:text-[#b8dd00] bg-[#d4ff00]/10 border border-[#d4ff00]/30 px-2.5 py-1 rounded transition-colors cursor-pointer"
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

            {/* Inputs Grid: Title & Keywords */}
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

            {/* Meta Description */}
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

            {/* Crawler Robots Directives */}
            <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-[#d4ff00]" />
                        <span>Robots Directives</span>
                    </label>
                    <span className="text-[10px] font-mono text-neutral-500">
                        Crawler index & link rules
                    </span>
                </div>
                <Select
                    value={data.robots || "index, follow"}
                    onValueChange={(val) => onChange("robots", val)}
                >
                    <SelectTrigger className="h-10 bg-[#12131a] border-white/10 hover:border-white/20 focus:border-[#d4ff00] text-white">
                        <SelectValue placeholder="Select robots rule">
                            {(data.robots || "index, follow") === "noindex, nofollow" ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                                    <span className="font-mono text-xs text-white">noindex, nofollow</span>
                                    <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">(Strictly Private)</span>
                                </div>
                            ) : (data.robots || "index, follow") === "noindex, follow" ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                                    <span className="font-mono text-xs text-white">noindex, follow</span>
                                    <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">(Hidden from Search)</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                    <span className="font-mono text-xs text-white">index, follow</span>
                                    <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">(Standard Public)</span>
                                </div>
                            )}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1118] border-white/15 text-white shadow-2xl min-w-[300px]">
                        <SelectGroup>
                            <SelectLabel>SEARCH CRAWLER DIRECTIVES</SelectLabel>
                            <SelectItem value="index, follow" className="py-2.5 px-3 cursor-pointer">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] shrink-0" />
                                    <div className="flex flex-col text-left">
                                        <span className="font-medium text-white text-xs font-mono">index, follow</span>
                                        <span className="text-[11px] text-neutral-400">Standard Public • Index article & crawl links</span>
                                    </div>
                                </div>
                            </SelectItem>
                            <SelectItem value="noindex, follow" className="py-2.5 px-3 cursor-pointer">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] shrink-0" />
                                    <div className="flex flex-col text-left">
                                        <span className="font-medium text-white text-xs font-mono">noindex, follow</span>
                                        <span className="text-[11px] text-neutral-400">Hidden from Search • Hide page, follow links</span>
                                    </div>
                                </div>
                            </SelectItem>
                            <SelectItem value="noindex, nofollow" className="py-2.5 cursor-pointer">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)] shrink-0" />
                                    <div className="flex flex-col text-left">
                                        <span className="font-medium text-white text-xs font-mono">noindex, nofollow</span>
                                        <span className="text-[11px] text-neutral-400">Strictly Private • Block index & all links</span>
                                    </div>
                                </div>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
