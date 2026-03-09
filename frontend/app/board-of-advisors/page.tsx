"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Award,
    Briefcase,
    GraduationCap,
    Globe,
    Linkedin,
    Mail,
    MapPin,
    Quote,
    Shield,
    Users,
    Calendar,
    Clock,
    Video,
    CheckCircle2,
    User,
    ArrowRight,
} from "lucide-react"

/* ─── Advisors Data ─── */

const advisors = [
    {
        name: "Dr. Anil Kumar Agarwal",
        title: "Chairman, CSR Policy Advisory Board",
        organization: "Indian Institute of Corporate Affairs (IICA)",
        location: "New Delhi",
        expertise: ["CSR Policy", "Corporate Governance", "Sustainability"],
        bio: "Dr. Agarwal has over 30 years of experience in corporate governance and CSR policy formulation. He played a key role in drafting the CSR provisions under Section 135 of the Companies Act, 2013 and has advised over 50 major Indian corporations on their CSR strategy.",
        achievements: [
            "Drafted India's first CSR policy framework",
            "Advised 50+ Fortune India companies",
            "Published 12 research papers on sustainable development",
        ],
        yearsOfExperience: 32,
        projectsAdvisored: 120,
        quote: "True CSR is not about compliance — it's about creating shared value that transforms communities.",
    },
    {
        name: "Priya Naik",
        title: "Founder & CEO",
        organization: "Samhita Social Ventures",
        location: "Mumbai",
        expertise: ["Impact Investing", "Social Enterprise", "SDG Alignment"],
        bio: "Priya is a leading voice in India's impact ecosystem. She founded Samhita to bridge the gap between corporate funding and grassroots implementation. Her work has channeled over ₹500 Cr in CSR funds to high-impact projects across 18 states.",
        achievements: [
            "Channeled ₹500+ Cr in CSR funds",
            "Partnered with 200+ NGOs nationwide",
            "TEDx speaker on social innovation",
        ],
        yearsOfExperience: 18,
        projectsAdvisored: 85,
        quote: "The best CSR programs don't just give — they build capacity and create lasting ecosystems of change.",
    },
    {
        name: "Rajesh Tandon",
        title: "President",
        organization: "Society for Participatory Research in Asia (PRIA)",
        location: "New Delhi",
        expertise: ["Community Development", "Participatory Governance", "Civil Society"],
        bio: "Dr. Tandon is an internationally acclaimed expert on participatory development and civil society. He has worked with the United Nations, World Bank, and Indian government on integrating community voices into CSR program design and evaluation.",
        achievements: [
            "UNESCO Chair on Community-Based Research",
            "Authored 25+ books on participatory development",
            "Advisor to NITI Aayog on social sector reforms",
        ],
        yearsOfExperience: 35,
        projectsAdvisored: 200,
        quote: "CSR must be community-led. The best projects are those designed by the people they serve.",
    },
    {
        name: "Meera Sanyal",
        title: "Chairperson",
        organization: "Sustainable Development Council",
        location: "Mumbai",
        expertise: ["Banking & Finance", "Financial Inclusion", "Women Empowerment"],
        bio: "A veteran banker turned social change advocate, Meera brings deep financial expertise to the CSR ecosystem. She specializes in designing financially sustainable CSR programs and has pioneered micro-finance models that are now replicated across South Asia.",
        achievements: [
            "Former Country Head, Royal Bank of Scotland (India)",
            "Pioneered 3 micro-finance models adopted nationwide",
            "Board member of 5 leading NGOs",
        ],
        yearsOfExperience: 28,
        projectsAdvisored: 65,
        quote: "Financial inclusion is the foundation of equitable growth — CSR can be the bridge.",
    },
    {
        name: "Shankar Venkateswaran",
        title: "Chief — Sustainability & CSR",
        organization: "Tata Group (Retired)",
        location: "Bangalore",
        expertise: ["Sustainability Reporting", "ESG Strategy", "Stakeholder Engagement"],
        bio: "Shankar spent 25 years shaping Tata Group's sustainability and CSR agenda. He helped establish Tata Sustainability Group and designed the Tata Affirmative Action Programme. He now advises startups and mid-size companies on building their CSR frameworks from scratch.",
        achievements: [
            "Built Tata's sustainability reporting framework",
            "Designed the Tata Affirmative Action Programme",
            "GRI-certified sustainability trainer",
        ],
        yearsOfExperience: 25,
        projectsAdvisored: 150,
        quote: "Sustainability is not a cost center — it's an investment in the future of business and society.",
    },
    {
        name: "Dr. Nandita Abraham",
        title: "CEO",
        organization: "AISEC India Foundation",
        location: "Chennai",
        expertise: ["Youth Leadership", "Education CSR", "UN SDGs"],
        bio: "Dr. Abraham is a champion of youth-led social development. She has designed CSR programs that engage young professionals as community development fellows, creating a pipeline of social leaders. Her programs have trained 10,000+ youth across 15 states.",
        achievements: [
            "Trained 10,000+ youth as social change leaders",
            "Created India's first Youth CSR Fellowship",
            "UN Women HeForShe Champion",
        ],
        yearsOfExperience: 20,
        projectsAdvisored: 90,
        quote: "When you empower young people to solve social problems, the impact multiplies exponentially.",
    },
]

