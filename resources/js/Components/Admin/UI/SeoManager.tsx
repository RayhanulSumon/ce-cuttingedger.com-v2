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
        <div className="space-y-4 rounded-lg border border-line bg-surface p-4 text-ink">
            {/* Hidden background inputs to guarantee form payload submission */}
            <input type="hidden" name="canonical_url" value={data.canonical_url || ""} />
            <input type="hidden" name="og_image" value={data.og_image || ""} />

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-primary-ink" />
                    <span className="text-xs font-bold uppercase tracking-wider text-ink">
                        DYNAMIC SEO & OPEN GRAPH SUITE
                    </span>
                    <Badge
                        variant="outline"
                        className={`text-2xs ${
                            score >= 80
                                ? "border-success/25 bg-success-soft text-success"
                                : score >= 50
                                ? "border-warning/25 bg-warning-soft text-warning"
                                : "border-danger/25 bg-danger-soft text-danger"
                        }`}
                    >
                        SEO Health: {score}%
                    </Badge>
                </div>
                <button
                    type="button"
                    onClick={handleAutoGenerate}
                    className="flex items-center gap-1.5 text-xs text-primary-ink hover:text-primary-ink bg-primary-soft border border-primary/30 px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    Auto-Fill From Post
                </button>
            </div>

            {/* Google SERP Preview Card */}
            <div className="rounded-md border border-line bg-surface p-3 space-y-1">
                <span className="text-2xs uppercase tracking-wider text-subtle">
                    SEARCH ENGINE RESULT SNIPPET (SERP PREVIEW)
                </span>
                <div className="flex items-center gap-1.5 text-2xs text-subtle font-sans">
                    <Globe className="w-3.5 h-3.5 text-subtle" />
                    <span className="truncate">{displayUrl}</span>
                </div>
                <div className="text-sm font-medium text-info hover:underline cursor-pointer truncate">
                    {displayTitle}
                </div>
                <div className="text-xs text-ink-2 line-clamp-2 leading-relaxed">
                    {displayDesc}
                </div>
            </div>

            {/* Inputs Grid: Title & Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                        <label className="text-ink-2">Meta Title Tag</label>
                        <span
                            className={
                                titleLength > 60
                                    ? "text-danger"
                                    : titleLength >= 30
                                    ? "text-success"
                                    : "text-subtle"
                            }
                        >
                            {titleLength} / 60 chars
                        </span>
                    </div>
                    <Input
                        placeholder={fallbackTitle || "Optimal length: 50-60 characters"}
                        value={data.meta_title || ""}
                        onChange={(e) => onChange("meta_title", e.target.value)}
                        className="bg-surface border-line focus:border-ring"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs text-ink-2">
                        Meta Keywords (Comma separated)
                    </label>
                    <Input
                        placeholder="design engineering, spatial ui, reactive motion"
                        value={data.meta_keywords || ""}
                        onChange={(e) => onChange("meta_keywords", e.target.value)}
                        className="bg-surface border-line focus:border-ring"
                    />
                </div>
            </div>

            {/* Meta Description */}
            <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                    <label className="text-ink-2">Meta Description</label>
                    <span
                        className={
                            descLength > 160
                                ? "text-danger"
                                : descLength >= 110
                                ? "text-success"
                                : "text-subtle"
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
                    className="bg-surface border-line focus:border-ring"
                />
            </div>

            {/* Crawler Robots Directives */}
            <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                    <label className="text-xs text-ink-2 flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-primary-ink" />
                        <span>Robots Directives</span>
                    </label>
                    <span className="text-2xs text-subtle">
                        Crawler index & link rules
                    </span>
                </div>
                <Select
                    value={data.robots || "index, follow"}
                    onValueChange={(val) => onChange("robots", val)}
                >
                    <SelectTrigger className="h-10 bg-surface border-line hover:border-line-strong focus:border-ring text-ink">
                        <SelectValue placeholder="Select robots rule">
                            {(data.robots || "index, follow") === "noindex, nofollow" ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-danger shrink-0" />
                                    <span className="text-xs text-ink">noindex, nofollow</span>
                                    <span className="text-2xs text-subtle hidden sm:inline">(Strictly Private)</span>
                                </div>
                            ) : (data.robots || "index, follow") === "noindex, follow" ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-warning shrink-0" />
                                    <span className="text-xs text-ink">noindex, follow</span>
                                    <span className="text-2xs text-subtle hidden sm:inline">(Hidden from Search)</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-success shrink-0" />
                                    <span className="text-xs text-ink">index, follow</span>
                                    <span className="text-2xs text-subtle hidden sm:inline">(Standard Public)</span>
                                </div>
                            )}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-line text-ink shadow-2xl min-w-[300px]">
                        <SelectGroup>
                            <SelectLabel>SEARCH CRAWLER DIRECTIVES</SelectLabel>
                            <SelectItem value="index, follow" className="py-2.5 px-3 cursor-pointer">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-success shadow-xs shrink-0" />
                                    <div className="flex flex-col text-left">
                                        <span className="font-medium text-ink text-xs">index, follow</span>
                                        <span className="text-2xs text-subtle">Standard Public • Index article & crawl links</span>
                                    </div>
                                </div>
                            </SelectItem>
                            <SelectItem value="noindex, follow" className="py-2.5 px-3 cursor-pointer">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-warning shadow-xs shrink-0" />
                                    <div className="flex flex-col text-left">
                                        <span className="font-medium text-ink text-xs">noindex, follow</span>
                                        <span className="text-2xs text-subtle">Hidden from Search • Hide page, follow links</span>
                                    </div>
                                </div>
                            </SelectItem>
                            <SelectItem value="noindex, nofollow" className="py-2.5 cursor-pointer">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-danger shadow-xs shrink-0" />
                                    <div className="flex flex-col text-left">
                                        <span className="font-medium text-ink text-xs">noindex, nofollow</span>
                                        <span className="text-2xs text-subtle">Strictly Private • Block index & all links</span>
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
