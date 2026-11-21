import React, { useRef } from "react";
import { Button } from "@/Components/ui/button";
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code,
    Link as LinkIcon,
    Image as ImageIcon,
    Minus,
} from "lucide-react";

interface RichContentEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export function RichContentEditor({
    value,
    onChange,
    placeholder = "Draft article content with rich markdown & html formatting...",
}: RichContentEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertFormatting = (prefix: string, suffix: string = "", defaultText: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end) || defaultText;
        const replacement = `${prefix}${selectedText}${suffix}`;

        const updated = value.substring(0, start) + replacement + value.substring(end);
        onChange(updated);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + prefix.length,
                start + prefix.length + selectedText.length
            );
        }, 10);
    };

    const tools = [
        {
            icon: Bold,
            title: "Bold (**text**)",
            action: () => insertFormatting("**", "**", "bold text"),
        },
        {
            icon: Italic,
            title: "Italic (*text*)",
            action: () => insertFormatting("*", "*", "italic text"),
        },
        {
            icon: Heading1,
            title: "Heading 1 (# Title)",
            action: () => insertFormatting("\n# ", "\n", "Main Section Heading"),
        },
        {
            icon: Heading2,
            title: "Heading 2 (## Subhead)",
            action: () => insertFormatting("\n## ", "\n", "Subsection Title"),
        },
        {
            icon: Heading3,
            title: "Heading 3 (### Sub-bullet)",
            action: () => insertFormatting("\n### ", "\n", "Minor Heading"),
        },
        {
            icon: List,
            title: "Bullet List",
            action: () => insertFormatting("\n- ", "\n", "Bullet point"),
        },
        {
            icon: ListOrdered,
            title: "Numbered List",
            action: () => insertFormatting("\n1. ", "\n", "Numbered step"),
        },
        {
            icon: Quote,
            title: "Blockquote",
            action: () => insertFormatting("\n> ", "\n", "Inspiring editorial quote..."),
        },
        {
            icon: Code,
            title: "Code Block",
            action: () => insertFormatting("\n```typescript\n", "\n```\n", "// Code block snippet"),
        },
        {
            icon: LinkIcon,
            title: "Hyperlink",
            action: () => insertFormatting("[", "](https://example.com)", "link title"),
        },
        {
            icon: ImageIcon,
            title: "Embed Image",
            action: () => insertFormatting("![Alt caption](", ")", "https://images.unsplash.com/..."),
        },
        {
            icon: Minus,
            title: "Divider Line",
            action: () => insertFormatting("\n---\n\n", ""),
        },
    ];

    return (
        <div className="border border-line rounded-md overflow-hidden bg-surface focus-within:border-ring transition-colors">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-surface border-b border-line">
                <span className="text-2xs font-bold text-primary-ink uppercase tracking-wider px-2 py-0.5 border border-primary/30 rounded bg-primary-soft mr-1">
                    RICH EDITOR
                </span>
                {tools.map((t, idx) => (
                    <Button
                        key={idx}
                        type="button"
                        variant="ghost"
                        size="sm"
                        title={t.title}
                        onClick={t.action}
                        className="h-7 w-7 p-0 text-ink-2 hover:text-ink hover:bg-surface-2"
                    >
                        <t.icon className="w-3.5 h-3.5" />
                    </Button>
                ))}
            </div>

            {/* Textarea */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={12}
                className="w-full p-4 bg-transparent text-ink font-mono text-sm leading-relaxed focus:outline-none resize-y min-h-[220px]"
            />

            {/* Editor Footer / Quick Stats */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-surface-2 border-t border-line text-2xs text-subtle">
                <span>Markdown + HTML formatted syntax</span>
                <div className="flex items-center gap-3">
                    <span>
                        {value.trim() ? value.trim().split(/\s+/).length : 0} words
                    </span>
                    <span>{value.length} chars</span>
                    <span className="text-primary-ink">
                        ~{Math.max(1, Math.ceil((value.trim() ? value.trim().split(/\s+/).length : 0) / 200))} min read
                    </span>
                </div>
            </div>
        </div>
    );
}
