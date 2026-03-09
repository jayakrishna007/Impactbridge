"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, GraduationCap, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function ProductsPage() {
    const { user } = useAuth()
    const router = useRouter()

    if (user?.role !== 'funder') {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <ShieldCheck className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        This section is exclusively reserved for our CSR funding partners.
                        Please log in with a funder account to view our premium CSR products.
                    </p>
                    <Button onClick={() => router.push("/")}>Return to Home</Button>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1 bg-background">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-primary/5 py-16 md:py-24 border-b border-border">
                    <div className="mx-auto max-w-7xl px-6 relative z-10 flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>Featured Product</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground max-w-4xl" style={{ fontFamily: "var(--font-heading)" }}>
                            Meet <span className="text-primary">K10</span>: The AI Educator
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
                            An advanced educational chatbot provided freely to government schools,
                            entirely powered by forward-thinking CSR funding.
                        </p>
                    </div>
                </section>

                {/* The Story */}
                <section className="py-16 md:py-24 px-6">
                    <div className="mx-auto max-w-4xl space-y-12">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>The Story Behind K10</h2>
                            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                        </div>

                        <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground leading-relaxed">
                            <p>
                                In many rural and underserved urban districts, government schools struggle with a severe shortage of teaching staff and modern learning resources. Despite the best efforts of dedicated teachers, individual student attention is often impossible when classrooms swell to fifty or sixty students per educator.
                            </p>
                            <p>
                                That's where <strong>K10</strong> was born.
                            </p>
                            <p>
                                We envisioned an intelligent, empathetic, and culturally aware AI assistant that could act as a supplementary tutor for every single student. K10 isn't designed to replace teachers; it's designed to empower them.
                            </p>

                            <Card className="my-10 bg-secondary/30 border-primary/20">
                                <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-left">
                                    <div className="p-4 bg-primary/10 rounded-2xl shrink-0">
                                        <Bot className="w-12 h-12 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: "var(--font-heading)" }}>How K10 Works</h3>
                                        <p className="text-muted-foreground m-0">
                                            K10 speaks over 12 regional languages and adapts its curriculum entirely to the syllabus of the local state board. Whether a student needs help understanding complex algebraic equations, practicing English grammar, or simply getting career advice, K10 is available 24/7 on library computers, tablets, and even legacy SMS systems.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <p>
                                The best part? <strong>It costs the schools absolutely nothing.</strong>
                            </p>
                            <p>
                                Through the generous contributions of our CSR funding partners (like you), we are able to deploy K10 instances directly into the IT infrastructure of underfunded government institutions. Your funding covers the API costs, server maintenance, and continuous psychological and educational training of the model.
                            </p>
                        </div>

                        {/* Impact Stats */}
                        <div className="grid sm:grid-cols-3 gap-6 pt-8 border-t border-border">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "var(--font-heading)" }}>50,000+</div>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Students Reached</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "var(--font-heading)" }}>400+</div>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Schools Active</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "var(--font-heading)" }}>12</div>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Languages Supported</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-primary text-primary-foreground py-16 px-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="mx-auto max-w-3xl text-center relative z-10">
                        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Fund the Future of Education</h2>
                        <p className="text-primary-foreground/80 text-lg mb-8 text-balance">
                            Ready to sponsor a K10 deployment in a district of your choice? Connect with our implementation team today to integrate this product into your annual CSR portfolio.
                        </p>
                        <Button size="lg" variant="secondary" className="font-bold gap-2">
                            <HeartHandshake className="w-5 h-5" /> Speak with an Advisor
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
