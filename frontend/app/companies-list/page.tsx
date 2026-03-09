"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Building2, Globe, Filter } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

/* ─── Mock Data ─── */

const allCompanies = [
    // NGOs
    { id: 1, name: "Akshaya Patra", type: "ngo", sector: "Education", region: "National", location: "Bengaluru, Karnataka", impact: "2M+ Students", rating: 4.8 },
    { id: 2, name: "Smile Foundation", type: "ngo", sector: "Healthcare", region: "National", location: "New Delhi", impact: "1.5M+ Beneficiaries", rating: 4.7 },
    { id: 3, name: "Pratham", type: "ngo", sector: "Education", region: "National", location: "Mumbai, Maharashtra", impact: "1M+ Students", rating: 4.9 },
    { id: 4, name: "Care India", type: "ngo", sector: "Healthcare", region: "North", location: "Gurugram, Haryana", impact: "500k+ Women", rating: 4.6 },
    { id: 5, name: "Goonj", type: "ngo", sector: "Social Welfare", region: "National", location: "New Delhi", impact: "Disaster Relief", rating: 4.8 },
    { id: 6, name: "Helpage India", type: "ngo", sector: "Elderly Care", region: "South", location: "Chennai, Tamil Nadu", impact: "200k+ Elderly", rating: 4.5 },
    { id: 7, name: "CRY", type: "ngo", sector: "Child Rights", region: "National", location: "Mumbai, Maharashtra", impact: "3M+ Children", rating: 4.7 },
    { id: 8, name: "Nanhi Kali", type: "ngo", sector: "Education", region: "West", location: "Mumbai, Maharashtra", impact: "450k+ Girls", rating: 4.9 },
    { id: 9, name: "Teach For India", type: "ngo", sector: "Education", region: "National", location: "Pune, Maharashtra", impact: "32k+ Students", rating: 4.8 },
    { id: 10, name: "GiveIndia", type: "ngo", sector: "Social Welfare", region: "National", location: "Bengaluru, Karnataka", impact: "Donation Platform", rating: 4.6 },

    // PSUs / CSR Companies
    { id: 11, name: "ONGC", type: "csr", sector: "Energy", region: "National", location: "New Delhi", impact: "₹500 Cr+ Spent", rating: 4.7 },
    { id: 12, name: "NTPC", type: "csr", sector: "Energy", region: "National", location: "New Delhi", impact: "₹300 Cr+ Spent", rating: 4.6 },
    { id: 13, name: "Indian Oil", type: "csr", sector: "Energy", region: "National", location: "New Delhi", impact: "₹450 Cr+ Spent", rating: 4.8 },
    { id: 14, name: "Coal India", type: "csr", sector: "Mining", region: "East", location: "Kolkata, WB", impact: "₹250 Cr+ Spent", rating: 4.5 },
    { id: 15, name: "SBI", type: "csr", sector: "Banking", region: "National", location: "Mumbai, Maharashtra", impact: "₹200 Cr+ Spent", rating: 4.9 },
    { id: 16, name: "GAIL", type: "csr", sector: "Energy", region: "National", location: "New Delhi", impact: "₹150 Cr+ Spent", rating: 4.7 },
    { id: 17, name: "BHEL", type: "csr", sector: "Manufacturing", region: "National", location: "New Delhi", impact: "₹100 Cr+ Spent", rating: 4.4 },
    { id: 18, name: "BPCL", type: "csr", sector: "Energy", region: "National", location: "Mumbai, Maharashtra", impact: "₹180 Cr+ Spent", rating: 4.6 },
    { id: 19, name: "HPCL", type: "csr", sector: "Energy", region: "National", location: "Mumbai, Maharashtra", impact: "₹170 Cr+ Spent", rating: 4.5 },
    { id: 20, name: "Power Grid", type: "csr", sector: "Energy", region: "National", location: "Gurugram, Haryana", impact: "₹140 Cr+ Spent", rating: 4.7 },
]

export default function CompaniesListPage() {
    const searchParams = useSearchParams()
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all")
    const [sectorFilter, setSectorFilter] = useState("all")
    const [regionFilter, setRegionFilter] = useState("all")

    useEffect(() => {
        const type = searchParams.get("type")
        if (type) setTypeFilter(type)
    }, [searchParams])

    const filteredCompanies = allCompanies.filter((company) => {
        const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = typeFilter === "all" || company.type === typeFilter
        const matchesSector = sectorFilter === "all" || company.sector === sectorFilter
        const matchesRegion = regionFilter === "all" || company.region === regionFilter
        return matchesSearch && matchesType && matchesSector && matchesRegion
    })

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 bg-secondary/30 pb-20 pt-12 px-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
                            {typeFilter === "ngo" ? "NGO Companies List" : typeFilter === "csr" ? "CSR funding list" : "Companies List"}
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Explore organizations by sector, region, and impact footprint.
                        </p>
                    </div>

                    {/* Filters */}
                    <Card className="mb-8 border-border bg-card shadow-sm">
                        <CardContent className="p-6">
                            <div className="grid gap-6 md:grid-cols-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search companies..."
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Company Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="ngo">NGOs</SelectItem>
                                        <SelectItem value="csr">PSU / CSR Companies</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sector" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Sectors</SelectItem>
                                        <SelectItem value="Education">Education</SelectItem>
                                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                                        <SelectItem value="Energy">Energy</SelectItem>
                                        <SelectItem value="Social Welfare">Social Welfare</SelectItem>
                                        <SelectItem value="Banking">Banking</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={regionFilter} onValueChange={setRegionFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Regions</SelectItem>
                                        <SelectItem value="National">National</SelectItem>
                                        <SelectItem value="North">North India</SelectItem>
                                        <SelectItem value="South">South India</SelectItem>
                                        <SelectItem value="East">East India</SelectItem>
                                        <SelectItem value="West">West India</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredCompanies.length > 0 ? (
                            filteredCompanies.map((company) => (
                                <Card key={company.id} className="group border-border bg-card transition-all hover:shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <Building2 className="h-6 w-6" />
                                            </div>
                                            <Badge variant="outline" className="capitalize">
                                                {company.type}
                                            </Badge>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                                            {company.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <Globe className="h-3.5 w-3.5" /> {company.sector}
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5" /> {company.location}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Impact Focal Point:</span>
                                                <span className="font-semibold text-foreground">{company.impact}</span>
                                            </div>
                                        </div>

                                        <Button variant="outline" className="w-full gap-2">
                                            View Profile
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                <div className="rounded-full bg-secondary p-6 mb-4">
                                    <Filter className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">No companies found</h3>
                                <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
                                <Button variant="link" onClick={() => { setSearchTerm(""); setTypeFilter("all"); setSectorFilter("all"); setRegionFilter("all"); }}>
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
