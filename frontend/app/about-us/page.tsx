"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    Users,
    DollarSign,
    Building2,
    Heart,
    Globe,
    Handshake,
    Target,
    Lightbulb,
    Quote,
    Sparkles,
} from "lucide-react"

/* ─── Data ─── */

const stakeholderSections = [
    {
        icon: Users,
        color: "bg-primary/10 text-primary",
        borderColor: "border-primary/20",
        title: "For the Beneficiaries",
        subtitle: "A Gateway to Opportunities",
        description:
            "At the heart of our platform are the beneficiaries — the individuals and communities who need support. Our platform empowers them by providing direct access to CSR projects tailored to their needs. Whether it's educational support, healthcare assistance, or community development programs, beneficiaries can easily discover and apply for the right initiatives. By providing them with the tools and resources to thrive, we are helping them take charge of their own future.",
        href: "/beneficiaries",
        cta: "Explore Beneficiary Portal",
    },
    {
        icon: DollarSign,
        color: "bg-accent/10 text-accent",
        borderColor: "border-accent/20",
        title: "For the Funders",
        subtitle: "Making Impactful Investments",
        description:
            "For funders, we offer a seamless way to track the impact of their contributions. Businesses, philanthropists, and corporate giants can now fund projects with transparency, ensuring that every penny goes towards positive change. Through our platform, funders can see real-time updates, reports, and analytics, ensuring their contributions are making a measurable difference. Our goal is to make giving as impactful as it is easy, creating a ripple effect of positive change across the globe.",
        href: "/funders",
        cta: "Explore Funder Dashboard",
    },
    {
        icon: Building2,
        color: "bg-chart-3/10 text-chart-3",
        borderColor: "border-chart-3/20",
        title: "For the Implementers",
        subtitle: "Partnering for Progress",
        description:
            "The implementers are the heart and soul of every CSR project. From NGOs to non-profits, to local organizations, they work tirelessly to ensure that initiatives are successfully carried out on the ground. Our platform empowers them with the tools to manage projects, track progress, and ensure that funders and beneficiaries are always in the loop. Together, with the support of businesses and communities, implementers are creating sustainable change that goes beyond just charity — they're laying the foundation for a better future.",
        href: "/implementers",
        cta: "Explore Implementer Portal",
    },
]

const values = [
    { icon: Globe, label: "Transparency", description: "Every contribution tracked, every impact measured." },
    { icon: Handshake, label: "Collaboration", description: "Connecting businesses, NGOs, and communities." },
    { icon: Heart, label: "Inclusivity", description: "Ensuring CSR reaches those who need it most." },
    { icon: Target, label: "Accountability", description: "Real-time reporting and measurable outcomes." },
]

