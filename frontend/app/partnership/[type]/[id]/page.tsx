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
    ArrowLeft, ShieldCheck, CalendarDays, FileSearch, PenLine, BarChart3,
    CheckCircle2, ChevronRight, FileText, Send, Eye, FolderOpen, Plus,
    Users, IndianRupee, Calendar, Handshake, Lock, Unlock, AlertCircle,
    Clock, Sparkles, Bell,
} from "lucide-react"
import { useState, useEffect } from "react"
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { apiCreatePartnership, apiFunderConfirm, apiPartnerConfirm } from "@/lib/api"
import { ActiveDashboard } from "@/components/partnership/ActiveDashboard"
import { MouSigning } from "@/components/partnership/MouSigning"

/* ─── Document lists ─── */
const NGO_DOCS = [
    { name: "Legal Documents", sub: "PAN, Trust Deed, Registration Certificate" },
    { name: "Audited Accounts", sub: "Financial statements — past 3 years" },
    { name: "Compliance Proofs", sub: "GST, FCRA, Tax Exemption" },
    { name: "Board Members List", sub: "List of Trustees / Board of Governors" },
    { name: "Existing MOUs / Impact Reports", sub: "Past partnerships & impact data" },
]
const IND_DOCS = [
    { name: "Identity Proof", sub: "Aadhaar, PAN Card, or Voter ID" },
    { name: "Address Proof", sub: "Utility bill or government-issued certificate" },
    { name: "Community Validation Letter", sub: "Signed by local authority" },
    { name: "Project Budget Plan", sub: "Detailed fund utilization breakdown" },
    { name: "Reference / Recommendation Letter", sub: "From teacher or community leader" },
]
const NGO_QUICK_TAGS = ["Bank Statements (6 months)", "Project Site Photos", "12A / 80G Certificate", "Beneficiary List", "FCRA Certificate", "MOU with Govt."]
const IND_QUICK_TAGS = ["Bank Passbook", "School Enrollment Certificate", "Caste Certificate", "Income Certificate", "Site / Field Photos", "Gram Panchayat Letter"]

/* ─── Partnership phases ─── */
const PHASES = [
    {
        num: "01", color: "amber", Icon: FileSearch, title: "Document Verification",
        timeline: "1–2 weeks",
        desc: "All documents submitted at proposal creation are pre-verified by ImpactBridge. Funders may request additional documents via the platform.",
        tags: ["Pre-Verified ✓", "Platform Checked", "Due Diligence"],
    },
    {
        num: "02", color: "purple", Icon: PenLine, title: "MOU Agreement Signing",
        timeline: "1 week after verification",
        desc: "A Memorandum of Understanding is drafted on the platform, outlining fund allocation, milestones, and reporting obligations. Both parties sign digitally.",
        tags: ["MOU Drafting", "Digital Signature", "Tranche Release"],
    },
    {
        num: "03", color: "emerald", Icon: BarChart3, title: "Reporting & Impact Tracking",
        timeline: "Throughout project lifecycle",
        desc: "The NGO or beneficiary submits structured monthly, quarterly, and annual reports. Funders receive full visibility into fund utilization and community outcomes.",
        tags: ["Monthly Reports", "Quarterly Impact", "Annual Audit"],
    },
]

const COLOR = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", pill: "bg-blue-50 text-blue-700" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", pill: "bg-amber-50 text-amber-700" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", pill: "bg-purple-50 text-purple-700" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", pill: "bg-emerald-50 text-emerald-700" },
} as const

/* ─── localStorage helpers ─── */
function getPartnership(key: string) {
    if (typeof window === "undefined") return { funderConfirmed: false, partnerConfirmed: false }
    try { return JSON.parse(localStorage.getItem(key) || "{}") } catch { return {} }
}
function setPartnership(key: string, data: object) {
    if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(data))
}

