"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
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
    onSendMessage,
    handleOpenMou
}: {
    partnership: any,
    user: any,
    proposal: any,
    entityLabel: string,
    docs: any[],
    docsVerified: boolean,
    onVerifyDocs: () => void,
    onSendMessage: (msg: any) => void,
    handleOpenMou: () => void
}) {
    const isFunder = user?.role === "funder"

    const [meetingDate, setMeetingDate] = useState("")
    const [meetingHour, setMeetingHour] = useState("10")
    const [meetingMin, setMeetingMin] = useState("00")
    const [meetingAmPm, setMeetingAmPm] = useState("AM")
    const [meetingSubject, setMeetingSubject] = useState(`Intro Call - ${proposal?.title || "Partnership"}`)
    const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false)
    const [isUnlockDialogOpen, setIsUnlockDialogOpen] = useState(false)

    // Chat State sync
    const messages = partnership?.messages || []
    const [newMessage, setNewMessage] = useState("")
    const chatEndRef = React.useRef<HTMLDivElement>(null)

    const handleSendMessage = () => {
        if (!newMessage.trim()) return

        const now = new Date()
        let hour = now.getHours()
        const ampm = hour >= 12 ? 'PM' : 'AM'
        hour = hour % 12 || 12
        const minute = now.getMinutes().toString().padStart(2, '0')

        const senderRole = isFunder ? "funder" : "partner"
        const senderName = isFunder ? (partnership?.funderName || "Funder") : (partnership?.partnerName || "Partner")
        
        const newMsg = {
            sender: senderRole,
            name: senderName,
            initials: (senderName[0] || "U").toUpperCase(),
            text: newMessage,
            time: `${hour}:${minute} ${ampm}`,
        }

        onSendMessage(newMsg)
        setNewMessage("")
        
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage()
        }
    }

    const handleScheduleMeeting = () => {
        if (!meetingDate || !meetingSubject) {
            alert("Please fill in Date and Subject.")
            return
        }

        try {
            let hour24 = parseInt(meetingHour, 10)
            if (meetingAmPm === "PM" && hour24 !== 12) hour24 += 12
            if (meetingAmPm === "AM" && hour24 === 12) hour24 = 0
            const timeStr = `${hour24.toString().padStart(2, "0")}:${meetingMin}:00`

            const startDate = new Date(`${meetingDate}T${timeStr}`)
            const endDate = new Date(startDate.getTime() + 45 * 60000) // 45 min duration

            const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "")

            const details = `Meeting regarding ImpactBridge proposal: ${proposal?.title || ""}\n\nPartner: ${entityLabel}\n\nImportant: Please click "Add Google Meet video conferencing" inside Google Calendar to automatically attach a meeting link before saving.`

            // Autofill both Funder and NGO/Beneficiary emails
            const guests = [partnership?.funderEmail, partnership?.partnerEmail].filter(Boolean).join(",")

            const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meetingSubject)}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${encodeURIComponent(details)}&add=${encodeURIComponent(guests)}`

            window.open(url, "_blank")
        } catch (error) {
            alert("Invalid date or time.")
        }
    }

    return (
        <div className="mx-auto max-w-5xl px-6 pt-8 pb-16 space-y-8 animate-in fade-in duration-500">

            {/* Step Tracker */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-2xl" style={{ fontFamily: "var(--font-heading)" }}>Partnership Journey</h3>
                    <span className="text-sm font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-2 border border-emerald-200">
                        <Activity className="h-4 w-4" /> Track 4381
                    </span>
                </div>

                <div className="relative mt-8">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 rounded-full" />
                    <div className="absolute top-1/2 left-0 w-[40%] h-1 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-1000" />

                    <div className="relative flex justify-between">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div className="h-8 w-8 rounded-full bg-emerald-500 ring-4 ring-white flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-sm font-bold text-emerald-700 mt-1">Confirmation</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center gap-2 z-10 w-28">
                            <div className="h-8 w-8 rounded-full bg-blue-600 ring-4 ring-blue-100 flex items-center justify-center animate-pulse shadow-[0_0_0_4px_rgba(37,99,235,0.2)]">
                                <FileSearch className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-extrabold text-blue-700 text-center leading-tight mt-1">Document Verification</span>
                        </div>

                        {/* Step 3 */}
                        {docsVerified ? (
                            <div className="flex flex-col items-center gap-2 z-10 cursor-pointer group" onClick={handleOpenMou}>
                                <div className="h-8 w-8 rounded-full bg-white border-2 border-border group-hover:border-purple-300 ring-4 ring-white flex items-center justify-center transition-colors">
                                    <PenLine className="h-4 w-4 text-muted-foreground group-hover:text-purple-600" />
                                </div>
                                <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground mt-1">MOU Signing</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 z-10 opacity-60">
                                <div className="h-8 w-8 rounded-full bg-secondary border-2 border-border ring-4 ring-white flex items-center justify-center">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-sm font-bold text-muted-foreground mt-1">MOU Signing</span>
                            </div>
                        )}

                        {/* Step 4 */}
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div className="h-8 w-8 rounded-full bg-white border-2 border-border ring-4 ring-white flex items-center justify-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                            </div>
                            <span className="text-sm font-bold text-muted-foreground mt-1">Fund Release</span>
                        </div>

                        {/* Step 5 */}
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div className="h-8 w-8 rounded-full bg-white border-2 border-border ring-4 ring-white flex items-center justify-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                            </div>
                            <span className="text-sm font-bold text-muted-foreground mt-1">Reports Tracking</span>
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
                            <CardTitle className="text-lg uppercase tracking-wider text-emerald-800 font-extrabold flex items-center gap-2">
                                <FileSearch className="h-5 w-5" /> Submitted Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {docs.map((doc: any, index: number) => (
                                <div key={index} className="flex justify-between items-center bg-secondary/30 p-4 rounded-lg border border-border">
                                    <div className="flex gap-4 min-w-0">
                                        <FileText className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                                        <div className="min-w-0">
                                            <p className="text-base font-bold text-foreground truncate">{doc.name}</p>
                                            <p className="text-sm font-medium text-muted-foreground truncate">{doc.sub}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="shrink-0 h-10 gap-2 text-sm font-bold text-indigo-700 hover:text-indigo-800 hover:bg-indigo-100 px-4">
                                        <ChevronRight className="h-4 w-4" /> View
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Partnership Chat */}
                    <Card className="shadow-sm flex flex-col h-[400px]">
                        <CardHeader className="py-4 border-b bg-muted/20">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                Partnership Chat
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 flex flex-col">
                            <div className="flex-1 p-5 space-y-5 overflow-y-auto bg-slate-50/50">
                                {messages.map((msg: any, idx: number) => {
                                    const isSelf = isFunder ? msg.sender === "funder" : msg.sender === "partner"
                                    
                                    return isSelf ? (
                                        <div key={idx} className="flex gap-4 max-w-[85%] self-end flex-row-reverse ml-auto">
                                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                <span className="text-sm font-bold text-emerald-700">{msg.initials}</span>
                                            </div>
                                            <div className="bg-primary text-primary-foreground border-primary rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm">
                                                <p className="text-sm font-bold text-primary-foreground/80 mb-1">{msg.name} • You</p>
                                                <p className="text-base text-white font-medium break-words">{msg.text}</p>
                                                <p className="text-xs font-semibold text-primary-foreground/80 text-right mt-2">{msg.time}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={idx} className="flex gap-4 max-w-[85%]">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                <span className="text-sm font-bold text-blue-700">{msg.initials}</span>
                                            </div>
                                            <div className="bg-white border rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm">
                                                <p className="text-sm font-bold text-muted-foreground mb-1">{msg.name} • {msg.sender === "funder" ? "Funder" : "Partner"}</p>
                                                <p className="text-base text-foreground space-y-1 break-words">{msg.text}</p>
                                                <p className="text-xs font-semibold text-muted-foreground text-right mt-2">{msg.time}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div ref={chatEndRef} />
                            </div>
                            <div className="p-4 border-t bg-white">
                                <div className="flex gap-3">
                                    <Button variant="outline" size="icon" className="shrink-0 h-12 w-12"><Paperclip className="h-5 w-5" /></Button>
                                    <Input 
                                        placeholder="Type a message..." 
                                        className="flex-1 h-12 text-base font-medium" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <Button onClick={handleSendMessage} size="icon" className="shrink-0 bg-primary h-12 w-12 hover:bg-primary/90">
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Right Column ── */}
                <div className="space-y-6">

                    {/* Quick Actions */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg uppercase tracking-wider text-muted-foreground font-extrabold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className={`w-full justify-start gap-3 h-12 text-base font-bold ${docsVerified ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary cursor-not-allowed'}`} disabled={!docsVerified} onClick={docsVerified ? handleOpenMou : undefined}>
                                {docsVerified ? <PenLine className="h-5 w-5" /> : <Lock className="h-5 w-5" />} View / Sign MOU
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-3 h-12 text-base font-bold border-2">
                                <FileUp className="h-5 w-5 text-muted-foreground" /> Upload Document
                            </Button>
                            <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-3 h-12 text-base font-bold border-2 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                                    onClick={() => setIsMeetingDialogOpen(true)}
                                >
                                    <Video className="h-5 w-5 text-blue-600" /> Schedule Meeting
                                </Button>
                                <DialogContent className="sm:max-w-md p-6">
                                    <DialogHeader>
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 mb-4">
                                            <Video className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <DialogTitle className="text-center text-2xl font-black">Schedule Google Meet</DialogTitle>
                                        <DialogDescription className="text-center text-base text-muted-foreground mt-2">
                                            Pick a time to generate a Google Calendar event.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-5 mt-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Meeting Subject</label>
                                            <Input className="h-11 text-base font-medium" value={meetingSubject} onChange={e => setMeetingSubject(e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Date</label>
                                                <Input className="h-11 text-base font-medium" type="date" value={meetingDate} onChange={e => setMeetingDate(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Time</label>
                                                <div className="flex gap-2">
                                                    <select
                                                        className="flex h-11 w-full rounded-md border-2 border-input bg-transparent px-3 py-1 text-base font-bold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                        value={meetingHour}
                                                        onChange={e => setMeetingHour(e.target.value)}
                                                    >
                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                                                            <option key={h} value={h.toString().padStart(2, "0")}>{h}</option>
                                                        ))}
                                                    </select>
                                                    <span className="self-center font-bold text-lg text-muted-foreground">:</span>
                                                    <select
                                                        className="flex h-11 w-full rounded-md border-2 border-input bg-transparent px-3 py-1 text-base font-bold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                        value={meetingMin}
                                                        onChange={e => setMeetingMin(e.target.value)}
                                                    >
                                                        {["00", "15", "30", "45"].map(m => (
                                                            <option key={m} value={m}>{m}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        className="flex h-11 w-full rounded-md border-2 border-input bg-transparent px-3 py-1 text-base font-bold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                        value={meetingAmPm}
                                                        onChange={e => setMeetingAmPm(e.target.value)}
                                                    >
                                                        <option value="AM">AM</option>
                                                        <option value="PM">PM</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <Button className="w-full gap-3 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-sm" onClick={handleScheduleMeeting}>
                                                <Video className="h-5 w-5" /> Open in Google Calendar
                                            </Button>
                                            <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed font-medium">
                                                Make sure to click <strong className="text-primary font-black">"Add Google Meet video conferencing"</strong> in Calendar before saving.
                                            </p>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button variant="outline" className="w-full justify-start gap-3 h-12 text-base font-bold border-2">
                                <Camera className="h-5 w-5 text-muted-foreground" /> Post Field Update
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Next Stage Progression */}
                    <Card className="shadow-sm border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                        <CardHeader className="pb-3 text-center">
                            <div className="mx-auto h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                                {docsVerified ? <Unlock className="h-8 w-8 text-primary" /> : <Lock className="h-8 w-8 text-primary" />}
                            </div>
                            <CardTitle className="text-2xl font-black text-foreground">MOU Agreement Stage</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-5">
                            <p className="text-base font-medium text-muted-foreground text-pretty">
                                {docsVerified
                                    ? "Document verification is complete. The MOU signing stage is now unlocked."
                                    : "Complete the ongoing document verification process to unlock the MOU Agreement stage."}
                            </p>
                            {!docsVerified ? (
                                <Dialog open={isUnlockDialogOpen} onOpenChange={setIsUnlockDialogOpen}>
                                    <Button
                                        onClick={() => setIsUnlockDialogOpen(true)}
                                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-md"
                                        size="lg"
                                    >
                                        Unlock MOU
                                    </Button>
                                    <DialogContent className="sm:max-w-md p-6">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-black">Unlock MOU</DialogTitle>
                                            <DialogDescription className="text-base text-muted-foreground mt-2">
                                                Are you sure you want to Unlock MOU? Unlocking MOU means Due Diligence is over between you and your partner.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-end gap-3 mt-6">
                                            <Button variant="outline" onClick={() => setIsUnlockDialogOpen(false)} className="font-bold">
                                                No
                                            </Button>
                                            <Button 
                                                onClick={() => {
                                                    setIsUnlockDialogOpen(false)
                                                    onVerifyDocs()
                                                }} 
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                                            >
                                                Yes
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <Button
                                    onClick={handleOpenMou}
                                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md gap-2"
                                    size="lg"
                                >
                                    Proceed to MOU Agreement <ChevronRight className="h-5 w-5" />
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