interface Webinar {
    id: string
    title: string
    speaker: string
    date: string
    time: string
    location: string
    description: string
    category: string
}

const webinars: Webinar[] = [
    {
        id: "web-001",
        title: "Navigating the New CSR Reporting Standards",
        speaker: "Dr. Anil Kumar Agarwal",
        date: "March 25, 2026",
        time: "11:00 AM - 12:30 PM IST",
        location: "Virtual (Zoom/Google Meet)",
        description: "An in-depth session on the latest updates to CSR-2 reporting and compliance requirements for the 2025-26 fiscal year.",
        category: "Compliance",
    },
    {
        id: "web-002",
        title: "Impact Investing: Beyond Traditional Philanthropy",
        speaker: "Priya Naik",
        date: "April 05, 2026",
        time: "03:00 PM - 04:30 PM IST",
        location: "Virtual (Webinar Platform)",
        description: "Explore how corporate funds can be leveraged as catalytic capital for high-impact social enterprises and scalable grassroots models.",
        category: "Innovation",
    },
    {
        id: "web-003",
        title: "Participatory Governance in CSR Program Design",
        speaker: "Dr. Rajesh Tandon",
        date: "April 18, 2026",
        time: "10:00 AM - 11:30 AM IST",
        location: "Impact Center, South Delhi",
        description: "Learn methodologies to include community voices in the design, implementation, and evaluation of your social impact programs.",
        category: "Community",
    }
]

const colors = [
    "bg-primary/10 text-primary",
    "bg-accent/10 text-accent",
    "bg-chart-3/10 text-chart-3",
    "bg-chart-4/10 text-chart-4",
    "bg-primary/10 text-primary",
    "bg-accent/10 text-accent",
]

