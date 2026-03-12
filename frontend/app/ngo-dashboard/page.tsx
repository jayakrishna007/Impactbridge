"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useProposals } from "@/lib/proposals-context"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Building2,
    ClipboardList,
    FileText,
    Plus,
    Upload,
    IndianRupee,
    Users,
    Calendar,
    CheckCircle2,
    Clock,
    AlertTriangle,
    AlertCircle,
    BarChart3,
    Briefcase,
    Star,
    Award,
    Globe,
    ExternalLink,
    MapPin,
    Search,
    Loader2,
    Phone,
    Handshake,
    ArrowRight,
    Bell,
} from "lucide-react"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { apiGetPartnershipsForUser, apiPartnerConfirm, type PartnershipData } from "@/lib/api"

/* ─── Data ─── */

function ReportStatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Submitted: "bg-chart-3/10 text-chart-3 hover:bg-chart-3/10",
        "Under Review": "bg-accent/10 text-accent hover:bg-accent/10",
        Approved: "bg-primary/10 text-primary hover:bg-primary/10",
        "Revision Needed": "bg-destructive/10 text-destructive hover:bg-destructive/10",
    }
    const icons: Record<string, React.ReactNode> = {
        Submitted: <CheckCircle2 className="mr-1 h-3 w-3" />,
        "Under Review": <Clock className="mr-1 h-3 w-3" />,
        Approved: <CheckCircle2 className="mr-1 h-3 w-3" />,
        "Revision Needed": <AlertTriangle className="mr-1 h-3 w-3" />,
    }
    return (
        <Badge className={styles[status] || ""}>
            {icons[status]}
            {status}
        </Badge>
    )
}

