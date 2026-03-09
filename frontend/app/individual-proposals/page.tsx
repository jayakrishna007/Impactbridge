"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    MapPin,
    Search,
    IndianRupee,
    Calendar,
    Users,
    Lightbulb,
    ArrowRight,
    Leaf,
    GraduationCap,
    HeartPulse,
    Globe,
    BookOpen,
    Building,
    Plus,
    FileText,
    School,
    ShieldCheck,
    Handshake,
    Lock,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useProposals } from "@/lib/proposals-context"

/* ─── Individual Proposal Data ─── */
// Utilizing global context instead of static array.

const categories = [
    "All Categories",
    "Literacy",
    "STEM",
    "Digital Education",
    "Higher Education",
    "Vocational",
]

/* ─── Blogs Data ─── */
const blogs = [
    {
        title: "Empowering Education: How CSR Funds Can Revolutionize the Learning Sector",
        author: "A School Principal",
        content: `In today's rapidly evolving world, education plays a pivotal role in shaping future generations. Unfortunately, many schools still lack access to the necessary resources for effective teaching and learning. Here’s how CSR funds can bridge this gap:
        
- Infrastructure Development: CSR funds can be used to build modern classrooms, libraries, and science labs in underprivileged schools.
- Teacher Training: Many teachers need further training on new teaching methods and technologies. CSR funding can help provide workshops and certification programs.
- Scholarships for Underprivileged Students: CSR funds can directly benefit students by providing scholarships, helping them attend schools they otherwise couldn’t afford.
- Technology Integration: Funding can be used to introduce smart classrooms, digital learning tools, and affordable tablets for students.

By channeling CSR funds into education, companies can foster future talent while creating a more equitable learning environment.`,
        icon: GraduationCap,
    },
    {
        title: "Digital Divide in Rural India: A Mission to Bridge the Gap",
        author: "An EdTech Expert",
        content: `While urban centers advance rapidly with high-speed internet and digital learning, rural students are often left behind. This digital divide is the new frontier of educational inequality.

- Infrastructure is Key: CSR can fund the installation of solar-powered computer labs in off-grid villages.
- Regional Language Content: Developing digital curriculum in local languages is essential for effective learning in rural contexts.
- Teacher as Facilitator: Moving from traditional lecturing to digital facilitation requires intensive training which CSR initiatives can support.
- Community Wi-Fi: Creating digital hubs in villages provides broader access to educational resources for students and parents alike.

Bridging the digital divide is not just about technology; it's about providing equal opportunity for every Indian child.`,
        icon: BookOpen,
    },
    {
        title: "The Importance of Foundation Literacy and Numeracy",
        author: "A Literacy Advocate",
        content: `Research consistently shows that if a child does not achieve foundational literacy and numeracy by grade 3, their future learning outcomes are severely compromised.

- Reading Rooms in Schools: Establishing bright, attractive libraries within government schools can ignite a love for reading early on.
- Play-Based Learning: Transitioning from rote memorization to activity-based learning in early years is critical.
- Parental Involvement: Educating parents on the importance of early literacy can create a supportive home environment for learning.
- Monitoring Progress: CSR-funded tracking systems can help teachers identify children falling behind and provide timely intervention.

Foundational learning is the bedrock of all future education. Helping a child read is giving them the key to the world.`,
        icon: School,
    },
    {
        title: "Vocational Skills: Preparing Youth for the Tomorrow's Workforce",
        author: "A Skill Development Trainer",
        content: `Traditional academic tracks aren't for everyone. Integrating vocational skills into the secondary school curriculum can drastically improve employability.

- Industry Partnerships: Schools partnering with companies to provide real-world training and internships.
- Modernizing ITIs: CSR funds can be used to upgrade tools and machinery in Industrial Training Institutes.
- Soft Skills Training: Literacy is not enough; youth need communication, teamwork, and problem-solving skills to succeed.
- Career Counseling: Helping students discover their strengths and aligning them with career paths in the growing Indian economy.

Empowering youth with practical skills is a direct way to drive economic growth and individual prosperity.`,
        icon: Building,
    }
]

