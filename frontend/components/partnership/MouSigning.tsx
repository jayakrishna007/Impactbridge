"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ChevronLeft, ShieldCheck, PenLine, Download } from "lucide-react"
import { apiSignMou } from "@/lib/api"

export function MouSigning({
    partnership,
    user,
    proposal,
    entityLabel,
    handleCloseMou,
    updatePartnership
}: {
    partnership: any,
    user: any,
    proposal: any,
    entityLabel: string,
    handleCloseMou: () => void,
    updatePartnership: (newPship: any) => void
}) {
    const isFunder = user?.role === "funder"
    const proposalName = partnership.proposalType === "ngo" ? partnership.partnerName : partnership.partnerName || "Beneficiary"

    // Fallbacks if not provided
    const signatures = partnership?.mouSignatures || {
        funder: false,
        partner: false,
        funderSignedAt: null,
        partnerSignedAt: null
    }

    const [isSigning, setIsSigning] = useState(false)

    async function handleSign() {
        setIsSigning(true)
        try {
            const roleStr = isFunder ? "funder" : "partner"
            const updated = await apiSignMou(partnership.id, roleStr)
            updatePartnership(updated)
        } catch (e) {
            console.error("Signing failed", e)
        } finally {
            setIsSigning(false)
        }
    }

    return (
        <div className="mx-auto max-w-5xl px-6 pt-8 pb-16 space-y-8 animate-in fade-in duration-500">
            <Button variant="ghost" size="sm" onClick={handleCloseMou} className="text-muted-foreground hover:text-foreground mb-4">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-8 mb-8">
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 mb-4 px-3 py-1">Phase 03 — MOU Agreement</Badge>
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                    Memorandum of Understanding
                </h1>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    Review and digitally sign the partnership agreement between {partnership.funderName} and {proposalName}. This legally binds the fund release schedule to reporting milestones.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* ── Left Column (MOU Document) ── */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border shadow-md" style={{ background: "#fffffe" }}>
                        <CardContent className="p-8 sm:p-12 space-y-8 font-serif">
                            <div className="text-center space-y-2 border-b pb-6">
                                <h2 className="text-2xl font-bold uppercase tracking-wider">Memorandum of Understanding</h2>
                                <p className="text-sm text-muted-foreground">Dated: {new Date().toLocaleDateString()}</p>
                            </div>

                            <p className="leading-relaxed text-sm shadow-sm bg-secondary/5 p-4 rounded-md">
                                This Memorandum of Understanding (the "MOU") is entered into by and between <strong>{partnership.funderName}</strong> (hereinafter referred to as "Funder") AND <strong>{proposalName}</strong> (hereinafter referred to as "{entityLabel}").
                            </p>

                            <div className="space-y-4">
                                <h3 className="font-bold border-b pb-2 text-base">1. Project Scope & Objectives</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    The Funder agrees to provide financial support for the project titled "<strong>{proposal.title}</strong>". The {entityLabel} agrees to execute the project diligently, benefiting {proposal.beneficiaries?.toLocaleString()} individuals in {proposal.location}.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold border-b pb-2 text-base">2. Fund Allocation & Tranches</h3>
                                <div className="border rounded-md overflow-hidden text-sm font-sans">
                                    <table className="w-full text-left">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="px-4 py-2 font-medium">Tranche</th>
                                                <th className="px-4 py-2 font-medium">Amount</th>
                                                <th className="px-4 py-2 font-medium">Condition for Release</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y text-muted-foreground">
                                            <tr>
                                                <td className="px-4 py-3">Tranche 1</td>
                                                <td className="px-4 py-3 font-semibold text-foreground">₹50,00,000</td>
                                                <td className="px-4 py-3">Upon signing of this MOU</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3">Tranche 2</td>
                                                <td className="px-4 py-3 font-semibold text-foreground">₹75,00,000</td>
                                                <td className="px-4 py-3">After Month 3 Progress Report Approval</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3">Tranche 3</td>
                                                <td className="px-4 py-3 font-semibold text-foreground">₹75,00,000</td>
                                                <td className="px-4 py-3">After Month 6 Impact Report Approval</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-sm font-bold text-right pr-4">Total Committed: {proposal.fundingRequired}</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold border-b pb-2 text-base">3. Reporting Obligations</h3>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                                    <li>Submit monthly summarized field updates via the platform.</li>
                                    <li>Submit detailed Quarterly Reports including financial statements.</li>
                                    <li>Provide an Annual Audit Report within 60 days of project closure.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Signature Boxes */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Funder Signature */}
                        <div className={`border p-6 rounded-xl text-center space-y-4 transition-colors ${signatures.funder ? "bg-emerald-50 border-emerald-200" : "bg-card"}`}>
                            <h3 className="font-semibold text-foreground">Funder Signature</h3>
                            {signatures.funder ? (
                                <div className="space-y-3">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                                    <p className="font-[signature] text-3xl text-emerald-700 opacity-80">{partnership.funderName}</p>
                                    <p className="text-xs text-emerald-600 font-medium">Signed digitally on {new Date(signatures.funderSignedAt).toLocaleDateString()}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="h-16 w-full border-b border-dashed border-border" />
                                    <p className="text-xs text-muted-foreground">Awaiting Signature</p>
                                    {isFunder && (
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-2" onClick={handleSign} disabled={isSigning} gap-2>
                                            <PenLine className="h-4 w-4 mr-2" /> Sign Agreement
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Partner Signature */}
                        <div className={`border p-6 rounded-xl text-center space-y-4 transition-colors ${signatures.partner ? "bg-emerald-50 border-emerald-200" : "bg-card"}`}>
                            <h3 className="font-semibold text-foreground">{entityLabel} Signature</h3>
                            {signatures.partner ? (
                                <div className="space-y-3">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                                    <p className="font-[signature] text-3xl text-emerald-700 opacity-80">{partnership.partnerName}</p>
                                    <p className="text-xs text-emerald-600 font-medium">Signed digitally on {new Date(signatures.partnerSignedAt).toLocaleDateString()}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="h-16 w-full border-b border-dashed border-border" />
                                    <p className="text-xs text-muted-foreground">Awaiting Signature</p>
                                    {!isFunder && (
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-2" onClick={handleSign} disabled={isSigning} gap-2>
                                            <PenLine className="h-4 w-4 mr-2" /> Sign Agreement
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Right Column (Sidebar) ── */}
                <div className="space-y-6">
                    {/* Agreement Summary */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3 border-b bg-muted/20">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Agreement Details</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Total Fund</p>
                                <p className="font-bold text-foreground">{proposal.fundingRequired}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Duration</p>
                                <p className="font-bold text-foreground">12 Months</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Fund Structure</p>
                                <p className="font-bold text-foreground">3 Milestone Tranches</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Reporting Requirement</p>
                                <p className="font-bold text-foreground text-sm">Monthly Updates + Quarterly Impact Reports</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trust & Compliance */}
                    <Card className="shadow-sm border-blue-100 bg-blue-50/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-blue-600" />
                                Trust & Compliance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-foreground">
                                <CheckCircle2 className="h-4 w-4 text-blue-600" /> Platform Verified
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground">
                                <CheckCircle2 className="h-4 w-4 text-blue-600" /> Documents Audited
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground">
                                <CheckCircle2 className="h-4 w-4 text-blue-600" /> Section 135 Compliant
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground">
                                <CheckCircle2 className="h-4 w-4 text-blue-600" /> e-Signature Valid
                            </div>
                        </CardContent>
                    </Card>

                    <Button variant="outline" className="w-full gap-2 border-dashed">
                        <Download className="h-4 w-4 text-muted-foreground" /> Download PDF Draft
                    </Button>
                </div>
            </div>
        </div>
    )
}