export default function NGODashboardPage() {
    const { user, isLoading } = useAuth()
    const { ngoProposals } = useProposals()
    const router = useRouter()
    const [isSubmittingReport, setIsSubmittingReport] = useState(false)
    const [selectedProjectForReport, setSelectedProjectForReport] = useState<string | null>(null)
    const [selectedReportType, setSelectedReportType] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const [partnerships, setPartnerships] = useState<PartnershipData[]>([])
    const [partnershipsLoading, setPartnershipsLoading] = useState(false)
    const [acceptingId, setAcceptingId] = useState<string | null>(null)
    const [selectedTab, setSelectedTab] = useState("projects")

    // Filter proposals belonging to the logged-in NGO user - primary check is email
    const managedProjects = ngoProposals.filter(
        p => user && user.email && p.createdBy === user.email
    )

    const [reports, setReports] = useState<any[]>([])
    const [portfolioProjects, setPortfolioProjects] = useState<any[]>([])
    const [partnershipsError, setPartnershipsError] = useState<string | null>(null)
    const [acceptError, setAcceptError] = useState<string | null>(null)

    // Load incoming partnership requests
    useEffect(() => {
        if (!user?.email) return
        setPartnershipsLoading(true)
        setPartnershipsError(null)
        apiGetPartnershipsForUser(user.email)
            .then(setPartnerships)
            .catch((error) => {
                console.error("Failed to load partnerships:", error)
                setPartnershipsError(error?.message || "Failed to load partnerships")
            })
            .finally(() => setPartnershipsLoading(false))
    }, [user?.email])

    const pendingPartnerships = partnerships.filter(p => !p.partnerConfirmed)
    const activePartnerships = partnerships.filter(p => p.partnerConfirmed && p.funderConfirmed)

    async function handleAccept(partnershipId: string) {
        setAcceptingId(partnershipId)
        setAcceptError(null)
        try {
            const updated = await apiPartnerConfirm(partnershipId)
            setPartnerships(prev => prev.map(p => p.id === partnershipId ? updated : p))
        } catch (error: any) {
            const errorMsg = error?.message || "Failed to accept partnership"
            console.error("Partnership acceptance error:", error)
            setAcceptError(errorMsg)
            setTimeout(() => setAcceptError(null), 4000)
        }
        finally { setAcceptingId(null) }
    }

    useEffect(() => {
        if (!isLoading && user) {
            if (!user.hasProfile) {
                router.push("/profile/setup")
            }
        }
    }, [user, isLoading, router])

    if (isLoading) return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )

    if (!user || user.role !== "ngo") {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex flex-1 items-center justify-center px-6">
                    <div className="text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                        <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>Access Denied</h1>
                        <p className="text-muted-foreground mb-6">You must be logged in as an NGO to view this page.</p>
                        <Button asChild>
                            <Link href="/login">Return to Login</Link>
                        </Button>
                    </div>
                </main>
            </div>
        )
    }

    const portfolio = user.portfolio || {}

    const handleReportSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmittingReport(true)
        setTimeout(() => {
            const typeLabel = selectedReportType === "monthly" ? "Monthly Progress"
                : selectedReportType === "quarterly" ? "Quarterly Impact"
                    : "Annual Financial & Impact Audit"
            const newReport = {
                id: `RPT-${Date.now().toString().slice(-6)}`,
                project: selectedProjectForReport || "Unknown Project",
                type: typeLabel,
                date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
                status: "Submitted",
            }
            setReports(prev => [newReport, ...prev])
            setIsSubmittingReport(false)
            setIsSuccess(true)
            setTimeout(() => setIsSuccess(false), 3000)
        }, 1500)
    }



    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero */}
                <section className="border-b border-border bg-background px-6 py-16 md:py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/10">
                                <Building2 className="h-5 w-5 text-chart-3" />
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-chart-3">NGO Portal</p>
                        </div>
                        <h1
                            className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Manage projects and deliver impact
                        </h1>
                        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                            Create CSR projects, manage funds, submit reports, build your organization portfolio, and collaborate with funders and beneficiaries.
                        </p>
                    </div>
                </section>

                {/* Dashboard */}
                <section className="bg-secondary/40 px-6 py-12 md:py-16">
                    <div className="mx-auto max-w-7xl">
                        {/* Summary */}
                        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { title: "Active Projects", value: String(managedProjects.length), icon: ClipboardList },
                                { title: "Active Partnerships", value: String(activePartnerships.length), icon: IndianRupee },
                                { title: "Beneficiaries Served", value: String(managedProjects.reduce((s, p) => s + (p.beneficiaries || 0), 0)), icon: Users },
                                { title: "Reports Submitted", value: String(reports.length), icon: FileText },
                            ].map((card) => (
                                <Card key={card.title} className="border-border bg-card">
                                    <CardContent className="flex items-start justify-between p-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground">{card.title}</span>
                                            <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{card.value}</span>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                                            <card.icon className="h-5 w-5 text-chart-3" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="gap-8 flex flex-col">
                            <TabsList className="w-full justify-start bg-card border border-border h-auto flex-wrap gap-1 p-1">
                                <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    <ClipboardList className="h-4 w-4" /> My Projects
                                </TabsTrigger>
                                <TabsTrigger value="partnerships" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
                                    <Handshake className="h-4 w-4" /> Partnership Requests
                                    {pendingPartnerships.length > 0 && (
                                        <span className="ml-1 h-5 min-w-[20px] rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center px-1">
                                            {pendingPartnerships.length}
                                        </span>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="portfolio" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    <Briefcase className="h-4 w-4" /> Portfolio
                                </TabsTrigger>
                                <TabsTrigger value="reports" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    <FileText className="h-4 w-4" /> Reports
                                </TabsTrigger>
                                <TabsTrigger value="create" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    <Plus className="h-4 w-4" /> Create Project
                                </TabsTrigger>
                            </TabsList>

                            {/* ── My Projects ── */}
                            <TabsContent value="projects" className="flex flex-col gap-6">
                                {managedProjects.length > 0 ? managedProjects.map((project) => (
                                    <Card key={project.id} className="border-border bg-card hover:shadow-md transition-shadow">
                                        <CardContent className="flex flex-col gap-4 p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-foreground text-lg">{project.title}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                                                </div>
                                                <Badge className="bg-primary/10 text-primary hover:bg-primary/10 shrink-0 ml-4">{project.status}</Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{project.location}</span>
                                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Deadline: {project.deadline}</span>
                                                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{project.beneficiaries} beneficiaries</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Funding: <strong className="text-foreground">{project.fundingRaised}</strong> / {project.fundingRequired}</span>
                                                <span className="text-primary font-medium">{project.progress}% progress</span>
                                            </div>
                                            <div className="flex gap-2 pt-1">
                                                <Button size="sm" variant="outline" className="gap-1.5" asChild>
                                                    <Link href={`/ngo-proposal/${project.id}`}>
                                                        <ExternalLink className="h-3.5 w-3.5" /> View Proposal
                                                    </Link>
                                                </Button>
                                                <Button size="sm" variant="outline" className="gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
                                                    onClick={() => setSelectedTab("partnerships")}>
                                                    <Handshake className="h-3.5 w-3.5" /> Partnership Requests
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <Card className="border-dashed border-2 bg-transparent p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <ClipboardList className="h-12 w-12 text-muted-foreground/30" />
                                            <p className="text-muted-foreground italic">You don't have any active projects yet.</p>
                                            <Button variant="outline" size="sm" asChild><Link href="/ngo-proposal/create">Start your first proposal</Link></Button>
                                        </div>
                                    </Card>
                                )}
                            </TabsContent>

                            {/* ── Partnership Requests ── */}
                            <TabsContent value="partnerships" className="flex flex-col gap-6">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Partnership Requests</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Funders who expressed interest in your proposals. Review and accept to activate the partnership.</p>
                                </div>

                                {partnershipsLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : partnerships.length === 0 ? (
                                    <Card className="border-dashed border-2 bg-transparent p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Handshake className="h-12 w-12 text-muted-foreground/30" />
                                            <p className="font-medium text-muted-foreground">No partnership requests yet</p>
                                            <p className="text-sm text-muted-foreground/70">When funders express interest in your proposals, they'll appear here.</p>
                                        </div>
                                    </Card>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingPartnerships.length > 0 && (
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1.5">
                                                    <Bell className="h-3.5 w-3.5" /> Pending — Action Required ({pendingPartnerships.length})
                                                </p>
                                                <div className="space-y-3">
                                                    {pendingPartnerships.map(p => (
                                                        <Card key={p.id} className="border-amber-200 bg-amber-50/40">
                                                            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                                                                    <Handshake className="h-6 w-6 text-amber-600" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-semibold text-foreground">{p.funderName}</p>
                                                                    <p className="text-sm text-muted-foreground mt-0.5">Interested in: <span className="font-medium text-foreground">{p.proposalTitle}</span></p>
                                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">
                                                                            {p.funderConfirmed ? "✓ Funder Confirmed" : "Pending Funder"}
                                                                        </Badge>
                                                                        <Badge className="bg-secondary text-muted-foreground hover:bg-secondary text-xs">
                                                                            Your acceptance needed
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2 shrink-0">
                                                                    <Button size="sm" variant="outline" asChild>
                                                                        <Link href={`/partnership/${p.proposalType}/${p.proposalId}?funderEmail=${encodeURIComponent(p.funderEmail)}`}>
                                                                            View Details
                                                                        </Link>
                                                                    </Button>
                                                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                                                                        disabled={acceptingId === p.id}
                                                                        onClick={() => handleAccept(p.id)}>
                                                                        {acceptingId === p.id
                                                                            ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Accepting…</>
                                                                            : <><CheckCircle2 className="h-3.5 w-3.5" /> Accept</>}
                                                                    </Button>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activePartnerships.length > 0 && (
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-1.5">
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Active Partnerships ({activePartnerships.length})
                                                </p>
                                                <div className="space-y-3">
                                                    {activePartnerships.map(p => (
                                                        <Card key={p.id} className="border-emerald-200 bg-emerald-50/30">
                                                            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                                                                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-semibold text-foreground">{p.funderName}</p>
                                                                    <p className="text-sm text-muted-foreground mt-0.5">Project: <span className="font-medium text-foreground">{p.proposalTitle}</span></p>
                                                                    <Badge className="mt-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">🎉 Partnership Active</Badge>
                                                                </div>
                                                                <Button size="sm" variant="outline" className="shrink-0 gap-1.5" asChild>
                                                                    <Link href={`/partnership/${p.proposalType}/${p.proposalId}?funderEmail=${encodeURIComponent(p.funderEmail)}`}>
                                                                        <ArrowRight className="h-3.5 w-3.5" /> Open Partnership
                                                                    </Link>
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </TabsContent>



                            {/* ── Portfolio ── */}
                            <TabsContent value="portfolio" className="flex flex-col gap-6">
                                <div className="mb-2">
                                    <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Organization Portfolio</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">Showcase your track record of completed and active CSR projects.</p>
                                </div>

                                <div className="grid gap-8 md:grid-cols-2">
                                    <Card className="border-border bg-card">
                                        <CardHeader>
                                            <CardTitle className="text-lg">About & Mission</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <h5 className="text-xs font-bold uppercase text-muted-foreground">About</h5>
                                                <p className="mt-1 text-sm text-foreground">{portfolio.about || "No information provided yet."}</p>
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-bold uppercase text-muted-foreground">Mission</h5>
                                                <p className="mt-1 text-sm text-foreground">{portfolio.mission || "No information provided yet."}</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border bg-card">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Contact & Stats</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{portfolio.contact?.address || "Address not provided"}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{portfolio.contact?.phone || "Phone not provided"}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{portfolio.contact?.website || "Website not set"}</span>
                                            </div>
                                            <div className="pt-2">
                                                <Badge variant="outline" className="text-xs py-1 px-2 border-primary/30 text-primary">
                                                    {portfolio.experience || "New Partner"}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Portfolio Projects (Empty for now) */}
                                <div className="mt-4">
                                    <h4 className="text-md font-semibold mb-4">Completed Projects</h4>
                                    {portfolioProjects.length > 0 ? portfolioProjects.map((item) => (
                                        <Card key={item.title} className="border-border bg-card mb-4">
                                            <CardContent className="flex flex-col gap-4 p-6">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Client: {item.client} -- {item.year}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={item.status === "Active" ? "bg-primary/10 text-primary hover:bg-primary/10" : "bg-chart-3/10 text-chart-3 hover:bg-chart-3/10"}>
                                                            {item.status}
                                                        </Badge>
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Star className="h-3.5 w-3.5 fill-chart-4 text-chart-4" />
                                                            <span className="font-medium text-foreground">{item.rating}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {item.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Award className="h-3 w-3" /> {item.impact}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.categories.map((cat: string) => (
                                                        <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                                                    ))}
                                                </div>
                                                <Button variant="outline" size="sm" className="gap-1.5 self-start">
                                                    <ExternalLink className="h-3 w-3" /> View Details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )) : (
                                        <div className="p-12 border-2 border-dashed rounded-lg text-center text-muted-foreground text-sm">
                                            No past projects in your portfolio yet.
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* ── Reports ── */}
                            <TabsContent value="reports" className="flex flex-col gap-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Report Submissions</h3>
                                        <p className="text-sm text-muted-foreground">Track your monthly, quarterly, and annual report status.</p>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="gap-2">
                                                <Upload className="h-4 w-4" /> Submit New Report
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[500px]">
                                            <DialogHeader>
                                                <DialogTitle>Submit New Report</DialogTitle>
                                                <DialogDescription>
                                                    Select a project and upload your report.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleReportSubmit} className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="project-select">Project</Label>
                                                    <Select required onValueChange={setSelectedProjectForReport}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a project" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {managedProjects.map(p => (
                                                                <SelectItem key={p.id} value={p.title}>{p.title}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="report-type-alt">Report Type</Label>
                                                    <Select required onValueChange={setSelectedReportType}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select report frequency" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="monthly">Monthly Progress Report</SelectItem>
                                                            <SelectItem value="quarterly">Quarterly Impact Report</SelectItem>
                                                            <SelectItem value="annual">Annual Financial &amp; Impact Audit</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="summary-alt">Executive Summary</Label>
                                                    <Textarea id="summary-alt" placeholder="Briefly summarize the key achievements..." required />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="file-alt">Report Document</Label>
                                                    <Input id="file-alt" type="file" required />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" disabled={isSubmittingReport}>
                                                        {isSubmittingReport ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Submitting...
                                                            </>
                                                        ) : "Submit Report"}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <Card className="border-border bg-card">
                                    <CardHeader>
                                        <CardTitle className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>Submitted Reports</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-border text-left text-muted-foreground">
                                                        <th className="pb-3 pr-4 font-medium">Report ID</th>
                                                        <th className="pb-3 pr-4 font-medium">Project</th>
                                                        <th className="pb-3 pr-4 font-medium">Type</th>
                                                        <th className="pb-3 pr-4 font-medium">Date</th>
                                                        <th className="pb-3 font-medium">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {reports.map((report) => (
                                                        <tr key={report.id} className="border-b border-border last:border-0">
                                                            <td className="py-4 pr-4 font-mono text-xs text-foreground">{report.id}</td>
                                                            <td className="py-4 pr-4 text-foreground">{report.project}</td>
                                                            <td className="py-4 pr-4 text-muted-foreground">{report.type}</td>
                                                            <td className="py-4 pr-4 text-muted-foreground">{report.date}</td>
                                                            <td className="py-4"><ReportStatusBadge status={report.status} /></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ── Create Project ── */}
                            <TabsContent value="create" className="flex flex-col gap-6">
                                <Card className="border-border bg-card">
                                    <CardHeader>
                                        <CardTitle className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>Create New Education Project Proposal</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-6 items-center justify-center py-12 text-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-2">
                                            <FileText className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                                                Ready to launch your next initiative?
                                            </h3>
                                            <p className="text-muted-foreground max-w-md mx-auto">
                                                Use our comprehensive 4-step wizard to outline your project details, objectives, and funding requirements to attract CSR partners.
                                            </p>
                                        </div>
                                        <Button asChild className="gap-2 mt-4" size="lg">
                                            <Link href="/ngo-proposal/create">
                                                <Plus className="h-4 w-4" /> Start New Proposal
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
                {isSuccess && (
                    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
                        <Card className="border-primary/50 bg-primary/10 px-6 py-4 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <p className="text-sm font-medium text-primary">Report submitted successfully!</p>
                            </div>
                        </Card>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}