export default function PartnershipPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const { ngoProposals, individualProposals } = useProposals()

    const type = typeof params?.type === "string" ? params.type : ""
    const id = typeof params?.id === "string" ? params.id : ""

    const proposal =
        type === "ngo"
            ? ngoProposals.find(p => p.id === id)
            : individualProposals.find(p => p.id === id)

    const docs = type === "ngo" ? NGO_DOCS : IND_DOCS
    const quickTags = type === "ngo" ? NGO_QUICK_TAGS : IND_QUICK_TAGS
    const backHref = type === "ngo" ? `/ngo-proposal/${id}` : `/individual-proposals/${id}`
    const entityLabel = type === "ngo" ? "NGO" : "Beneficiary"
    const storageKey = `partnership_${type}_${id}`

    /* ─── State ─── */
    const [funderConfirmed, setFunderConfirmed] = useState(false)
    const [partnerConfirmed, setPartnerConfirmed] = useState(false)
    const [partnershipId, setPartnershipId] = useState<string | null>(null)
    const [notifVisible, setNotifVisible] = useState(false)
    const [requestSent, setRequestSent] = useState(false)
    const [requestText, setRequestText] = useState("")
    const [mounted, setMounted] = useState(false)
    const [fullPartnership, setFullPartnership] = useState<any>(null)
    const [currentView, setCurrentView] = useState<"dashboard" | "mou">("dashboard")
    const [docsVerified, setDocsVerified] = useState(false)

    /* ─── Sync from backend on mount, fall back to localStorage ─── */
    useEffect(() => {
        if (!proposal || !user) return

        const partnerEmail = (proposal as any).createdBy || ""
        const partnerName = type === "ngo" ? (proposal as any).ngoName : (proposal as any).name

        apiCreatePartnership({
            proposalId: id,
            proposalType: type,
            proposalTitle: proposal.title,
            funderEmail: user.email,
            funderName: user.name,
            partnerEmail,
            partnerName,
        }).then(p => {
            setFullPartnership(p)
            setPartnershipId(p.id)
            setFunderConfirmed(p.funderConfirmed)
            setPartnerConfirmed(p.partnerConfirmed)
            setPartnership(storageKey, { funderConfirmed: p.funderConfirmed, partnerConfirmed: p.partnerConfirmed, pship: p, docsVerified: getPartnership(storageKey).docsVerified })
            setDocsVerified(!!getPartnership(storageKey).docsVerified)
        }).catch(() => {
            // Backend offline – fall back to localStorage
            const saved = getPartnership(storageKey)
            setFunderConfirmed(!!saved.funderConfirmed)
            setPartnerConfirmed(!!saved.partnerConfirmed)
            if (saved.pship) setFullPartnership(saved.pship)
            setDocsVerified(!!saved.docsVerified)
        }).finally(() => {
            setMounted(true)
            setTimeout(() => setNotifVisible(true), 800)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proposal, user])

    const bothConfirmed = funderConfirmed && partnerConfirmed
    const confirmCount = (funderConfirmed ? 1 : 0) + (partnerConfirmed ? 1 : 0)

    async function handleFunderConfirm() {
        if (partnershipId) {
            try {
                const updated = await apiFunderConfirm(partnershipId)
                setFunderConfirmed(updated.funderConfirmed)
                setPartnerConfirmed(updated.partnerConfirmed)
            } catch { /* backend offline – fall through to localStorage */ }
        }
        const updated = { ...getPartnership(storageKey), funderConfirmed: true }
        setPartnership(storageKey, updated)
        setFunderConfirmed(true)
    }

    async function handlePartnerConfirm() {
        if (partnershipId) {
            try {
                const updated = await apiPartnerConfirm(partnershipId)
                setFunderConfirmed(updated.funderConfirmed)
                setPartnerConfirmed(updated.partnerConfirmed)
            } catch { /* backend offline – fall through to localStorage */ }
        }
        const updated = { ...getPartnership(storageKey), partnerConfirmed: true }
        setPartnership(storageKey, updated)
        setPartnerConfirmed(true)
    }

    if (!proposal) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex flex-1 items-center justify-center p-6 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Proposal Not Found</h2>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </main>
                <Footer />
            </div>
        )
    }

    const proposalName = type === "ngo" ? (proposal as any).ngoName : (proposal as any).name

    return (
        <div className="flex min-h-screen flex-col bg-secondary/20">
            <Navbar />
            <main className="flex-1 pb-20">

                {/* ── Notification Toast ── */}
                {notifVisible && !bothConfirmed && (
                    <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-white shadow-lg px-5 py-4 max-w-xs">
                            <Bell className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">Notification Sent</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {proposalName} has been notified of your interest and must confirm to unlock the partnership.
                                </p>
                            </div>
                            <button onClick={() => setNotifVisible(false)} className="text-muted-foreground hover:text-foreground ml-1 text-lg leading-none">×</button>
                        </div>
                    </div>
                )}

                {/* ── Hero ── */}
                {currentView !== "mou" && (
                    <div className={`border-b pt-12 pb-10 px-6 transition-colors duration-700 ${bothConfirmed ? "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-100" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border-blue-100"}`}>
                        <div className="mx-auto max-w-5xl">
                            <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
                                <Link href={backHref}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Proposal</Link>
                            </Button>

                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1.5 px-3 py-1">
                                            <ShieldCheck className="h-3.5 w-3.5" /> Platform Verified
                                        </Badge>
                                        {bothConfirmed ? (
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1.5 px-3 py-1">
                                                <Unlock className="h-3.5 w-3.5" /> Partnership Active
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1.5 px-3 py-1">
                                                <Lock className="h-3.5 w-3.5" /> Awaiting Mutual Confirmation ({confirmCount}/2)
                                            </Badge>
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                                        {bothConfirmed ? "🎉 Partnership Confirmed!" : "CSR Partnership Journey"}
                                    </h1>
                                    <p className="text-muted-foreground max-w-xl leading-relaxed">
                                        {bothConfirmed
                                            ? `Both you and ${proposalName} have confirmed this partnership. All features are now unlocked. Here's your journey from here.`
                                            : `You're funding ${proposal.title} by ${proposalName}. Both parties must confirm before any features are unlocked — neither can proceed alone.`
                                        }
                                    </p>
                                </div>

                                {/* Quick stats */}
                                <div className="flex-shrink-0 grid grid-cols-2 gap-3 min-w-[220px]">
                                    <div className="rounded-xl bg-white border border-border px-4 py-3 text-center shadow-sm">
                                        <p className="text-base font-bold text-foreground">{(proposal as any).fundingRequired}</p>
                                        <p className="text-xs text-muted-foreground">Funding Goal</p>
                                    </div>
                                    <div className="rounded-xl bg-white border border-border px-4 py-3 text-center shadow-sm">
                                        <p className="text-base font-bold text-foreground">{proposal.beneficiaries.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">Beneficiaries</p>
                                    </div>
                                    <div className="rounded-xl bg-white border border-border px-4 py-3 text-center shadow-sm col-span-2">
                                        <p className="text-base font-bold text-foreground">{proposal.location}</p>
                                        <p className="text-xs text-muted-foreground">Location</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Body ── */}
                {!bothConfirmed ? (
                    <div className="mx-auto max-w-5xl px-6 mt-10 grid gap-8 lg:grid-cols-3">

                        {/* ── Left: Journey Phases ── */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* ══ Dual Confirmation Lock ══ */}
                            <Card className={`shadow-sm border-2 ${bothConfirmed ? "border-emerald-300 bg-emerald-50/40" : "border-amber-200 bg-amber-50/30"}`}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        {bothConfirmed
                                            ? <><Unlock className="h-5 w-5 text-emerald-600" /> Partnership Unlocked</>
                                            : <><Lock className="h-5 w-5 text-amber-600" /> Mutual Confirmation Required</>
                                        }
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {bothConfirmed
                                            ? "Both parties have confirmed this CSR partnership. The full journey and document features are now active."
                                            : "For security and trust, both you and the " + entityLabel.toLowerCase() + " must confirm this partnership before any features unlock. Neither party can proceed alone."
                                        }
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Progress bar */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                            <span>Confirmation Progress</span>
                                            <span>{confirmCount}/2 Confirmed</span>
                                        </div>
                                        <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-700 ${bothConfirmed ? "bg-emerald-500" : "bg-amber-400"}`}
                                                style={{ width: `${confirmCount * 50}%` }} />
                                        </div>
                                    </div>

                                    {/* Two party confirmation boxes */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {/* Funder Box */}
                                        <div className={`rounded-xl border-2 p-4 text-center transition-colors ${funderConfirmed ? "border-emerald-300 bg-emerald-50" : "border-border bg-card"}`}>
                                            <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3 ${funderConfirmed ? "bg-emerald-100" : "bg-secondary"}`}>
                                                {funderConfirmed
                                                    ? <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                                    : <Handshake className="h-6 w-6 text-muted-foreground" />
                                                }
                                            </div>
                                            <p className="font-semibold text-sm text-foreground mb-1">Your Confirmation</p>
                                            <p className="text-xs text-muted-foreground mb-3">
                                                {funderConfirmed ? "Confirmed ✓" : "You haven't confirmed yet"}
                                            </p>
                                            {!funderConfirmed && (
                                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                                    onClick={handleFunderConfirm}>
                                                    Confirm My Interest
                                                </Button>
                                            )}
                                        </div>

                                        {/* Partner Box */}
                                        <div className={`rounded-xl border-2 p-4 text-center transition-colors ${partnerConfirmed ? "border-emerald-300 bg-emerald-50" : "border-border bg-card"}`}>
                                            <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3 ${partnerConfirmed ? "bg-emerald-100" : "bg-secondary"}`}>
                                                {partnerConfirmed
                                                    ? <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                                    : <Clock className="h-6 w-6 text-muted-foreground" />
                                                }
                                            </div>
                                            <p className="font-semibold text-sm text-foreground mb-1">{proposalName}</p>
                                            <p className="text-xs text-muted-foreground mb-3">
                                                {partnerConfirmed ? "Accepted ✓" : "Waiting for their acceptance..."}
                                            </p>
                                            {/* Demo button — in production this would be on NGO/beneficiary's dashboard */}
                                            {!partnerConfirmed && funderConfirmed && (
                                                <Button size="sm" variant="outline" className="w-full text-xs border-dashed"
                                                    onClick={handlePartnerConfirm}>
                                                    [Demo] Simulate Their Acceptance
                                                </Button>
                                            )}
                                            {!funderConfirmed && (
                                                <p className="text-xs text-muted-foreground italic">Confirm your side first</p>
                                            )}
                                        </div>
                                    </div>

                                    {bothConfirmed && (
                                        <div className="flex items-center gap-3 rounded-xl bg-emerald-100 border border-emerald-200 p-4">
                                            <Sparkles className="h-5 w-5 text-emerald-600 shrink-0" />
                                            <p className="text-sm text-emerald-700 font-medium">
                                                Partnership is live! All 4 journey phases, document exchange, and MOU drafting are now accessible.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* ══ Journey Phases ══ */}
                            <div className="space-y-1 mb-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Partnership Roadmap</p>
                                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                                    What happens step by step?
                                </h2>
                            </div>

                            {PHASES.map((phase, idx) => {
                                const c = COLOR[phase.color as keyof typeof COLOR]
                                const Icon = phase.Icon
                                const isLocked = !bothConfirmed
                                return (
                                    <div key={phase.num} className={`flex gap-4 rounded-2xl border p-6 transition-all ${isLocked ? "opacity-50 border-border bg-card" : idx === 3 ? "border-emerald-200 bg-emerald-50/40" : "border-border bg-card hover:shadow-md"}`}>
                                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold text-sm ${isLocked ? "bg-secondary text-muted-foreground" : `${c.bg} ${c.text}`}`}>
                                            {isLocked ? <Lock className="h-5 w-5" /> : phase.num}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className={`text-xs font-bold uppercase tracking-wider ${isLocked ? "text-muted-foreground" : c.text}`}>Phase {idx + 1}</span>
                                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" /> {phase.timeline}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-foreground text-base mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                                                <Icon className="inline h-4 w-4 mr-2 -mt-0.5" />{phase.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{phase.desc}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {phase.tags.map(tag => (
                                                    <span key={tag} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isLocked ? "bg-secondary text-muted-foreground" : c.pill}`}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            <div className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/20 p-5">
                                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    <strong className="text-foreground">ImpactBridge Platform Guarantee:</strong>&nbsp;
                                    All steps facilitated on-platform for full transparency and CSR compliance under <strong>Section 135 of the Companies Act</strong>.
                                </p>
                            </div>
                        </div>

                        {/* ── Right Sidebar ── */}
                        <div className="space-y-6">

                            {/* Documents Card */}
                            <Card className={`shadow-sm ${!bothConfirmed ? "opacity-60" : ""}`}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <FolderOpen className="h-4 w-4 text-primary" />
                                            Submitted Documents
                                        </CardTitle>
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs gap-1">
                                            <ShieldCheck className="h-3 w-3" /> Verified
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {bothConfirmed ? "Pre-verified by ImpactBridge." : "Unlocks after both parties confirm."}
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {docs.map((doc) => (
                                        <div key={doc.name} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2.5 hover:bg-secondary/60 transition-colors group">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-medium text-foreground truncate">{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{doc.sub}</p>
                                                </div>
                                            </div>
                                            {bothConfirmed && (
                                                <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-primary hover:bg-primary/10 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Eye className="h-3 w-3" /> View
                                                </Button>
                                            )}
                                        </div>
                                    ))}

                                    {bothConfirmed && (
                                        <div className="pt-1">
                                            <Dialog onOpenChange={() => { setRequestSent(false); setRequestText("") }}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="w-full gap-2 border-dashed border-primary/40 text-primary hover:bg-primary/5 mt-1">
                                                        <Plus className="h-3.5 w-3.5" /> Request More Documents
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
                                                            <Send className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <DialogTitle className="text-center">Request Documents from {entityLabel}</DialogTitle>
                                                        <DialogDescription className="text-center">
                                                            {proposalName} will be notified and can upload via their dashboard.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    {requestSent ? (
                                                        <div className="flex flex-col items-center gap-3 py-6 text-center">
                                                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                                                            <p className="font-semibold text-foreground">Request Sent!</p>
                                                            <p className="text-sm text-muted-foreground">{proposalName} will upload the documents and you'll be notified.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-4 space-y-4">
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quick Add</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {quickTags.map(tag => (
                                                                        <button key={tag} type="button"
                                                                            onClick={() => setRequestText(prev => prev ? prev + ", " + tag : tag)}
                                                                            className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs hover:bg-secondary hover:border-primary/30 transition-colors">
                                                                            + {tag}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <Textarea
                                                                placeholder="Describe the documents you need..."
                                                                className="min-h-[90px] text-sm"
                                                                value={requestText}
                                                                onChange={(e) => setRequestText(e.target.value)}
                                                            />
                                                            <Button className="w-full gap-2" disabled={!requestText.trim()} onClick={() => setRequestSent(true)}>
                                                                <Send className="h-4 w-4" /> Send Document Request
                                                            </Button>
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Phase Status Tracker */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-primary" />
                                        Partnership Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {[
                                        { label: "Funder Confirmed", done: funderConfirmed },
                                        { label: `${entityLabel} Accepted`, done: partnerConfirmed },
                                        { label: "Document Verification", done: false },
                                        { label: "MOU Signed", done: false },
                                        { label: "Project Active (Funds Released)", done: false },
                                        { label: "Track Reports (Work Report)", done: false },
                                    ].map((step, i, arr) => {
                                        // Highlight only the *first* step that isn't done yet
                                        const isActive = !step.done && (i === 0 || arr[i - 1].done)
                                        return (
                                            <div key={step.label} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${step.done ? "bg-green-50" : isActive ? "bg-primary/5 border border-primary/20" : "opacity-40"}`}>
                                                <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-green-500" : isActive ? "bg-primary" : "bg-secondary border border-border"}`}>
                                                    {step.done
                                                        ? <CheckCircle2 className="h-3 w-3 text-white" />
                                                        : <span className="text-xs text-white font-bold">{i + 1}</span>
                                                    }
                                                </div>
                                                <span className={`font-medium text-xs ${step.done ? "text-green-700" : isActive ? "text-primary" : "text-muted-foreground"}`}>{step.label}</span>
                                                {isActive && !step.done && <span className="ml-auto text-xs text-primary">← Now</span>}
                                            </div>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : currentView === "mou" ? (
                    <MouSigning
                        partnership={fullPartnership}
                        user={user}
                        proposal={proposal}
                        entityLabel={entityLabel}
                        handleCloseMou={() => setCurrentView("dashboard")}
                        updatePartnership={(p) => setFullPartnership(p)}
                    />
                ) : (
                    <ActiveDashboard
                        partnership={fullPartnership}
                        user={user}
                        proposal={proposal}
                        entityLabel={entityLabel}
                        docs={docs}
                        docsVerified={docsVerified}
                        onVerifyDocs={() => {
                            setDocsVerified(true)
                            setPartnership(storageKey, { ...getPartnership(storageKey), docsVerified: true })
                        }}
                        handleOpenMou={() => setCurrentView("mou")}
                    />
                )}
            </main>
            <Footer />
        </div>
    )
}
