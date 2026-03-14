"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useProposals } from "@/lib/proposals-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    ArrowLeft, MapPin, Calendar, GraduationCap, Building, Target,
    BookOpen, Users, IndianRupee, Globe, Phone, User as LucideUser,
    ShieldCheck, CheckCircle2, ChevronRight, FileText, Eye, FolderOpen,
    Plus, Send,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { apiGetUser } from "@/lib/api"

export default function IndividualProposalDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const { individualProposals } = useProposals()
    const [beneficiaryUser, setBeneficiaryUser] = useState<any>(null)
    const [requestSent, setRequestSent] = useState(false)
    const [requestText, setRequestText] = useState("")

    const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : ""
    const proposal = individualProposals.find(p => p.id === id)

    useEffect(() => {
        async function fetchBeneficiaryUser() {
            if (!proposal) return
            try {
                if (proposal.createdBy) {
                    const fetched = await apiGetUser(proposal.createdBy)
                    if (fetched) { setBeneficiaryUser(fetched); return }
                }
            } catch { /* fall through to localStorage */ }
            const raw = localStorage.getItem("impactbridge_all_users")
            if (raw) {
                const all = JSON.parse(raw)
                const found = all.find((u: any) => u.name === proposal.name && u.role === "beneficiary")
                if (found) setBeneficiaryUser(found)
            }
        }
        fetchBeneficiaryUser()
    }, [proposal])

    if (!proposal) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex flex-1 items-center justify-center p-6 text-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">Proposal Not Found</h2>
                        <p className="text-muted-foreground mb-6">The proposal you are looking for does not exist or has been removed.</p>
                        <Button onClick={() => router.back()}>Back</Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const Icon = proposal.icon

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 bg-secondary/20 pb-16">
                {/* Hero Banner */}
                <div className="bg-primary/5 border-b border-border pt-12 pb-8 px-6">
                    <div className="mx-auto max-w-4xl">
                        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
                            onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>

                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1.5 px-3 py-1 text-xs font-semibold">
                                <ShieldCheck className="h-3.5 w-3.5" /> Platform Verified
                            </Badge>
                            <Badge className={proposal.status === "Partially Funded"
                                ? "bg-chart-3/10 text-chart-3 hover:bg-chart-3/10"
                                : "bg-accent/10 text-accent hover:bg-accent/10"}>
                                {proposal.status}
                            </Badge>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-3"
                            style={{ fontFamily: "var(--font-heading)" }}>
                            {proposal.title}
                        </h1>
                        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">{proposal.description}</p>

                        <div className="flex flex-wrap gap-4 mt-5 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{proposal.location}</span>
                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />Deadline: {proposal.deadline}</span>
                            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" />{proposal.beneficiaries.toLocaleString()} Beneficiaries</span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="mx-auto max-w-4xl px-6 mt-10">
                    <div className="grid gap-8 lg:grid-cols-3">

                        {/* ── Main Column ── */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Project Overview */}
                            <Card className="shadow-sm">
                                <CardHeader><CardTitle>Project Overview</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold uppercase text-muted-foreground mb-2">About the Proposal</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{proposal.description}</p>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <IndianRupee className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">Funding Goal</p>
                                                <p className="text-sm text-muted-foreground">{proposal.fundingRequired}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <Target className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">Category</p>
                                                <p className="text-sm text-muted-foreground">{proposal.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <Users className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{proposal.beneficiaries} Beneficiaries</p>
                                                <p className="text-sm text-muted-foreground">Direct community impact</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <Calendar className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">Timeline</p>
                                                <p className="text-sm text-muted-foreground">Target: {proposal.deadline}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>


                        </div>

                        {/* ── Sidebar ── */}
                        <div className="space-y-6">

                            {/* Funding Status Card */}
                            <Card className="shadow-sm">
                                <CardHeader><CardTitle>Funding Status</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Goal</span>
                                        <span className="font-semibold text-foreground">{proposal.fundingRequired}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Raised</span>
                                        <span className="font-semibold text-green-600">{proposal.fundingRaised}</span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-secondary mb-2">
                                        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${proposal.progress}%` }} />
                                    </div>
                                    <p className="text-xs text-right text-muted-foreground mb-2">{proposal.progress}% funded</p>

                                    {user?.role === "funder" ? (
                                        <Button asChild className="w-full font-bold h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform hover:scale-105">
                                            <Link href={`/partnership/individual/${proposal.id}`}>
                                                Fund Proposal
                                            </Link>
                                        </Button>
                                    ) : (
                                        <div className="text-center p-3 bg-secondary/50 rounded-md border border-border">
                                            <p className="text-sm text-muted-foreground">Log in as a Funder to contribute to this proposal.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Beneficiary Info */}
                            <Card className="shadow-sm">
                                <CardHeader><CardTitle>Beneficiary Info</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary">
                                            <LucideUser className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{proposal.name}</p>
                                            <p className="text-xs text-muted-foreground">Verified Beneficiary</p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full">View Beneficiary Profile</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-bold">{proposal.name}</DialogTitle>
                                                    <DialogDescription>Official Beneficiary Profile &amp; Portfolio</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-6 py-4">
                                                    {beneficiaryUser?.portfolio ? (
                                                        <>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <h4 className="text-sm font-bold uppercase text-muted-foreground mb-1">About</h4>
                                                                    <p className="text-sm leading-relaxed">{beneficiaryUser.portfolio.about}</p>
                                                                </div>
                                                                <div className="border-t pt-4 space-y-3">
                                                                    <h4 className="text-sm font-bold uppercase text-muted-foreground">Contact</h4>
                                                                    <div className="grid gap-2">
                                                                        <div className="flex items-center gap-2 text-sm">
                                                                            <Globe className="h-4 w-4 text-primary" />
                                                                            <a href={beneficiaryUser.portfolio.contact?.website} target="_blank" className="text-blue-600 hover:underline">
                                                                                {beneficiaryUser.portfolio.contact?.website || "Not provided"}
                                                                            </a>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-sm">
                                                                            <Phone className="h-4 w-4 text-primary" />
                                                                            <span>{beneficiaryUser.portfolio.contact?.phone || "Not provided"}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* Fund Proposal after viewing */}
                                                            {user?.role === "funder" && (
                                                                <Button asChild className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white">
                                                                    <Link href={`/partnership/individual/${proposal.id}`}>
                                                                        Fund Proposal
                                                                    </Link>
                                                                </Button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <LucideUser className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                                                            <p className="text-muted-foreground">Profile information is being verified.</p>
                                                            {user?.role === "funder" && (
                                                                <Button asChild className="mt-4 font-bold bg-blue-600 hover:bg-blue-700 text-white">
                                                                    <Link href={`/partnership/individual/${proposal.id}`}>Fund Proposal</Link>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
