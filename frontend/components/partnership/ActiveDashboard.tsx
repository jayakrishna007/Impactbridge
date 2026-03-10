"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    CheckCircle2, ChevronRight, FileText, Send, Paperclip,
    FileSearch, BarChart3, Clock, Lock, PenLine, FileUp, Camera, MessageSquare, Plus, Video, Activity
} from "lucide-react"

export function ActiveDashboard({
    partnership,
    user,
    proposal,
    entityLabel,
    handleOpenMou
}: {
    partnership: any,
    user: any,
    proposal: any,
    entityLabel: string,
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
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div className="h-6 w-6 rounded-full bg-emerald-500 ring-4 ring-white flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-xs font-medium text-emerald-700">Initial Meeting</span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center gap-2 z-10 w-24">
                            <div className="h-6 w-6 rounded-full bg-blue-600 ring-4 ring-blue-100 flex items-center justify-center animate-pulse shadow-[0_0_0_4px_rgba(37,99,235,0.2)]">
                                <FileSearch className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-xs font-bold text-blue-700 text-center leading-tight">Document Verification</span>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center gap-2 z-10 cursor-pointer group" onClick={handleOpenMou}>
                            <div className="h-6 w-6 rounded-full bg-white border-2 border-border group-hover:border-purple-300 ring-4 ring-white flex items-center justify-center transition-colors">
                                <PenLine className="h-3 w-3 text-muted-foreground group-hover:text-purple-600" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">MOU Signing</span>
                        </div>

                        {/* Step 5 */}
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div className="h-6 w-6 rounded-full bg-white border-2 border-border ring-4 ring-white flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">Fund Release</span>
                        </div>

                        {/* Step 6 */}
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div className="h-6 w-6 rounded-full bg-white border-2 border-border ring-4 ring-white flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">Tracking</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* ── Left Column ── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Current Step Card */}
                    <Card className="border-l-4 border-l-blue-600 shadow-sm overflow-hidden">
                        <CardHeader className="pb-3 bg-blue-50/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 mb-2">In Progress</Badge>
                                    <CardTitle className="text-lg">Current Step: Document Verification</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">Reviewing submitted documents before generating the MOU.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-foreground">4/5</p>
                                    <p className="text-xs text-muted-foreground">Submitted</p>
                                </div>
                            </div>
                            <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: "80%" }} />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 grid sm:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm p-2 rounded-md bg-secondary/30">
                                    <span className="flex items-center gap-2 text-foreground font-medium"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Trust Deed</span>
                                </div>
                                <div className="flex items-center justify-between text-sm p-2 rounded-md bg-secondary/30">
                                    <span className="flex items-center gap-2 text-foreground font-medium"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Bank Details</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm p-2 rounded-md bg-secondary/30">
                                    <span className="flex items-center gap-2 text-foreground font-medium"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 12A Certificate</span>
                                </div>
                                <div className="flex items-center justify-between text-sm p-2 rounded-md bg-blue-50 border border-blue-100">
                                    <span className="flex items-center gap-2 text-blue-800 font-medium"><Clock className="h-4 w-4 text-blue-500" /> FCRA Cert.</span>
                                    <Button size="sm" className="h-6 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2">Upload</Button>
                                </div>
                            </div>
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
                            <Button className="w-full justify-start gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleOpenMou}>
                                <PenLine className="h-4 w-4" /> View / Sign MOU
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

                    {/* Health Score */}
                    <Card className="shadow-sm border-emerald-100 bg-emerald-50/30">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center">
                                <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                                    <svg className="absolute w-full h-full transform -rotate-90">
                                        <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-emerald-100" />
                                        <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="276" strokeDashoffset="22" className="text-emerald-500 transition-all duration-1000 ease-out" />
                                    </svg>
                                    <div className="text-center">
                                        <span className="text-2xl font-bold text-emerald-700">92</span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-foreground mb-1">Partnership Health</h3>
                                <p className="text-xs text-muted-foreground text-center">Excellent responsiveness and document tracking.</p>
                            </div>
                            <div className="mt-5 space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-muted-foreground">Responsiveness</span>
                                    <span className="text-foreground">95%</span>
                                </div>
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-muted-foreground">Documents</span>
                                    <span className="text-foreground">80%</span>
                                </div>
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-muted-foreground">Timeline</span>
                                    <span className="text-foreground">100%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Log */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-2">
                                <Activity className="h-4 w-4" /> Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-1.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-secondary before:to-transparent">

                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-3 h-3 rounded-full bg-blue-500 border-2 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10" />
                                    <div className="w-[calc(100%-1.5rem)] pl-3 text-xs align-baseline border-b border-border pb-3 ml-2">
                                        <span className="font-bold text-foreground">Document Requested</span>
                                        <p className="text-muted-foreground">FCRA Certificate requested by Funder.</p>
                                        <span className="text-[10px] uppercase text-muted-foreground">2 hours ago</span>
                                    </div>
                                </div>

                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10" />
                                    <div className="w-[calc(100%-1.5rem)] pl-3 text-xs align-baseline border-b border-border pb-3 ml-2">
                                        <span className="font-bold text-foreground">Initial Meeting</span>
                                        <p className="text-muted-foreground">Virtual call completed.</p>
                                        <span className="text-[10px] uppercase text-muted-foreground">Yesterday</span>
                                    </div>
                                </div>

                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10" />
                                    <div className="w-[calc(100%-1.5rem)] pl-3 text-xs align-baseline ml-2">
                                        <span className="font-bold text-foreground">Partnership Confirmed</span>
                                        <p className="text-muted-foreground">Both parties accepted.</p>
                                        <span className="text-[10px] uppercase text-muted-foreground">3 days ago</span>
                                    </div>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
