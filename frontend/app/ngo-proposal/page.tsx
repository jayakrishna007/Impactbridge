"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useProposals } from "@/lib/proposals-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
    GraduationCap,
    HeartPulse,
    Landmark,
    Building,
    Users,
    MapPin,
    Search,
    IndianRupee,
    Calendar,
    FileText,
    ArrowRight,
    Handshake,
    Globe,
    Plus,
    Leaf,
    Lock,
    BookOpen,
    ShieldCheck,
} from "lucide-react"

/* ─── NGO Proposal Data ─── */
// Utilizing global context instead of static array.

const locations = [
    "All Locations",
    "Rajasthan",
    "Madhya Pradesh",
    "Karnataka",
    "Gujarat",
    "Maharashtra",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Pan India",
]

const categories = [
    "All Categories",
    "Primary Education",
    "Teacher Training",
    "School Infrastructure",
    "Skill Development",
    "Support Services",
    "Higher Education",
    "Curriculum Design",
]

/* ─── Utilities ─── */
const parseBudget = (value: string) => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ""))
    if (value.toLowerCase().includes("cr")) return num * 10000000
    if (value.toLowerCase().includes("l")) return num * 100000
    return num
}

export default function NGOProposalPage() {
    const { user } = useAuth()
    const { ngoProposals } = useProposals()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedLocation, setSelectedLocation] = useState("All Locations")
    const [selectedCategory, setSelectedCategory] = useState("All Categories")
    const [sortBy, setSortBy] = useState("none")

    const filteredAndSortedProposals = ngoProposals
        .filter((p) => {
            const matchesSearch =
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.ngoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesLocation = selectedLocation === "All Locations" || p.location === selectedLocation
            const matchesCategory = selectedCategory === "All Categories" || p.category === selectedCategory
            return matchesSearch && matchesLocation && matchesCategory
        })
        .sort((a, b) => {
            if (sortBy === "none") return 0
            const budgetA = parseBudget(a.fundingRequired)
            const budgetB = parseBudget(b.fundingRequired)
            return sortBy === "budget-asc" ? budgetA - budgetB : budgetB - budgetA
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
                                <FileText className="h-5 w-5 text-accent" />
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-accent">NGO Proposals</p>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                            <div>
                                <h1
                                    className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    NGO proposals looking for funding
                                </h1>
                                <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                                    Discover vetted proposals from NGOs across India seeking CSR funding.
                                    Review their impact plans, funding requirements, and connect directly to fund their initiatives.
                                </p>
                            </div>

                            {user?.role === "ngo" && (
                                <div className="shrink-0">
                                    <Button asChild size="lg" className="w-full md:w-auto shadow-sm transition-all hover:scale-105 active:scale-95">
                                        <Link href="/ngo-proposal/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create a Proposal
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Filters & Proposal Grid */}
                <section className="bg-secondary/40 px-6 py-12 md:py-16">
                    <div className="mx-auto max-w-7xl">
                        {/* Filters */}
                        <div className="mb-8 grid gap-4 md:grid-cols-4 lg:grid-cols-5">
                            <div className="relative md:col-span-2 lg:col-span-2">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search proposals by NGO name, title, or keyword..."
                                    className="pl-10 h-11"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="All Regions" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((loc) => (
                                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Sort by Budget" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Standard Sort</SelectItem>
                                    <SelectItem value="budget-asc">Budget: Low to High</SelectItem>
                                    <SelectItem value="budget-desc">Budget: High to Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Results Count */}
                        <p className="mb-6 text-sm text-muted-foreground">
                            Showing <span className="font-semibold text-foreground">{filteredAndSortedProposals.length}</span> proposal{filteredAndSortedProposals.length !== 1 ? "s" : ""}
                        </p>

                        {/* Proposal Cards & Access Control */}
                        {user?.role === "beneficiary" ? (
                            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card/50 p-12 text-center md:p-20">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                                    <Lock className="h-10 w-10" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground md:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
                                    NGO Proposals Restricted
                                </h2>
                                <p className="mt-4 max-w-lg text-balance text-muted-foreground md:text-lg">
                                    Access to detailed NGO proposals is reserved for Funders and NGOs.
                                    As a beneficiary, you can explore available CSR projects and connect with implementers.
                                </p>
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <Button asChild size="lg" className="shadow-lg transition-all hover:scale-105">
                                        <Link href="/how-it-works">Learn About Funding</Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg">
                                        <Link href="/">Back to Home</Link>
                                    </Button>
                                </div>
                            </div>
                        ) : filteredAndSortedProposals.length > 0 ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredAndSortedProposals.map((p) => (
                                    <Card key={p.title} className="group border-border bg-card transition-all hover:shadow-lg">
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
                                                <p className="text-xs font-medium text-accent">{p.ngoName}</p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <p className="text-xs text-muted-foreground">{p.category}</p>
                                                    <span className="text-muted-foreground/40">|</span>
                                                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MapPin className="h-3 w-3" /> {p.location}
                                                    </p>
                                                </div>
                                                <h3 className="mt-1 font-semibold text-foreground line-clamp-1">{p.title}</h3>
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
                                                    <Link href={`/ngo-proposal/${p.id}`}>
                                                        View Proposal Details <ArrowRight className="h-3 w-3" />
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
            </main>
            <Footer />
        </div>
    )
}