export default function BoardOfAdvisorsPage() {
    const [registeredWebinars, setRegisteredWebinars] = useState<string[]>([])

    const toggleRegistration = (id: string) => {
        setRegisteredWebinars(prev =>
            prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero */}
                <section className="border-b border-border bg-background px-6 py-16 md:py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-4/10">
                                <Shield className="h-5 w-5 text-chart-4" />
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-chart-4">Advisory Board</p>
                        </div>
                        <h1
                            className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Board of Advisors
                        </h1>
                        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                            Meet the distinguished CSR experts and thought leaders who guide ImpactBridge's mission.
                            Their decades of experience shape our approach to transparent, impactful corporate social responsibility.
                        </p>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="border-b border-border bg-card px-6 py-8">
                    <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>6</p>
                                <p className="text-xs text-muted-foreground">Expert Advisors</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                                <Briefcase className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>160+</p>
                                <p className="text-xs text-muted-foreground">Combined Years of Experience</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                                <Award className="h-5 w-5 text-chart-3" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>710+</p>
                                <p className="text-xs text-muted-foreground">Projects Advised</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
                                <Globe className="h-5 w-5 text-chart-4" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>18+</p>
                                <p className="text-xs text-muted-foreground">States Impacted</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Advisor Profiles */}
                <section className="bg-secondary/40 px-6 py-12 md:py-16">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col gap-8">
                            {advisors.map((advisor, index) => (
                                <Card key={advisor.name} className="border-border bg-card overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="grid md:grid-cols-3">
                                            {/* Profile Summary */}
                                            <div className="flex flex-col items-center gap-4 border-b border-border bg-secondary/30 p-8 text-center md:border-b-0 md:border-r">
                                                <div className={`flex h-20 w-20 items-center justify-center rounded-full ${colors[index]}`}>
                                                    <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                                                        {advisor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                                                        {advisor.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm font-medium text-primary">{advisor.title}</p>
                                                    <p className="text-xs text-muted-foreground">{advisor.organization}</p>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3" /> {advisor.location}
                                                </div>
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    {advisor.expertise.map((skill) => (
                                                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                                                    ))}
                                                </div>
                                                <div className="mt-2 grid w-full grid-cols-2 gap-3">
                                                    <div className="rounded-lg bg-background p-3 text-center">
                                                        <p className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                                                            {advisor.yearsOfExperience}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">Years Exp.</p>
                                                    </div>
                                                    <div className="rounded-lg bg-background p-3 text-center">
                                                        <p className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                                                            {advisor.projectsAdvisored}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">Projects</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    <Button variant="outline" size="sm" className="gap-1.5">
                                                        <Linkedin className="h-3 w-3" /> LinkedIn
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="gap-1.5">
                                                        <Mail className="h-3 w-3" /> Contact
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Bio & Achievements */}
                                            <div className="flex flex-col gap-6 p-8 md:col-span-2">
                                                <div>
                                                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                                        <GraduationCap className="h-4 w-4" /> About
                                                    </h4>
                                                    <p className="leading-relaxed text-foreground">{advisor.bio}</p>
                                                </div>

                                                <div>
                                                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                                        <Award className="h-4 w-4" /> Key Achievements
                                                    </h4>
                                                    <ul className="flex flex-col gap-2">
                                                        {advisor.achievements.map((a) => (
                                                            <li key={a} className="flex items-start gap-3 text-sm text-foreground">
                                                                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                                    <Award className="h-3 w-3 text-primary" />
                                                                </div>
                                                                {a}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="rounded-xl border border-border bg-secondary/40 p-5">
                                                    <div className="flex items-start gap-3">
                                                        <Quote className="h-5 w-5 shrink-0 text-primary" />
                                                        <p className="italic leading-relaxed text-foreground">
                                                            "{advisor.quote}"
                                                        </p>
                                                    </div>
                                                    <p className="mt-3 text-right text-xs font-medium text-muted-foreground">
                                                        — {advisor.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Upcoming Webinars */}
                <section className="bg-background px-6 py-16 md:py-24 border-t border-border">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-12 flex flex-col items-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4 text-primary">
                                <Video className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
                                Upcoming Webinars & Workshops
                            </h2>
                            <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
                                Learn directly from our advisory board members. Join our exclusive webinars to stay updated on CSR trends, impact measurement, and social innovation.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {webinars.map((webinar) => (
                                <Card key={webinar.id} className="group border-border bg-card transition-all hover:shadow-lg flex flex-col">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                {webinar.category}
                                            </Badge>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Users className="h-3.5 w-3.5" /> 150+ Joined
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                                            {webinar.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-1 flex-col gap-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-foreground">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Main Speaker</p>
                                                    <p className="font-semibold">{webinar.speaker}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Calendar className="h-3.5 w-3.5" /> Date
                                                    </div>
                                                    <p className="text-sm font-medium">{webinar.date}</p>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Clock className="h-3.5 w-3.5" /> Time
                                                    </div>
                                                    <p className="text-sm font-medium">{webinar.time}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <MapPin className="h-3.5 w-3.5" /> Location
                                                </div>
                                                <p className="text-sm font-medium">{webinar.location}</p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {webinar.description}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-border">
                                            <Button
                                                className={`w-full group/btn ${registeredWebinars.includes(webinar.id) ? 'bg-chart-3 hover:bg-chart-3/90' : ''}`}
                                                onClick={() => toggleRegistration(webinar.id)}
                                            >
                                                {registeredWebinars.includes(webinar.id) ? (
                                                    <span className="flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4" /> Registered
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        Register Now <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
