import React from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { BlogCategory, TeamMember } from "@/types/models";
import { BlogForm } from "./BlogForm";

interface BlogsCreateProps {
    categories: BlogCategory[];
    authors: TeamMember[];
}

export default function BlogsCreate({ categories = [], authors = [] }: BlogsCreateProps) {
    return (
        <AdminLayout title="Compose Blog Post">
            <div className="space-y-6">
                <AdminPageHeader
                    title="Compose Blog Post"
                    description="Draft an authoritative article with typography hierarchy, category taxonomies, and high-performance SEO metadata."
                >
                    <Link href={route("admin.blogs.index")}>
                        <Button
                            variant="outline"
                            className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Blogs</span>
                        </Button>
                    </Link>
                </AdminPageHeader>

                <BlogForm mode="create" categories={categories} authors={authors} />
            </div>
        </AdminLayout>
    );
}
