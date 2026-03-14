"use client"

import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useProposals } from "@/lib/proposals-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Calendar, HeartPulse, GraduationCap, Building, Target, BookOpen, Users, IndianRupee, Landmark, Globe, Phone, ExternalLink, Award, Star, ShieldCheck, CalendarDays, FileSearch, PenLine, BarChart3, CheckCircle2, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { apiGetUser } from "@/lib/api"
import Link from "next/link"


export default function NGOProposalDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const { ngoProposals } = useProposals()
    const [ngoUser, setNgoUser] = useState<any>(null)

    // Safety check for params type
    const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : ''

    const proposal = ngoProposals.find(p => p.id === id)

    useEffect(() => {
        async function fetchNgoUser() {
            if (proposal) {
                try {
                    // Pull full profile using createdBy string
                    if (proposal.createdBy) {
                        const fetchedUser = await apiGetUser(proposal.createdBy)
                        if (fetchedUser) {
                            setNgoUser(fetchedUser)
                            return
                        }
                    }
                } catch (error) {
                    console.warn("Failed to fetch NGO profile from back-end, attempting local storage fallback:", error)
                }

                // Try to find the actual NGO user in our "DB"
                const allUsersRaw = localStorage.getItem("impactbridge_all_users")
                if (allUsersRaw) {
                    const allUsers = JSON.parse(allUsersRaw)
                    const found = allUsers.find((u: any) => u.name === proposal.ngoName && u.role === 'ngo')
                    if (found) {
                        setNgoUser(found)
                    }
                }
            }
        }

        fetchNgoUser()
    }, [proposal])

    if (!proposal) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex flex-1 items-center justify-center p-6 text-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">Proposal Not Found</h2>
                        <p className="text-muted-foreground mb-6">The project proposal you are looking for does not exist or has been removed.</p>
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
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>

                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge className="bg-primary/20 text-primary hover:bg-primary/20">{proposal.status}</Badge>
                            <span className="text-sm font-medium text-muted-foreground">{proposal.category}</span>
                            <span className="text-muted-foreground/40">â€¢</span>
                            <span className="flex items-center text-sm font-medium text-muted-foreground">
                                <MapPin className="mr-1 h-3.5 w-3.5" /> {proposal.location}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                            {proposal.title}
                        </h1>
                        <p className="text-lg text-muted-foreground flex items-center">
                            By <span className="font-semibold text-foreground ml-1">{proposal.ngoName}</span>
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="mx-auto max-w-4xl px-6 -mt-8">
                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Main Details */}
                        <div className="md:col-span-2 space-y-8">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Project Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {proposal.description}
                                    </p>
                                    {/* Additional generated dummy details since the global state only holds a short description */}
                                    <p className="text-muted-foreground leading-relaxed mt-4">
                                        This initiative targets highly underserved areas lacking standard educational resources.
                                        By providing modern learning tools and empowering local educators, we aim to build a
                                        sustainable foundation for lifelong learning. The implementation strategy involves extensive
                                        community engagement to ensure the project meets the specific needs of the beneficiaries.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Impact Goals</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{proposal.beneficiaries}+ Students</p>
                                            <p className="text-sm text-muted-foreground">Direct beneficiaries</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <Target className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Long-term Outcomes</p>
                                            <p className="text-sm text-muted-foreground">Increased literacy & retention</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <Calendar className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Project Timeline</p>
                                            <p className="text-sm text-muted-foreground">Expected end: {proposal.deadline}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card className="shadow-sm border-primary/20">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Raised: <span className="font-medium text-foreground">{proposal.fundingRaised}</span></span>
                                        <span className="text-muted-foreground">Goal: <span className="font-medium text-foreground">{proposal.fundingRequired}</span></span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-secondary mb-2">
                                        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${proposal.progress}%` }} />
                                    </div>
                                    <p className="text-xs text-right text-muted-foreground mb-6">{proposal.progress}% funded</p>

                                    {user?.role === 'funder' ? (
                                        <Button asChild className="w-full font-bold h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform hover:scale-105">
                                            <Link href={`/partnership/ngo/${proposal.id}`}>
                                                Fund Proposal
                                            </Link>
                                        </Button>
                                    ) : (
                                        <div className="text-center p-3 bg-secondary/50 rounded-md border border-border">
                                            <p className="text-sm text-muted-foreground">
                                                Log in as a Funder company to commit funds to this proposal.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Organization Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary">
                                            <Building className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{proposal.ngoName}</p>
                                            <p className="text-xs text-muted-foreground">Verified NGO Partner</p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full">View NGO Profile</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-bold">{proposal.ngoName}</DialogTitle>
                                                    <DialogDescription>
                                                        Official Organization Profile & Portfolio
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="grid gap-6 py-4">
                                                    {ngoUser?.portfolio ? (
                                                        <>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <h4 className="text-sm font-bold uppercase text-muted-foreground mb-1">About the NGO</h4>
                                                                    <p className="text-sm leading-relaxed">{ngoUser.portfolio.about}</p>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h4 className="text-sm font-bold uppercase text-muted-foreground mb-1">Mission</h4>
                                                                        <p className="text-sm leading-relaxed">{ngoUser.portfolio.mission}</p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-bold uppercase text-muted-foreground mb-1">Vision</h4>
                                                                        <p className="text-sm leading-relaxed">{ngoUser.portfolio.vision}</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-bold uppercase text-muted-foreground mb-1">Experience</h4>
                                                                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                                                        {ngoUser.portfolio.experience}
                                                                    </Badge>
                                                                </div>
                                                            </div>

                                                            <div className="border-t pt-4 space-y-3">
                                                                <h4 className="text-sm font-bold uppercase text-muted-foreground">Contact Information</h4>
                                                                <div className="grid gap-2">
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <Globe className="h-4 w-4 text-primary" />
                                                                        <a href={ngoUser.portfolio.contact?.website} target="_blank" className="text-blue-600 hover:underline">
                                                                            {ngoUser.portfolio.contact?.website || "Website not provided"}
                                                                        </a>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <Phone className="h-4 w-4 text-primary" />
                                                                        <span>{ngoUser.portfolio.contact?.phone || "Phone not provided"}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <MapPin className="h-4 w-4 text-primary" />
                                                                        <span>{ngoUser.portfolio.contact?.address || "Address not provided"}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <Building className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                                                            <p className="text-muted-foreground">Detailed portfolio information for this organization is currently being verified.</p>
                                                            <p className="text-sm text-muted-foreground mt-2 italic">General verification status: Active</p>
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
                </div >
            </main >
            <Footer />
        </div >
    )
}
