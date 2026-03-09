"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowRight,
    Building2,
    Users,
    DollarSign,
    Search,
    CheckCircle2,
    BarChart3,
    ShieldCheck,
    Zap,
    Globe,
    PieChart,
    MessageSquare,
    TrendingUp,
    FileText,
    Heart,
} from "lucide-react"
import Link from "next/link"

const workflowSteps = [
    {
        title: "1. Define Funding Goals",
        desc: "Funders register, set objectives, and select impact areas they want to support.",
        icon: Zap
    },
    {
        title: "2. NGOs List Projects",
        desc: "NGOs outline verifiable project plans and programs that need backing.",
        icon: FileText
    },
    {
        title: "3. Discover & Connect",
        desc: "Funders discover aligned NGO projects and connect with them to provide support.",
        icon: Search
    },
    {
        title: "4. Execution & Delivery",
        desc: "NGOs implement the projects on the ground with full accountability.",
        icon: CheckCircle2
    },
    {
        title: "5. Beneficiary Engagement",
        desc: "Beneficiaries access services and provide real-world feedback.",
        icon: Heart
    },
    {
        title: "6. Track Impact",
        desc: "All parties monitor progress, review regular reports, and measure success.",
        icon: TrendingUp
    }
]

const features = [
    {
        title: "Real-Time Reporting",
        desc: "Funders and NGOs can track project progress with transparent, scheduled updates.",
        icon: BarChart3
    },
    {
        title: "Impact Tracking",
        desc: "Measure the social impact of each project with granular data and verified outcomes.",
        icon: PieChart
    },
    {
        title: "Unified Connection",
        desc: "We do not exchange money directly. We simply connect funders, NGOs, and beneficiaries on a single platform.",
        icon: Users
    }
]

export default function HowItWorksPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-background px-6 py-20 text-center md:py-28">
                    <div className="mx-auto max-w-4xl">
                        <Badge variant="outline" className="mb-6 border-primary/20 bg-primary/5 px-4 py-1 text-primary">
                            The ImpactBridge Ecosystem
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl" style={{ fontFamily: "var(--font-heading)" }}>
                            How Everything Connects
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                            We bridge the gap between capital and compassion by creating a transparent, high-trust ecosystem for social impact.
                        </p>
                    </div>
                </section>

                {/* Workflow Section */}
                <section className="bg-secondary/30 px-6 py-24">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>The Impact Workflow</h2>
                            <p className="mt-4 text-muted-foreground md:text-lg">A simple step-by-step look at how we drive change together.</p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {workflowSteps.map((step, idx) => (
                                <Card key={idx} className="relative overflow-hidden border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg">
                                    <div className="absolute -right-4 -top-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/5">
                                        <span className="text-5xl font-bold text-primary/10">{idx + 1}</span>
                                    </div>
                                    <CardContent className="p-8 relative z-10">
                                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mb-3 text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                                            {step.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Key Features */}
                <section className="px-6 py-24 md:py-32">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Key Features of ImpactBridge</h2>
                            <p className="mt-4 text-muted-foreground">The technology and processes that ensure transparency and high-impact delivery.</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <feature.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-primary px-6 py-20 text-center text-primary-foreground">
                    <div className="mx-auto max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>Ready to make an impact?</h2>
                        <p className="mt-6 text-lg opacity-90">
                            Join our growing community of funders, NGOs, and beneficiaries today.
                        </p>
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                            <Button size="lg" variant="secondary" className="h-12 px-8 text-base" asChild>
                                <Link href="/register">Create Account</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 bg-transparent px-8 text-base text-primary-foreground hover:bg-white/10" asChild>
                                <Link href="/csr-projects">Browse Projects</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
