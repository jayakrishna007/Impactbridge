"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ChevronLeft, ShieldCheck, PenLine, Download, UploadCloud, FileUp, FileText, AlertCircle, ChevronRight } from "lucide-react"
import { apiSignMou, apiUploadMou } from "@/lib/api"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function MouSigning({
    partnership,
    user,
    proposal,
    entityLabel,
    handleCloseMou,
    handleOpenFundRelease,
    updatePartnership
}: {
    partnership: any,
    user: any,
    proposal: any,
    entityLabel: string,
    handleCloseMou: () => void,
    handleOpenFundRelease: () => void,
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

    const mouUploaded = partnership?.mouUploaded || false

    const [isSigning, setIsSigning] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [agreedTerms, setAgreedTerms] = useState(false)
    const [agreedUnderstood, setAgreedUnderstood] = useState(false)

    const canProceed = agreedTerms && agreedUnderstood

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            // Wait a brief moment to simulate upload for better UX
            await new Promise(resolve => setTimeout(resolve, 1500))
            const updated = await apiUploadMou(partnership.id)
            updatePartnership(updated)
        } catch (error) {
            console.error("Upload failed", error)
        } finally {
            setIsUploading(false)
        }
    }

    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

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
                    {!mouUploaded ? (
                        <Card className="border border-dashed shadow-sm text-center py-20 bg-secondary/10">
                            <CardContent className="space-y-4 flex flex-col items-center">
                                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                    <FileUp className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold">Custom MOU Required</h3>
                                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                    {isFunder
                                        ? "Please upload your organization's official Memorandum of Understanding PDF for the partner to review and sign."
                                        : "Waiting for the funder to upload their organization's official Memorandum of Understanding..."}
                                </p>
                                {isFunder && (
                                    <div className="mt-4 flex flex-col items-center">
                                        <input 
                                            type="file" 
                                            accept=".pdf" 
                                            className="hidden" 
                                            ref={fileInputRef} 
                                            onChange={handleUpload} 
                                        />
                                        <Button onClick={triggerFileInput} disabled={isUploading} className="bg-blue-600 hover:bg-blue-700 gap-2">
                                            <UploadCloud className="h-4 w-4" />
                                            {isUploading ? "Uploading..." : "Upload Official MOU (PDF)"}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border shadow-md" style={{ background: "#fffffe" }}>
                            <CardContent className="p-8 sm:p-12 space-y-8 font-serif">
                                <div className="text-center space-y-2 border-b pb-6">
                                    <h2 className="text-2xl font-bold uppercase tracking-wider">Official Memorandum of Understanding</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Uploaded by {partnership.funderName} on {partnership.mouUploadedAt ? new Date(partnership.mouUploadedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="bg-secondary/20 border border-border rounded-lg p-16 flex flex-col items-center justify-center text-center font-sans">
                                    <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                                    <h3 className="text-lg font-bold text-foreground">mou_agreement_final.pdf</h3>
                                    <p className="text-sm text-muted-foreground mt-2">Customized terms • {Math.floor(Math.random() * 5) + 3} Pages</p>
                                    <Button variant="outline" className="mt-6 gap-2 border-dashed bg-white">
                                        <Download className="h-4 w-4" /> Download to Review
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Checkboxes for Terms & Understanding */}
                    <div className={`bg-white border rounded-xl p-5 space-y-4 shadow-sm ${!mouUploaded ? "opacity-50 pointer-events-none grayscale" : ""}`}>
                        <h3 className="text-sm font-bold text-foreground">Required Acknowledgements</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="terms"
                                    checked={agreedTerms}
                                    onCheckedChange={(checked) => setAgreedTerms(checked === true)}
                                    className="mt-1"
                                />
                                <Label htmlFor="terms" className="text-sm font-medium leading-tight text-muted-foreground cursor-pointer">
                                    I have read and agree to the <span className="text-primary font-bold">Terms and Conditions</span>.
                                </Label>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="understood"
                                    checked={agreedUnderstood}
                                    onCheckedChange={(checked) => setAgreedUnderstood(checked === true)}
                                    className="mt-1"
                                />
                                <Label htmlFor="understood" className="text-sm font-medium leading-tight text-muted-foreground cursor-pointer">
                                    I understand that this is a legally binding agreement governing the release of funds and reporting obligations.
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Signature Boxes */}
                    <div className={`grid sm:grid-cols-2 gap-6 ${(!mouUploaded) ? "opacity-50 pointer-events-none grayscale" : ""}`}>
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
                                        <div className="mt-2 text-center">
                                            {!signatures.partner ? (
                                                <p className="text-sm text-amber-600 mb-2 font-bold bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
                                                    Waiting for {entityLabel} to sign first.
                                                </p>
                                            ) : (
                                                <>
                                                    {!canProceed && (
                                                        <p className="text-[10px] text-amber-600 mb-2 font-medium flex items-center justify-center gap-1.5">
                                                            <AlertCircle className="h-3 w-3" /> Accept required terms above to sign.
                                                        </p>
                                                    )}
                                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold h-10 gap-2" onClick={handleSign} disabled={isSigning || !canProceed}>
                                                        <PenLine className="h-4 w-4" /> Sign Agreement
                                                    </Button>
                                                </>
                                            )}
                                        </div>
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
                                        <div className="mt-2 text-center">
                                            {!canProceed && (
                                                <p className="text-[10px] text-amber-600 mb-2 font-medium flex items-center justify-center gap-1.5">
                                                    <AlertCircle className="h-3 w-3" /> Accept required terms above to sign.
                                                </p>
                                            )}
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold h-10 gap-2" onClick={handleSign} disabled={isSigning || !canProceed}>
                                                <PenLine className="h-4 w-4" /> Sign Agreement
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Both Signed Success Area & Next Steps */}
                    {signatures.funder && signatures.partner && (
                        <div className="mt-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                            <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                                <ShieldCheck className="w-48 h-48" />
                            </div>
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <CheckCircle2 className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black">MOU Fully Executed</h3>
                                </div>
                                <p className="text-emerald-50 text-sm max-w-xl leading-relaxed">
                                    This partnership agreement is now legally binding and active. The next stage is Fund Release and Reporting configuration.
                                </p>
                            </div>
                            <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <Button 
                                    variant="outline" 
                                    onClick={handleCloseMou}
                                    className="bg-transparent border-white/30 text-white hover:bg-white/10 font-bold"
                                >
                                    Later
                                </Button>
                                <Button 
                                    onClick={handleOpenFundRelease}
                                    className="bg-white text-emerald-700 hover:bg-white/90 font-black shadow-md flex items-center gap-2"
                                >
                                    Proceed to Funding & Reports <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
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
