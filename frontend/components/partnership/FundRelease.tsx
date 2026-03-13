"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    ArrowLeft, IndianRupee, Layers, CheckCircle2, Clock, Send,
    AlertCircle, BarChart3, MapPin, CalendarDays, FileText,
    TrendingUp, Zap, Save, ChevronRight, Target, Landmark,
    RefreshCw, Lock, Unlock, PieChart, Info
} from "lucide-react"
import { apiGetFundPlan, apiSaveFundPlan, apiUpdateInstallmentStatus, FundPlan, FundInstallment } from "@/lib/api"

/* ─── Reporting Style Options ─── */
const REPORTING_STYLES = [
    {
        id: "mis",
        label: "MIS Report",
        icon: BarChart3,
        color: "blue",
        desc: "Monthly Management Information System report — financial summary, KPIs, fund utilization.",
        frequency: "Monthly"
    },
    {
        id: "quarterly",
        label: "Quarterly Report",
        icon: CalendarDays,
        color: "purple",
        desc: "Comprehensive 3-month impact summary with beneficiary count, outcomes and audited accounts.",
        frequency: "Every 3 months"
    },
    {
        id: "annual",
        label: "Annual Report",
        icon: FileText,
        color: "emerald",
        desc: "Full-year impact audit, financial disclosure, milestone review and future project plans.",
        frequency: "Yearly"
    },
    {
        id: "realtime",
        label: "Real-Time Location Reporting",
        icon: MapPin,
        color: "rose",
        desc: "Field updates with GPS-tagged photos and short video clips uploaded from project site.",
        frequency: "As it happens"
    },
]

