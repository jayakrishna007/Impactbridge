"use client"

import React from "react"
import {
    CheckCircle2, FileSearch, PenLine, Landmark, BarChart3, Lock, Activity
} from "lucide-react"

export type JourneyView = "dashboard" | "mou" | "fund-release"

interface PartnershipJourneyBarProps {
    /** Which full-screen view is currently active */
    currentView: JourneyView
    /** True once both funder & partner have confirmed */
    bothConfirmed: boolean
    /** True if docs have been verified by the platform */
    docsVerified: boolean
    /** Callback when user clicks a step node */
    onStepClick: (view: JourneyView) => void
}

interface StepDef {
    key: JourneyView | "confirmation" | "docs"
    icon: React.ElementType
    label: string
    /** Which view to navigate to when clicked */
    targetView?: JourneyView
    /** Colour class for the active ring */
    activeColor: string
    hoverBorder: string
    hoverText: string
}

const STEPS: StepDef[] = [
    {
        key: "confirmation",
        icon: CheckCircle2,
        label: "Confirmation",
        targetView: "dashboard",
        activeColor: "bg-emerald-500",
        hoverBorder: "group-hover:border-emerald-400",
        hoverText: "group-hover:text-emerald-700",
    },
    {
        key: "docs",
        icon: FileSearch,
        label: "Doc Verification",
        targetView: "dashboard",
        activeColor: "bg-blue-600",
        hoverBorder: "group-hover:border-blue-400",
        hoverText: "group-hover:text-blue-700",
    },
    {
        key: "mou",
        icon: PenLine,
        label: "MOU Signing",
        targetView: "mou",
        activeColor: "bg-purple-600",
        hoverBorder: "group-hover:border-purple-400",
        hoverText: "group-hover:text-purple-700",
    },
    {
        key: "fund-release",
        icon: Landmark,
        label: "Fund Release",
        targetView: "fund-release",
        activeColor: "bg-indigo-600",
        hoverBorder: "group-hover:border-indigo-400",
        hoverText: "group-hover:text-indigo-700",
    },
    {
        key: "fund-release",  // same view — reporting is part of fund-release
        icon: BarChart3,
        label: "Reports Tracking",
        targetView: "fund-release",
        activeColor: "bg-teal-600",
        hoverBorder: "group-hover:border-teal-400",
        hoverText: "group-hover:text-teal-700",
    },
]

export function PartnershipJourneyBar({
    currentView,
    bothConfirmed,
    docsVerified,
    onStepClick,
}: PartnershipJourneyBarProps) {
    /** Determine unlock status of each step index */
    function isUnlocked(idx: number): boolean {
        if (idx === 0) return true                      // Confirmation — always visible
        if (idx === 1) return bothConfirmed             // Doc Verification — need both confirmed
        if (idx === 2) return bothConfirmed && docsVerified  // MOU — need docs verified
        if (idx === 3) return bothConfirmed && docsVerified  // Fund Release
        if (idx === 4) return bothConfirmed && docsVerified  // Reports
        return false
    }

    /** Determine if a step is the "current" active one (for styling the button) */
    function isActive(idx: number): boolean {
        // We just highlight the node corresponding to the page they are sitting on
        if (idx === 2 && currentView === "mou") return true
        if (idx === 3 && currentView === "fund-release") return true
        if (idx === 4 && currentView === "fund-release") return true
        if ((idx === 0 || idx === 1) && currentView === "dashboard") return true
        return false
    }

    /** Is step "done" (past it) - based purely on backend state, NOT current view */
    function isDone(idx: number): boolean {
        if (idx === 0 && bothConfirmed) return true
        if (idx === 1 && docsVerified) return true
        return false
    }

    return (
        <div className="bg-white border-b border-border px-6 py-4 sticky top-0 z-40 shadow-sm">
            <div className="mx-auto max-w-5xl">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                        <Activity className="h-4 w-4 text-emerald-600" />
                        Partnership Journey
                    </h3>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {docsVerified ? "Active" : bothConfirmed ? "Doc Verification" : "Awaiting Confirmation"}
                    </span>
                </div>

                {/* Progress bar + steps */}
                <div className="relative mt-6 mb-1">
                    {/* Background track */}
                    <div className="absolute top-4 left-0 w-full h-1 bg-secondary rounded-full -translate-y-1/2" />

                    {/* Filled progress (based on actual state, not view) */}
                    <div
                        className="absolute top-4 left-0 h-1 bg-emerald-500 rounded-full -translate-y-1/2 transition-all duration-700"
                        style={{
                            width: !bothConfirmed
                                ? "0%"             // at step 0
                                : !docsVerified
                                    ? "25%"        // at step 1
                                    : "50%"        // at step 2 (MOU verification next)
                        }}
                    />

                    {/* Step nodes */}
                    <div className="relative flex justify-between">
                        {STEPS.map((step, idx) => {
                            const unlocked = isUnlocked(idx)
                            const active = isActive(idx)
                            const done = isDone(idx)
                            const Icon = step.icon

                            if (!unlocked) {
                                return (
                                    <div key={idx} className="flex flex-col items-center gap-1.5 z-10 opacity-50 w-20">
                                        <div className="h-8 w-8 rounded-full bg-secondary border-2 border-border ring-4 ring-white flex items-center justify-center">
                                            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                        </div>
                                        <span className="text-xs font-semibold text-muted-foreground text-center leading-tight">{step.label}</span>
                                    </div>
                                )
                            }

                            if (done) {
                                return (
                                    <div
                                        key={idx}
                                        className="flex flex-col items-center gap-1.5 z-10 cursor-pointer group w-20"
                                        onClick={() => step.targetView && onStepClick(step.targetView)}
                                    >
                                        <div className="h-8 w-8 rounded-full bg-emerald-500 ring-4 ring-white flex items-center justify-center shadow-sm">
                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                        </div>
                                        <span className={`text-xs font-bold text-emerald-700 text-center leading-tight ${step.hoverText}`}>{step.label}</span>
                                    </div>
                                )
                            }

                            if (active) {
                                return (
                                    <div
                                        key={idx}
                                        className="flex flex-col items-center gap-1.5 z-10 cursor-pointer w-20"
                                        onClick={() => step.targetView && onStepClick(step.targetView)}
                                    >
                                        <div className={`h-8 w-8 rounded-full ${step.activeColor} ring-4 ring-white flex items-center justify-center shadow-md animate-pulse`}>
                                            <Icon className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-xs font-extrabold text-foreground text-center leading-tight">{step.label}</span>
                                    </div>
                                )
                            }

                            // Unlocked but not yet active — clickable
                            return (
                                <div
                                    key={idx}
                                    className="flex flex-col items-center gap-1.5 z-10 cursor-pointer group w-20"
                                    onClick={() => step.targetView && onStepClick(step.targetView)}
                                >
                                    <div className={`h-8 w-8 rounded-full bg-white border-2 border-border ${step.hoverBorder} ring-4 ring-white flex items-center justify-center transition-all`}>
                                        <Icon className={`h-4 w-4 text-muted-foreground ${step.hoverText}`} />
                                    </div>
                                    <span className={`text-xs font-semibold text-muted-foreground ${step.hoverText} text-center leading-tight`}>{step.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
