"use client"

import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useProposals } from "@/lib/proposals-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft, MapPin, Calendar, Building, Users,
    Handshake, ChevronRight
} from "lucide-react"
import Link from "next/link"

export default function CSRProjectDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const { csrProjects } = useProposals()

    const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : ''
    const project = csrProjects.find(p => p.id === id)

    if (!project) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex flex-1 items-center justify-center p-6 text-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">Project Not Found</h2>
                        <p className="text-muted-foreground mb-6">The CSR project you are looking for does not exist or has been removed.</p>
                        <Button onClick={() => router.back()}>Go Back</Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

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
                            <Badge className="bg-primary/20 text-primary hover:bg-primary/20">{project.status}</Badge>
                            <span className="text-sm font-medium text-muted-foreground">{project.category}</span>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="flex items-center text-sm font-medium text-muted-foreground">
                                <MapPin className="mr-1 h-3.5 w-3.5" /> {project.location}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                            {project.title}
                        </h1>
                        <p className="text-lg text-muted-foreground flex items-center">
                            Funded By <span className="font-semibold text-foreground ml-1">{project.funder}</span>
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="mx-auto max-w-4xl px-6 mt-8">
                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Main Details */}
                        <div className="md:col-span-2 space-y-8">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Project Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {project.description}
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed mt-4">
                                        This corporate social responsibility project focuses on widespread, scalable impact.
                                        By leveraging corporate resources and strategic partnerships, the initiative aims to
                                        create sustained improvements in the target region. The project includes rigorous
                                        monitoring and evaluation frameworks to ensure funds are utilized effectively
                                        and tangible outcomes are achieved.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Impact & Scale</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{project.beneficiaries} Beneficiaries</p>
                                            <p className="text-sm text-muted-foreground">Target demographic reach</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <Calendar className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Timeline target</p>
                                            <p className="text-sm text-muted-foreground">End date: {project.deadline}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Fund Progress */}
                            <Card className="shadow-sm border-primary/20">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Disbursed: <span className="font-medium text-foreground">{project.raised}</span></span>
                                        <span className="text-muted-foreground">Budget: <span className="font-medium text-foreground">{project.target}</span></span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-secondary mb-2">
                                        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${project.progress}%` }} />
                                    </div>
                                    <p className="text-xs text-right text-muted-foreground mb-4">{project.progress}% of budget utilized</p>
                                    <div className="text-center p-3 bg-blue-50/50 rounded-md border border-blue-100">
                                        <p className="text-sm text-blue-700 font-medium">
                                            Status: {project.status}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            This project is currently active and being monitored.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Funder Details */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Funder Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                            <Building className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{project.funder}</p>
                                            <p className="text-xs text-muted-foreground">Corporate Partner</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Fund this Project — visible to logged-in funders only */}
                            {user?.role === "funder" && (
                                <Card className="shadow-sm border-2 border-emerald-200 bg-emerald-50/30">
                                    <CardContent className="p-5 flex flex-col gap-3 text-center">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                                            <Handshake className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <p className="font-semibold text-foreground">Interested in this project?</p>
                                        <p className="text-xs text-muted-foreground">
                                            Browse our proposals to find the right partner and start the funding journey.
                                        </p>
                                        <Button
                                            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                            asChild
                                        >
                                            <Link href="/companies-list">
                                                Browse Proposals <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