const STATUS_CONFIG = {
    pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700 border-amber-200",   icon: Clock },
    released:  { label: "Released",  color: "bg-blue-100 text-blue-700 border-blue-200",      icon: Landmark },
    confirmed: { label: "Confirmed", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
}

const REPORTING_COLOR: Record<string, string> = {
    blue:    "bg-blue-50 border-blue-200 text-blue-700",
    purple:  "bg-purple-50 border-purple-200 text-purple-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    rose:    "bg-rose-50 border-rose-200 text-rose-700",
}
const REPORTING_CHECK: Record<string, string> = {
    blue:    "bg-blue-600",
    purple:  "bg-purple-600",
    emerald: "bg-emerald-600",
    rose:    "bg-rose-600",
}

/* ─── Parse funding amount to number ─── */
function parseAmount(raw: string): number {
    const cleaned = raw.replace(/[₹,\s]/g, "")
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : num
}

function formatInr(num: number): string {
    if (num >= 1_00_00_000) return `₹${(num / 1_00_00_000).toFixed(2)} Cr`
    if (num >= 1_00_000) return `₹${(num / 1_00_000).toFixed(2)} L`
    return `₹${num.toLocaleString("en-IN")}`
}

/* ─── Simple Donut ─── */
function DonutChart({ installments, total }: { installments: FundInstallment[], total: number }) {
    const colors = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#06b6d4","#ec4899","#84cc16","#f97316","#6366f1"]
    const radius = 60
    const cx = 80
    const cy = 80
    let cumAngle = -Math.PI / 2

    const slices = installments.map((inst, i) => {
        const val = parseAmount(inst.amount)
        const frac = total > 0 ? val / total : 1 / installments.length
        const angle = frac * 2 * Math.PI
        const x1 = cx + radius * Math.cos(cumAngle)
        const y1 = cy + radius * Math.sin(cumAngle)
        cumAngle += angle
        const x2 = cx + radius * Math.cos(cumAngle)
        const y2 = cy + radius * Math.sin(cumAngle)
        const large = angle > Math.PI ? 1 : 0
        return { path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`, color: colors[i % colors.length], label: inst.label }
    })

    return (
        <svg viewBox="0 0 160 160" className="w-32 h-32">
            {slices.map((s, i) => (
                <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="1.5" className="transition-opacity hover:opacity-80" />
            ))}
            <circle cx={cx} cy={cy} r={35} fill="white" />
            <text x={cx} y={cy - 6} textAnchor="middle" className="text-xs" fill="#374151" fontSize="9" fontWeight="700">TRANCHES</text>
            <text x={cx} y={cy + 8} textAnchor="middle" fill="#111827" fontSize="14" fontWeight="800">{installments.length}</text>
        </svg>
    )
}

export function FundRelease({
    partnership,
    proposal,
    user,
    isFunder,
    onBack,
}: {
    partnership: any,
    proposal: any,
    user: any,
    isFunder: boolean,
    onBack: () => void,
}) {
    const totalRaw: string = proposal?.fundingRequired || "0"
    const totalNum = parseAmount(totalRaw)

    /* ─── State ─── */
    const [numInstallments, setNumInstallments] = useState(3)
    const [installments, setInstallments] = useState<FundInstallment[]>([])
    const [selectedStyles, setSelectedStyles] = useState<string[]>([])
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [existingPlan, setExistingPlan] = useState<FundPlan | null>(null)
    const [loading, setLoading] = useState(true)
    const [updatingIdx, setUpdatingIdx] = useState<number | null>(null)

    /* ─── Load existing plan ─── */
    useEffect(() => {
        const load = async () => {
            if (!partnership?.id) return
            setLoading(true)
            const plan = await apiGetFundPlan(partnership.id)
            if (plan) {
                setExistingPlan(plan)
                setInstallments(plan.installments)
                setSelectedStyles(plan.reportingStyles)
                setNumInstallments(plan.installments.length)
            } else {
                buildInstallments(3)
            }
            setLoading(false)
        }
        load()
    }, [partnership?.id])

    /* ─── Auto-build equal installments ─── */
    const buildInstallments = useCallback((n: number) => {
        const perTranche = totalNum > 0 ? totalNum / n : 0
        const today = new Date()
        const newInst: FundInstallment[] = Array.from({ length: n }, (_, i) => {
            const due = new Date(today)
            due.setMonth(due.getMonth() + (i + 1) * 3)
            return {
                label: `Tranche ${i + 1}`,
                amount: formatInr(perTranche),
                dueDate: due.toISOString().slice(0, 10),
                milestone: i === 0 ? "Project Kickoff" : i === n - 1 ? "Final Audit Submitted" : `Q${i + 1} Report Submitted`,
                status: "pending" as const,
            }
        })
        setInstallments(newInst)
    }, [totalNum])

    const handleNumChange = (n: number) => {
        setNumInstallments(n)
        buildInstallments(n)
        setSaved(false)
    }

    const updateInstallment = (idx: number, field: keyof FundInstallment, value: string) => {
        setInstallments(prev => prev.map((inst, i) => i === idx ? { ...inst, [field]: value } : inst))
        setSaved(false)
    }

    const toggleStyle = (id: string) => {
        setSelectedStyles(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
        setSaved(false)
    }

    /* ─── Calculate totals ─── */
    const allocatedNum = installments.reduce((sum, inst) => sum + parseAmount(inst.amount), 0)
    const diff = totalNum - allocatedNum
    const isBalanced = Math.abs(diff) < 1

    /* ─── Save plan ─── */
    const handleSave = async () => {
        if (!partnership?.id) return
        setSaving(true)
        try {
            await apiSaveFundPlan(partnership.id, {
                totalAmount: totalRaw,
                installments,
                reportingStyles: selectedStyles,
                appliedBy: user?.email,
            })
            setSaved(true)
            const plan = await apiGetFundPlan(partnership.id)
            if (plan) setExistingPlan(plan)
        } catch (err) {
            console.error("Failed to save fund plan:", err)
        }
        setSaving(false)
    }

    /* ─── Update tranche status (funder only) ─── */
    const handleStatusUpdate = async (idx: number, status: "pending" | "released" | "confirmed") => {
        if (!partnership?.id || !isFunder) return
        setUpdatingIdx(idx)
        try {
            await apiUpdateInstallmentStatus(partnership.id, idx, status)
            setInstallments(prev => prev.map((inst, i) => i === idx ? { ...inst, status } : inst))
            if (existingPlan) {
                const updated = { ...existingPlan, installments: installments.map((inst, i) => i === idx ? { ...inst, status } : inst) }
                setExistingPlan(updated)
            }
        } catch (err) {
            console.error("Failed to update status:", err)
        }
        setUpdatingIdx(null)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Loading fund plan...</p>
            </div>
        )
    }

    const releasedCount = installments.filter(i => i.status === "released" || i.status === "confirmed").length
    const releasedAmount = installments.filter(i => i.status === "released" || i.status === "confirmed").reduce((s, i) => s + parseAmount(i.amount), 0)

    return (
        <div className="mx-auto max-w-5xl px-6 pt-8 pb-20 space-y-8">

            {/* ── Back Button ── */}
            <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 text-muted-foreground hover:text-foreground gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Partnership Dashboard
            </Button>

            {/* ── Hero Header ── */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/20 text-xs font-bold px-3 py-1">
                                <Layers className="h-3 w-3 mr-1.5" /> Fund Release Manager
                            </Badge>
                            {existingPlan && (
                                <Badge className="bg-emerald-400/30 text-white border-emerald-400/40 hover:bg-emerald-400/30 text-xs font-bold px-3 py-1">
                                    <CheckCircle2 className="h-3 w-3 mr-1.5" /> Plan Active
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-3xl font-black mb-2">Fund Release & Reporting</h1>
                        <p className="text-white/80 text-base leading-relaxed">
                            Configure installment schedule and reporting requirements for <strong>{proposal?.title || "this project"}</strong>.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 min-w-[220px]">
                        <div className="rounded-xl bg-white/10 border border-white/20 p-4 text-center backdrop-blur">
                            <p className="text-2xl font-black">{totalRaw}</p>
                            <p className="text-xs text-white/70 font-semibold mt-1">Total Funding</p>
                        </div>
                        <div className="rounded-xl bg-white/10 border border-white/20 p-4 text-center backdrop-blur">
                            <p className="text-2xl font-black">{releasedCount}/{installments.length}</p>
                            <p className="text-xs text-white/70 font-semibold mt-1">Tranches Released</p>
                        </div>
                        <div className="col-span-2 rounded-xl bg-white/10 border border-white/20 p-3 backdrop-blur">
                            <div className="flex justify-between text-xs text-white/70 font-semibold mb-1.5">
                                <span>Funds Disbursed</span>
                                <span>{totalNum > 0 ? Math.round((releasedAmount / totalNum) * 100) : 0}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                                    style={{ width: `${totalNum > 0 ? (releasedAmount / totalNum) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* ─── Left: Builder ─── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Installment Builder */}
                    {isFunder ? (
                        <Card className="shadow-sm border-2 border-indigo-100">
                            <CardHeader className="pb-4 bg-indigo-50/50 rounded-t-xl">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg font-black">
                                        <PieChart className="h-5 w-5 text-indigo-600" /> Installment Schedule Builder
                                    </CardTitle>
                                    {!isBalanced && (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 rounded-full px-3 py-1">
                                            <AlertCircle className="h-3.5 w-3.5" />
                                            {diff > 0 ? `₹ ${Math.abs(diff).toLocaleString("en-IN")} unallocated` : `₹ ${Math.abs(diff).toLocaleString("en-IN")} over budget`}
                                        </span>
                                    )}
                                    {isBalanced && installments.length > 0 && (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-full px-3 py-1">
                                            <CheckCircle2 className="h-3.5 w-3.5" /> Balanced
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-6">
                                {/* Number of tranches */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                            Number of Tranches
                                        </label>
                                        <span className="text-2xl font-black text-indigo-600">{numInstallments}</span>
                                    </div>
                                    <input
                                        type="range" min={1} max={10} value={numInstallments}
                                        onChange={e => handleNumChange(Number(e.target.value))}
                                        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-indigo-600 bg-indigo-100"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground mt-1.5 font-medium">
                                        <span>1 (Lump sum)</span><span>5</span><span>10 (Max)</span>
                                    </div>
                                </div>

                                {/* Tranche rows */}
                                <div className="space-y-3">
                                    {installments.map((inst, idx) => (
                                        <div key={idx} className="rounded-xl border-2 border-border bg-secondary/20 p-4 hover:border-indigo-200 transition-colors">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <Input
                                                    value={inst.label}
                                                    onChange={e => updateInstallment(idx, "label", e.target.value)}
                                                    className="h-8 text-sm font-bold border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    placeholder="Tranche label..."
                                                />
                                                <Badge className={`text-xs font-bold ml-auto border ${STATUS_CONFIG[inst.status].color}`}>
                                                    {STATUS_CONFIG[inst.status].label}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Amount</label>
                                                    <div className="relative">
                                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                                        <Input
                                                            value={inst.amount}
                                                            onChange={e => updateInstallment(idx, "amount", e.target.value)}
                                                            className="pl-8 h-10 text-sm font-semibold"
                                                            placeholder="₹..."
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Target Date</label>
                                                    <Input
                                                        type="date"
                                                        value={inst.dueDate}
                                                        onChange={e => updateInstallment(idx, "dueDate", e.target.value)}
                                                        className="h-10 text-sm font-semibold"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                                                    <Target className="h-3 w-3" /> Release Milestone
                                                </label>
                                                <Input
                                                    value={inst.milestone || ""}
                                                    onChange={e => updateInstallment(idx, "milestone", e.target.value)}
                                                    className="h-9 text-sm"
                                                    placeholder="e.g. Q1 Report Submitted..."
                                                />
                                            </div>
                                            {/* Status update buttons (funder only) */}
                                            {existingPlan && (
                                                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                                                    <span className="text-xs font-bold text-muted-foreground self-center mr-1">Update:</span>
                                                    {(["pending","released","confirmed"] as const).map(s => (
                                                        <button
                                                            key={s}
                                                            disabled={inst.status === s || updatingIdx === idx}
                                                            onClick={() => handleStatusUpdate(idx, s)}
                                                            className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${inst.status === s ? STATUS_CONFIG[s].color + " opacity-80 cursor-default" : "border-border hover:border-primary hover:text-primary"}`}
                                                        >
                                                            {updatingIdx === idx ? "..." : STATUS_CONFIG[s].label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        /* Read-only view for NGO/Beneficiary */
                        <Card className="shadow-sm border-2 border-indigo-100">
                            <CardHeader className="pb-4 bg-indigo-50/50 rounded-t-xl">
                                <CardTitle className="flex items-center gap-2 text-lg font-black">
                                    <Layers className="h-5 w-5 text-indigo-600" /> Your Funding Schedule
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5">
                                {existingPlan ? (
                                    <div className="space-y-3">
                                        {installments.map((inst, idx) => {
                                            const StatusIcon = STATUS_CONFIG[inst.status].icon
                                            return (
                                                <div key={idx} className={`rounded-xl border-2 p-4 ${inst.status === "confirmed" ? "border-emerald-200 bg-emerald-50/50" : inst.status === "released" ? "border-blue-200 bg-blue-50/50" : "border-border"}`}>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center font-black text-indigo-700 text-sm">{idx + 1}</div>
                                                            <div>
                                                                <p className="font-bold text-foreground">{inst.label}</p>
                                                                <p className="text-xs text-muted-foreground">Due: {new Date(inst.dueDate).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-black text-foreground text-lg">{inst.amount}</p>
                                                            <Badge className={`text-xs font-bold border ${STATUS_CONFIG[inst.status].color}`}>
                                                                <StatusIcon className="h-3 w-3 mr-1" />{STATUS_CONFIG[inst.status].label}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    {inst.milestone && (
                                                        <div className="mt-3 flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                                                            <Target className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                            <p className="text-xs font-semibold text-muted-foreground">Milestone: {inst.milestone}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
                                        <Lock className="h-10 w-10 opacity-30" />
                                        <p className="font-semibold">Fund plan not configured yet</p>
                                        <p className="text-sm">Your funder will set up the installment schedule and you'll be notified.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Reporting Style Picker */}
                    <Card className="shadow-sm border-2 border-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-black">
                                <TrendingUp className="h-5 w-5 text-primary" /> Reporting Requirements
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {isFunder ? "Select one or more reporting styles the partner must submit." : "Reporting styles your funder requires."}
                            </p>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4">
                            {REPORTING_STYLES.map(style => {
                                const Icon = style.icon
                                const isSelected = selectedStyles.includes(style.id)
                                return (
                                    <div
                                        key={style.id}
                                        onClick={() => isFunder && toggleStyle(style.id)}
                                        className={`relative rounded-xl border-2 p-4 transition-all ${isFunder ? "cursor-pointer hover:shadow-md" : ""} ${isSelected ? `border-current ${REPORTING_COLOR[style.color]} shadow-sm` : "border-border bg-card hover:border-border"}`}
                                    >
                                        {isSelected && (
                                            <div className={`absolute top-3 right-3 h-5 w-5 rounded-full ${REPORTING_CHECK[style.color]} flex items-center justify-center`}>
                                                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                            </div>
                                        )}
                                        <div className={`h-10 w-10 rounded-xl ${isSelected ? REPORTING_CHECK[style.color] : "bg-secondary"} flex items-center justify-center mb-3 transition-colors`}>
                                            <Icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                                        </div>
                                        <p className="font-black text-sm text-foreground mb-1">{style.label}</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">{style.desc}</p>
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
                                            <CalendarDays className="h-3 w-3" /> {style.frequency}
                                        </span>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    {isFunder && (
                        <div className="flex items-center gap-4">
                            <Button
                                size="lg"
                                disabled={saving || selectedStyles.length === 0 || installments.length === 0}
                                onClick={handleSave}
                                className={`flex-1 h-14 text-base font-black gap-3 shadow-lg transition-all ${saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}
                            >
                                {saving ? (
                                    <><RefreshCw className="h-5 w-5 animate-spin" /> Saving…</>
                                ) : saved ? (
                                    <><CheckCircle2 className="h-5 w-5" /> Plan Saved Successfully!</>
                                ) : (
                                    <><Save className="h-5 w-5" /> Apply Fund Release Plan</>
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                {/* ─── Right: Summary & Donut ─── */}
                <div className="space-y-6">
                    
                    {/* Donut + Summary */}
                    <Card className="shadow-sm border-2 border-indigo-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-black">Allocation Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            {installments.length > 0 ? (
                                <>
                                    <DonutChart installments={installments} total={allocatedNum || 1} />
                                    <div className="w-full space-y-2">
                                        {installments.map((inst, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2.5 w-2.5 rounded-sm" style={{ background: ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#06b6d4","#ec4899","#84cc16","#f97316","#6366f1"][idx % 10] }} />
                                                    <span className="font-medium text-muted-foreground truncate max-w-[100px]">{inst.label}</span>
                                                </div>
                                                <span className="font-black text-foreground">{inst.amount}</span>
                                            </div>
                                        ))}
                                        <div className="border-t pt-2 flex items-center justify-between font-black text-sm">
                                            <span className="text-muted-foreground">Total Allocated</span>
                                            <span className={isBalanced ? "text-emerald-600" : "text-amber-600"}>{formatInr(allocatedNum)}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted-foreground text-sm text-center py-6">Set tranches to see allocation</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Reporting Summary */}
                    {selectedStyles.length > 0 && (
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-black">Selected Reporting</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {REPORTING_STYLES.filter(s => selectedStyles.includes(s.id)).map(style => {
                                    const Icon = style.icon
                                    return (
                                        <div key={style.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${REPORTING_COLOR[style.color]}`}>
                                            <Icon className="h-4 w-4 shrink-0" />
                                            <div>
                                                <p className="text-xs font-black">{style.label}</p>
                                                <p className="text-xs opacity-70">{style.frequency}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    )}

                    {/* Info Box */}
                    <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 flex gap-3">
                        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800 leading-relaxed font-medium">
                            Once you click <strong>Apply</strong>, the NGO/Beneficiary will be notified of the schedule and reporting requirements. You can update the status of each tranche as funds are released.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
