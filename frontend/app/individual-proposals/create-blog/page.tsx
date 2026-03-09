"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, FileText, Send, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CreateBlogPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)
            setTimeout(() => {
                router.push("/individual-proposals")
            }, 2000)
        }, 1500)
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 bg-secondary/40 py-12 md:py-20 px-6">
                <div className="mx-auto max-w-3xl">
                    <Link
                        href="/individual-proposals"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Proposals & Blogs
                    </Link>

                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                                Write a Blog Post
                            </h1>
                            <p className="text-muted-foreground">Share your insights, stories, and impact with the community.</p>
                        </div>
                    </div>

                    <Card className="border-border bg-card shadow-lg">
                        <CardHeader>
                            <CardTitle>Draft your post</CardTitle>
                            <CardDescription>Tell the world about your journey, challenges, or vision for social change.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isSuccess ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 animate-in zoom-in duration-300">
                                        <CheckCircle2 className="h-10 w-10 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                                        Blog Published Successfully!
                                    </h2>
                                    <p className="text-muted-foreground">Your story is live. Redirecting you back to the main page...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Blog Title</Label>
                                        <Input id="title" placeholder="Enter a catchy title for your blog" required />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="author">Author Name / pen name</Label>
                                        <Input id="author" placeholder="John Doe or Your Organization" required />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="content">Content</Label>
                                        <Textarea
                                            id="content"
                                            placeholder="Write your blog post here... Use markdown or plain text."
                                            className="min-h-[300px] resize-y"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="tags">Tags (comma separated)</Label>
                                        <Input id="tags" placeholder="Education, Healthcare, Impact, Story" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="image">Cover Image URL (optional)</Label>
                                        <Input id="image" placeholder="https://example.com/image.jpg" />
                                    </div>

                                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                                        <Button type="submit" className="gap-2" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" /> Publishing...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4" /> Publish Blog Post
                                                </>
                                            )}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => router.back()}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
