import React from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Blog, BlogCategory, TeamMember } from "@/types/models";
import { BlogForm } from "./BlogForm";

interface BlogsEditProps {
    blog: Blog;
    categories: BlogCategory[];
    authors: TeamMember[];
}

export default function BlogsEdit({ blog, categories = [], authors = [] }: BlogsEditProps) {
    return (
        <AdminLayout title={`Edit: ${blog.title}`}>
            <div className="space-y-6">
                <AdminPageHeader
                    eyebrow="EDITORIAL CONTENT ENGINE"
                    title="Edit Blog Article"
                    description={`Editing "${blog.title}". Modify content, calibrate category taxonomies, and tune search metadata.`}
                >
                    <div className="flex items-center gap-3">
                        <Link href={route("admin.blogs.index")}>
                            <Button
                                variant="outline"
                                className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Articles</span>
                            </Button>
                        </Link>

                        {blog.slug && (
                            <a
                                href={`/blog/${blog.slug}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Button
                                    variant="outline"
                                    className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono cursor-pointer"
                                >
                                    <ExternalLink className="w-4 h-4 text-[#d4ff00]" />
                                    <span>View Live</span>
                                </Button>
                            </a>
                        )}
                    </div>
                </AdminPageHeader>

                <BlogForm mode="edit" blog={blog} categories={categories} authors={authors} />
            </div>
        </AdminLayout>
    );
}