export default function IndividualProposalsPage() {
    const { user } = useAuth()
    const { individualProposals } = useProposals()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All Categories")

    const filteredProposals = individualProposals.filter((p) => {
        const matchesSearch =
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "All Categories" || p.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero */}
                <section className="border-b border-border bg-background px-6 py-16 md:py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                                <Lightbulb className="h-5 w-5 text-accent" />
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Individual Proposals & Ideas</p>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                            <div>
                                <h1
                                    className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    Groundbreaking ideas from individuals
                                </h1>
                                <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                                    Discover innovative grassroots proposals and read inspiring insights directly from the people driving community change.
                                </p>
                            </div>

                            {user?.role === "beneficiary" && (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button size="lg" className="shadow-md" asChild>
                                        <Link href="/individual-proposals/create">
                                            <Plus className="mr-2 h-4 w-4" /> Create Proposal
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="shadow-sm" asChild>
                                        <Link href="/individual-proposals/create-blog">
                                            <FileText className="mr-2 h-4 w-4" /> Create Blog
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Proposals Grid */}
                <section className="bg-secondary/40 px-6 py-12 md:py-16 border-b border-border">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-8 flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                                Individual Proposals
                            </h2>
                        </div>

                        {/* Filters */}
                        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search proposals by creator, title, or keyword..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full sm:w-48 bg-background">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Proposal Cards */}
                        {user?.role === "ngo" ? (
                            /* ── NGO Access Lock ── */
                            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card/50 p-12 text-center md:p-20">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                                    <Lock className="h-10 w-10" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground md:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
                                    Individual Proposals Restricted
                                </h2>
                                <p className="mt-4 max-w-lg text-balance text-muted-foreground md:text-lg">
                                    Access to individual beneficiary proposals is reserved for Funders and Beneficiaries.
                                    As an NGO, you can create your own proposals or explore CSR projects.
                                </p>
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <Button asChild size="lg" className="shadow-lg transition-all hover:scale-105">
                                        <Link href="/ngo-proposal/create">Create NGO Proposal</Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg">
                                        <Link href="/csr-projects">Explore CSR Projects</Link>
                                    </Button>
                                </div>
                            </div>
                        ) : filteredProposals.length > 0 ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredProposals.map((p) => (
                                    <Card key={p.id} className="group border-border bg-card transition-all hover:shadow-lg">
                                        <CardContent className="flex flex-col gap-4 p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                                                    <p.icon className="h-5 w-5 text-accent" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 text-xs">
                                                        <ShieldCheck className="h-3 w-3" /> Verified
                                                    </Badge>
                                                    <Badge className={p.status === "Partially Funded" ? "bg-chart-3/10 text-chart-3 hover:bg-chart-3/10" : "bg-accent/10 text-accent hover:bg-accent/10"}>
                                                        {p.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-accent">{p.name}</p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <p className="text-xs text-muted-foreground">{p.category}</p>
                                                    <span className="text-muted-foreground/40">|</span>
                                                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MapPin className="h-3 w-3" /> {p.location}
                                                    </p>
                                                </div>
                                                <h3 className="mt-1 font-semibold text-foreground">{p.title}</h3>
                                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{p.description}</p>
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <span>Raised: {p.fundingRaised}</span>
                                                    <span>Need: {p.fundingRequired}</span>
                                                </div>
                                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                                                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${p.progress}%` }} />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> Deadline: {p.deadline}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" /> {p.beneficiaries.toLocaleString()} beneficiaries
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-2 border-t border-border pt-4">
                                                <Button asChild variant="outline" size="sm" className="w-full gap-1.5 hover:bg-accent hover:text-accent-foreground">
                                                    <Link href={`/individual-proposals/${p.id}`}>
                                                        View Idea Details <ArrowRight className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 py-16 text-center">
                                <Search className="h-12 w-12 text-muted-foreground/40" />
                                <p className="text-muted-foreground">No proposals match your search or filters.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Blogs Section */}
                <section className="bg-background px-6 py-12 md:py-16">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-10 text-center max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
                                Insights & Articles from Individuals
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Learn from experts, activists, and field workers about how and where funders can make the best impact.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            {blogs.map((blog, idx) => (
                                <Card key={idx} className="border-border bg-card overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
                                    <div className="p-1 bg-primary/10"></div>
                                    <CardHeader className="pb-4">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                            <blog.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
                                            {blog.title}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-2 font-medium text-foreground">
                                            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Author:</span>
                                            {blog.author}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col">
                                        <div className="prose prose-sm dark:prose-invert text-muted-foreground whitespace-pre-line leading-relaxed pb-4">
                                            {blog.content}
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-border flex justify-end">
                                            <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/10">
                                                <BookOpen className="h-4 w-4" /> Share Article
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
