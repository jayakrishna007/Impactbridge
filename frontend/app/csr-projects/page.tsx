"use client"

import Link from "next/link"
import { useState } from "react"
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
    FolderOpen,
    ArrowRight,
    BookOpen,
    School,
} from "lucide-react"

/* ─── CSR Project Data ─── */
// Utilizing global context instead of static array.

const categories = [
    "All Categories",
    "Digital Education",
    "Literacy",
    "Infrastructure",
    "Vocational",
    "Scholarships",
    "Primary Education",
    "Teacher Training",
]

const statuses = [
    "All Statuses",
    "Active",
    "Completed",
    "Pending",
    "Rejected",
]

export default function CSRProjectsPage() {
    const { user } = useAuth()
    const { csrProjects } = useProposals()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedLocation, setSelectedLocation] = useState("All Locations")
    const [selectedCategory, setSelectedCategory] = useState("All Categories")
    const [selectedStatus, setSelectedStatus] = useState("All Statuses")

    const filteredProjects = csrProjects.filter((p) => {
        const matchesSearch =
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.funder.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesLocation = selectedLocation === "All Locations" || p.location === selectedLocation
        const matchesCategory = selectedCategory === "All Categories" || p.category === selectedCategory
        const isStatusActive = p.status === "Active"
        return matchesSearch && matchesLocation && matchesCategory && isStatusActive
    })

    // Extract unique locations from csrProjects for filter buttons
    const uniqueLocations = ["All Locations", ...new Set(csrProjects.map(p => p.location))];

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero */}
                <section className="border-b border-border bg-background px-6 py-16 md:py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                <FolderOpen className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Active CSR Projects</p>
                        </div>
                        <h1
                            className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Explore running CSR projects
                        </h1>
                        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                            Browse active CSR initiatives across education and community development.
                            Track real-time progress of projects currently making an impact.
                        </p>
                    </div>
                </section>

                {/* Filters & Project Grid */}
                <section className="bg-secondary/40 px-6 py-12 md:py-16">
                    <div className="mx-auto max-w-7xl">
                        {/* Filters */}
                        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search active projects by name, funder, or keyword..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Location Filter Buttons */}
                        <div className="mb-8 flex flex-wrap items-center gap-2">
                            {uniqueLocations.map((loc) => (
                                <Button
                                    key={loc}
                                    variant={selectedLocation === loc ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedLocation(loc)}
                                    className="gap-1.5"
                                >
                                    <MapPin className="h-3.5 w-3.5" />
                                    {loc}
                                </Button>
                            ))}
                        </div>

                        {/* Results Count */}
                        <p className="mb-6 text-sm text-muted-foreground">
                            Showing <span className="font-semibold text-foreground">{filteredProjects.length}</span> active project{filteredProjects.length !== 1 ? "s" : ""}
                        </p>

                        {/* Project Cards */}
                        {filteredProjects.length > 0 ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredProjects.map((p) => (
                                    <Card key={p.id} className="group border-border bg-card transition-all hover:shadow-lg">
                                        <CardContent className="flex flex-col gap-4 p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                    <p.icon className="h-5 w-5 text-primary" />
                                                </div>
                                                <Badge className="bg-blue-600 text-white hover:bg-blue-700">Running</Badge>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs font-medium text-muted-foreground">{p.category}</p>
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
                                                    <span className="font-medium text-blue-600">Progress of Work</span>
                                                    <span>{p.progress}%</span>
                                                </div>
                                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                                                    <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${p.progress}%` }} />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> Deadline: {p.deadline}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" /> {p.beneficiaries} beneficiaries
                                                </span>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-border">
                                                <Button asChild variant="outline" size="sm" className="w-full gap-1.5 hover:bg-accent hover:text-accent-foreground">
                                                    <Link href={`/csr-projects/${p.id}`}>
                                                        View More <ArrowRight className="h-3 w-3" />
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
                                <p className="text-muted-foreground">No projects match your search or filters.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