export default function AboutUsPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero */}
                <section className="border-b border-border bg-background px-6 py-16 md:py-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-primary">About Us</p>
                        </div>
                        <h1
                            className="max-w-3xl text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Bridging the gap between resources and impact
                        </h1>
                        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                            Once upon a time, in a world where resources were abundant but access was limited, a group of visionaries
                            came together with a singular purpose — to bridge the gap. They saw the untapped potential in communities,
                            in organizations, and in the world's most powerful tool: collaboration.
                        </p>
                        <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                            This vision turned into a mission to create a world where CSR (Corporate Social Responsibility) isn't just a
                            buzzword, but a driving force for change, growth, and empowerment.
                        </p>
                    </div>
                </section>

                {/* Mission */}
                <section className="bg-primary px-6 py-16 md:py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid items-center gap-10 md:grid-cols-2">
                            <div>
                                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">Our Mission</p>
                                <h2
                                    className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    Transforming lives through action
                                </h2>
                                <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/80">
                                    Our mission is simple yet profound — to connect the beneficiaries, funders, and implementers of CSR projects,
                                    creating a thriving ecosystem that fosters growth, support, and accountability. We believe that through
                                    collective action, we can make a difference, whether it's empowering individuals, enhancing communities, or
                                    helping businesses align their resources to create real change.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {values.map((v) => (
                                    <div key={v.label} className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                                            <v.icon className="h-5 w-5 text-primary-foreground" />
                                        </div>
                                        <h4 className="mt-3 font-semibold text-primary-foreground">{v.label}</h4>
                                        <p className="mt-1 text-sm text-primary-foreground/70">{v.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* How We Came Together */}
                <section className="border-b border-border bg-background px-6 py-16 md:py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                                <Lightbulb className="h-7 w-7 text-accent" />
                            </div>
                            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Our Story</p>
                            <h2
                                className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                                style={{ fontFamily: "var(--font-heading)" }}
                            >
                                How we came together
                            </h2>
                            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
                                The foundation of our platform was laid when a group of passionate individuals, from diverse walks of life,
                                came together. The team consisted of social impact advocates, tech innovators, and entrepreneurs. Together,
                                they recognized that for CSR to be truly impactful, it needed to be transparent, inclusive, and collaborative.
                            </p>
                            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                                They set out to create a platform that could make these values a reality — one where businesses, NGOs, and
                                beneficiaries would come together seamlessly to drive change.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stakeholder Sections */}
                <section className="bg-secondary/40 px-6 py-16 md:py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-12 text-center">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Who We Serve</p>
                            <h2
                                className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                                style={{ fontFamily: "var(--font-heading)" }}
                            >
                                Three stakeholders, one ecosystem
                            </h2>
                        </div>

                        <div className="flex flex-col gap-8">
                            {stakeholderSections.map((s) => (
                                <Card key={s.title} className={`border-border bg-card overflow-hidden border-l-4 ${s.borderColor}`}>
                                    <CardContent className="flex flex-col gap-4 p-8 md:flex-row md:items-start md:gap-8">
                                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${s.color}`}>
                                            <s.icon className="h-7 w-7" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.subtitle}</p>
                                            <h3
                                                className="mt-1 text-xl font-bold text-foreground"
                                                style={{ fontFamily: "var(--font-heading)" }}
                                            >
                                                {s.title}
                                            </h3>
                                            <p className="mt-3 leading-relaxed text-muted-foreground">{s.description}</p>
                                            <Button variant="outline" className="mt-4 gap-2" asChild>
                                                <Link href={s.href}>
                                                    {s.cta} <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vision */}
                <section className="border-b border-border bg-background px-6 py-16 md:py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto max-w-3xl">
                            <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
                                <div className="flex items-start gap-4">
                                    <Quote className="h-8 w-8 shrink-0 text-primary" />
                                    <div>
                                        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Our Vision</p>
                                        <h2
                                            className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl"
                                            style={{ fontFamily: "var(--font-heading)" }}
                                        >
                                            A future built on collaboration
                                        </h2>
                                        <p className="mt-4 leading-relaxed text-muted-foreground">
                                            Looking ahead, we envision a future where CSR becomes more than a corporate initiative; it becomes a
                                            movement. A movement where every individual, company, and organization can make an impact, no matter
                                            how big or small. We're here to break down barriers, to connect resources with needs, and to provide
                                            a platform where everyone has a role to play.
                                        </p>
                                        <p className="mt-4 leading-relaxed text-muted-foreground">
                                            Through this journey, we've built more than a platform — we've built a community. A community united by
                                            the belief that together, we can create a better, more equitable world.
                                        </p>
                                        <p className="mt-6 text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                                            Welcome to our mission. Welcome to the future of CSR.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-primary py-16 md:py-20">
                    <div className="mx-auto max-w-7xl px-6 text-center">
                        <h2
                            className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Ready to join the movement?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-primary-foreground/80">
                            Whether you're a beneficiary seeking support, a funder looking to make an impact, or an implementer driving change — there's a place for you here.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button size="lg" variant="secondary" className="gap-2 px-8 text-base" asChild>
                                <Link href="/register">
                                    Get Started <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-primary-foreground/30 bg-transparent px-8 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                                asChild
                            >
                                <Link href="/csr-projects">Explore Projects</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
