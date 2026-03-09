"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, LineChart, FileSearch, ClipboardCheck, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function ServicesPage() {
    const { user } = useAuth()
    const router = useRouter()

    if (user?.role !== 'funder') {
        return (
            <div className="flex min-h-screen flex-col bg-background">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <ShieldCheck className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        This section is exclusively reserved for our CSR funding partners.
                        Please log in with a funder account to view our premium CSR services.
                    </p>
                    <Button onClick={() => router.push("/")}>Return to Home</Button>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1 bg-background">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-primary/5 py-16 md:py-24 border-b border-border">
                    <div className="mx-auto max-w-7xl px-6 relative z-10 flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                            <LineChart className="w-4 h-4" />
                            <span>Professional Services</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground max-w-4xl" style={{ fontFamily: "var(--font-heading)" }}>
                            Impact <span className="text-primary">Assessment</span> Services
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl text-balance">
                            Ensure regulatory compliance and measure the true social return on your CSR investments with our independent impact assessment reporting.
                        </p>
                    </div>
                </section>

                {/* What is Impact Assessment? */}
                <section className="py-16 md:py-24 px-6">
                    <div className="mx-auto max-w-4xl space-y-12">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>What is an Impact Assessment?</h2>
                            <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-8"></div>
                        </div>

                        <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground leading-relaxed">
                            <p>
                                Under recent amendments to corporate social responsibility regulations, large corporations are mandated to undertake an independent impact assessment for specific scale CSR projects.
                            </p>
                            <p>
                                An Impact Assessment is an objective evaluation of a project's social, economic, and environmental effects. It answers the fundamental question: <em>Did our funding actually create the change we intended?</em>
                            </p>

                            <Card className="my-10 bg-secondary/30 border-primary/20">
                                <CardContent className="p-8 grid md:grid-cols-2 gap-8 items-center text-left">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                                            <FileSearch className="w-5 h-5 text-primary" /> Key Objectives
                                        </h3>
                                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                            <li>Evaluate project sustainability</li>
                                            <li>Measure intended vs. actual outcomes</li>
                                            <li>Understand community satisfaction</li>
                                            <li>Identify areas for course correction</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                                            <ClipboardCheck className="w-5 h-5 text-primary" /> Why Choose Us
                                        </h3>
                                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                            <li>Independent 3rd party auditing</li>
                                            <li>Data-driven metric tracking</li>
                                            <li>Detailed final compliance reports</li>
                                            <li>End-to-end site visits & interviews</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <p>
                                Our team of seasoned researchers and social auditors travel directly to your project sites. We conduct household surveys with beneficiaries, verify documentation provided by implementing NGOs, and deploy analytical frameworks to map out quantitative social returns.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-primary/5 py-16 px-6 relative border-t border-border">
                    <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
                        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Schedule an Assessment</h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-2xl text-balance">
                            Connect with our auditing experts to build a tailored impact assessment timeline for your organization's CSR portfolio.
                        </p>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="lg" className="font-bold gap-2 text-md h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:scale-105 px-8">
                                    Schedule Consultation <ArrowRight className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md text-center p-8">
                                <DialogHeader>
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                                        <ShieldCheck className="h-8 w-8" />
                                    </div>
                                    <DialogTitle className="text-2xl font-bold mb-2">Request Received</DialogTitle>
                                    <DialogDescription className="text-base">
                                        Thank you for your interest in our Impact Assessment services.
                                        Our auditing team has been notified and will contact you shortly to schedule an introductory consultation call.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-6">
                                    <Button className="w-full" asChild>
                                        <Link href="/services">Close</Link>
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
