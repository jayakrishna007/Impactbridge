"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    CheckCircle2, ChevronRight, FileText, Send, Paperclip,
    FileSearch, BarChart3, Clock, Lock, Unlock, PenLine, FileUp, Camera, MessageSquare, Plus, Video, Activity
} from "lucide-react"

export function ActiveDashboard({
    partnership,
    user,
    proposal,
    entityLabel,
    docs,
    docsVerified,
    onVerifyDocs,
    handleOpenMou
}: {
    partnership: any,
    user: any,
    proposal: any,
    entityLabel: string,
    docs: any[],
    docsVerified: boolean,
    onVerifyDocs: () => void,
    handleOpenMou: () => void
}) {
    const isFunder = user?.role === "funder"

    return (
        <div className="mx-auto max-w-5xl px-6 pt-8 pb-16 space-y-8 animate-in fade-in duration-500">

            {/* Step Tracker */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>Partnership Journey</h3>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1.5 border border-emerald-100">
                        <Activity className="h-3.5 w-3.5" /> Track 4381
                    </span>
                </div>

                <div className="relative mt-8">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 rounded-full" />
                    <div className="absolute top-1/2 left-0 w-[40%] h-1 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-1000" />

                    <div className="relative flex justify-between">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div className="h-6 w-6 rounded-full bg-emerald-500 ring-4 ring-white flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-xs font-medium text-emerald-700">Confirmation</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center gap-2 z-10 w-24">
                            <div className="h-6 w-6 rounded-full bg-blue-600 ring-4 ring-blue-100 flex items-center justify-center animate-pulse shadow-[0_0_0_4px_rgba(37,99,235,0.2)]">
                                <FileSearch className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-xs font-bold text-blue-700 text-center leading-tight">Document Verification</span>
                        </div>

                        {/* Step 3 */}
                        {docsVerified ? (
                            <div className="flex flex-col items-center gap-2 z-10 cursor-pointer group" onClick={handleOpenMou}>
                                <div className="h-6 w-6 rounded-full bg-white border-2 border-border group-hover:border-purple-300 ring-4 ring-white flex items-center justify-center transition-colors">
                                    <PenLine className="h-3 w-3 text-muted-foreground group-hover:text-purple-600" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">MOU Signing</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 z-10 opacity-60">
                                <div className="h-6 w-6 rounded-full bg-secondary border-2 border-border ring-4 ring-white flex items-center justify-center">
                                    <Lock className="h-3 w-3 text-muted-foreground" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">MOU Signing</span>
                            </div>
                        )}

                        {/* Step 4 */}
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div className="h-6 w-6 rounded-full bg-white border-2 border-border ring-4 ring-white flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">Fund Release</span>
                        </div>

                        {/* Step 5 */}
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div className="h-6 w-6 rounded-full bg-white border-2 border-border ring-4 ring-white flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">Reports Tracking</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* ── Left Column ── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Submitted Documents Viewer */}
                    <Card className="shadow-sm border-emerald-100 bg-white">
                        <CardHeader className="pb-3 bg-emerald-50/50">
                            <CardTitle className="text-sm uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-2">
                                <FileSearch className="h-4 w-4" /> Submitted Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            {docs.map((doc: any, index: number) => (
                                <div key={index} className="flex justify-between items-center bg-secondary/30 p-3 rounded-md border border-border">
                                    <div className="flex gap-3 min-w-0">
                                        <FileText className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">{doc.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{doc.sub}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="shrink-0 h-8 gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                        <ChevronRight className="h-3 w-3" /> View
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Partnership Chat */}
                    <Card className="shadow-sm flex flex-col h-[350px]">
                        <CardHeader className="py-3 border-b bg-muted/20">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                Partnership Chat
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 flex flex-col">
                            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50/50">
                                {/* Funder Message */}
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-blue-700">TT</span>
                                    </div>
                                    <div className="bg-white border rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Tata Trusts • {isFunder ? "You" : "Funder"}</p>
                                        <p className="text-sm text-foreground space-y-1">We've reviewed your trust deed. Looks great. Could you also share the FCRA certificate to proceed with the MOU?</p>
                                        <p className="text-[10px] text-muted-foreground text-right mt-1">10:30 AM</p>
                                    </div>
                                </div>
                                {/* Partner Message */}
                                <div className="flex gap-3 max-w-[85%] self-end flex-row-reverse ml-auto">
                                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-emerald-700">JK</span>
                                    </div>
                                    <div className="bg-primary text-primary-foreground border-primary rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
                                        <p className="text-xs font-semibold text-primary-foreground/70 mb-1 opacity-90">Jaya Krishna • {!isFunder ? "You" : "NGO"}</p>
                                        <p className="text-sm">Sure! Uploading it right now to the portal.</p>
                                        <p className="text-[10px] text-primary-foreground/70 text-right mt-1 opacity-90">11:15 AM</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border-t bg-white">
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="shrink-0"><Paperclip className="h-4 w-4" /></Button>
                                    <Input placeholder="Type a message..." className="flex-1" />
                                    <Button size="icon" className="shrink-0 bg-primary"><Send className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Right Column ── */}
                <div className="space-y-6">

                    {/* Quick Actions */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground font-bold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className={`w-full justify-start gap-2 ${docsVerified ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary cursor-not-allowed'}`} disabled={!docsVerified} onClick={docsVerified ? handleOpenMou : undefined}>
                                {docsVerified ? <PenLine className="h-4 w-4" /> : <Lock className="h-4 w-4" />} View / Sign MOU
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <FileUp className="h-4 w-4 text-muted-foreground" /> Upload Document
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Video className="h-4 w-4 text-muted-foreground" /> Schedule Meeting
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Camera className="h-4 w-4 text-muted-foreground" /> Post Field Update
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Next Stage Progression */}
                    <Card className="shadow-sm border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                        <CardHeader className="pb-2 text-center">
                            <div className="mx-auto h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                                {docsVerified ? <Unlock className="h-6 w-6 text-primary" /> : <Lock className="h-6 w-6 text-primary" />}
                            </div>
                            <CardTitle className="text-xl font-bold">MOU Agreement Stage</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {docsVerified
                                    ? "Document verification is complete. The MOU signing stage is now unlocked."
                                    : "Complete the ongoing document verification process to unlock the MOU Agreement stage."}
                            </p>
                            {!docsVerified ? (
                                <Button
                                    onClick={onVerifyDocs}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md"
                                    size="lg"
                                >
                                    Complete Document Verification
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleOpenMou}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md gap-2"
                                    size="lg"
                                >
                                    Proceed to MOU Agreement <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
