"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useProposals } from "@/lib/proposals-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AlertCircle, ArrowLeft, Upload, CheckCircle2, ChevronRight, ChevronLeft, Building2, Target, DollarSign, FileText, BookOpen } from "lucide-react"
import Link from "next/link"

const STEPS = [
    { id: 1, title: "Basic Information", icon: Building2 },
    { id: 2, title: "Project Details", icon: Target },
    { id: 3, title: "Funding & Financials", icon: DollarSign },
    { id: 4, title: "Supporting Documents", icon: FileText },
]

interface NGOFormData {
    orgName?: string
    projTitle?: string
    totalBudget?: string | number
    geography?: string
    projObjectives?: string
    regDetails?: string
    orgEmail?: string
    orgPhone?: string
    expEducation?: string
    targetGroup?: string
    expectedOutcomes?: string
    monitoringPlan?: string
    projectDuration?: string
    costBreakdown?: string
    disbursementPlan?: string
    finSustainability?: string
    [key: string]: any
}

export default function CreateProposalPage() {
    const { user, isLoading } = useAuth()
    const { addNgoProposal } = useProposals()
    const router = useRouter()

    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [formData, setFormData] = useState<NGOFormData>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    // Guard clause
    if (isLoading) return null

    if (!user || user.role !== "ngo") {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex flex-1 items-center justify-center px-6">
                    <div className="text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                        <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>Access Denied</h1>
                        <p className="text-muted-foreground mb-6">You must be logged in as an NGO to view this page.</p>
                        <Button asChild>
                            <Link href="/login">Return to Login</Link>
                        </Button>
                    </div>
                </main>
            </div>
        )
    }

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (currentStep !== 4) {
            nextStep()
            return
        }

        setIsSubmitting(true)

        try {
            // Create new proposal with properly typed data
            const newProposal: Omit<any, 'id' | 'fundingRaised' | 'progress' | 'status'> = {
                ngoName: formData.orgName || user?.name || "Unknown NGO",
                title: formData.projTitle || "New Education Project",
                category: formData.category || "Primary Education",
                fundingRequired: `₹${(Number(formData.totalBudget) || 0).toLocaleString()}`,
                location: formData.geography || "Pan India",
                deadline: "Dec 31, 2026",
                description: formData.projObjectives || "A new initiative to drive educational impact.",
                beneficiaries: 1000,
                createdBy: user?.email || "",
                fullDetails: {
                    regDetails: formData.regDetails,
                    orgEmail: formData.orgEmail,
                    orgPhone: formData.orgPhone,
                    expEducation: formData.expEducation,
                    targetGroup: formData.targetGroup,
                    expectedOutcomes: formData.expectedOutcomes,
                    monitoringPlan: formData.monitoringPlan,
                    projectDuration: formData.projectDuration,
                    costBreakdown: formData.costBreakdown,
                    disbursementPlan: formData.disbursementPlan,
                    finSustainability: formData.finSustainability,
                }
            }

            await addNgoProposal(newProposal)

            setIsSuccess(true)

            // Redirect back to proposals list after success
            setTimeout(() => {
                router.push("/ngo-proposal")
            }, 2000)
        } catch (error) {
            console.error("Failed to create proposal:", error)
            setIsSubmitting(false)
            // Could show error toast here
        }
    }

    // Custom File Upload Component helper
    const FileUploadInput = ({ id, label, helpText }: { id: string, label: string, helpText?: string }) => (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor={id} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-secondary/10 hover:bg-secondary/30 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                        <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">{helpText || "PDF, DOCX, or PPT (MAX. 10MB)"}</p>
                    </div>
                    <input id={id} type="file" className="hidden" />
                </label>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 bg-secondary/20 px-4 py-8 md:px-6 md:py-12">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8">
                        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                            <Link href="/ngo-proposal">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Proposals
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                            Submit an Education Project Proposal
                        </h1>
                        <p className="mt-2 text-muted-foreground bg-primary/5 border border-primary/20 p-3 rounded-md text-sm inline-block">
                            Logged in as Implementing Agency: <strong>{user.name}</strong>
                        </p>
                    </div>

                    <Card className="border-border bg-card shadow-sm overflow-hidden">
                        {isSuccess ? (
                            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 animate-in zoom-in duration-500">
                                    <CheckCircle2 className="h-10 w-10 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>Proposal Submitted Successfully!</h2>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Your education project proposal has been verified and published to the platform. Funder companies will now be able to review it.
                                </p>
                                <p className="text-sm text-primary mt-6">Redirecting you back...</p>
                            </CardContent>
                        ) : (
                            <div className="flex flex-col md:flex-row min-h-[600px]">
                                {/* Sidebar Stepper */}
                                <div className="w-full md:w-64 bg-secondary/30 p-6 border-b md:border-b-0 md:border-r border-border min-h-[160px]">
                                    <nav aria-label="Progress">
                                        <ol role="list" className="overflow-hidden md:flex flex-col gap-6 w-full hidden">
                                            {STEPS.map((step, index) => {
                                                const isActive = step.id === currentStep;
                                                const isCompleted = step.id < currentStep;
                                                return (
                                                    <li key={step.id} className="relative">
                                                        <div className="group flex items-center">
                                                            <span className="flex items-center space-x-3">
                                                                <span className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors ${isActive ? 'border-primary bg-primary/10 text-primary' : isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}>
                                                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                                                </span>
                                                                <span className={`text-sm font-medium ${isActive ? 'text-foreground font-bold' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</span>
                                                            </span>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ol>

                                        {/* Mobile progress indicator */}
                                        <div className="md:hidden flex items-center justify-between">
                                            <div className="text-sm font-medium text-primary">Step {currentStep} of 4</div>
                                            <div className="text-sm font-medium text-foreground">{STEPS[currentStep - 1].title}</div>
                                        </div>
                                        <div className="md:hidden mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
                                        </div>
                                    </nav>
                                </div>

                                {/* Form Content */}
                                <div className="flex-1 flex flex-col">
                                    <CardHeader className="bg-card sticky top-0 z-10 border-b border-border/50">
                                        <CardTitle className="text-xl">{STEPS[currentStep - 1].title}</CardTitle>
                                        <CardDescription>
                                            {currentStep === 1 && "Provide the legal and organizational details of the implementing agency."}
                                            {currentStep === 2 && "Detail the core objectives, target demographics, and educational scope of the project."}
                                            {currentStep === 3 && "Break down the financial requirements, disbursement stages, and long-term sustainability."}
                                            {currentStep === 4 && "Upload necessary legal, compliance, and governance documents to verify authenticity."}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 p-6 pt-8">
                                        <form id="proposal-form" onSubmit={handleSubmit} className="flex flex-col gap-8">

                                            {/* STEP 1: Basic Info */}
                                            {currentStep === 1 && (
                                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="orgName">Organization Name *</Label>
                                                            <Input id="orgName" placeholder="e.g., Shiksha Foundation" value={formData.orgName || ''} onChange={handleChange} required />
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="regDetails">Registration Number/Details *</Label>
                                                            <Input id="regDetails" placeholder="e.g., Society Registration No." value={formData.regDetails || ''} onChange={handleChange} required />
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="orgEmail">Contact Email *</Label>
                                                            <Input id="orgEmail" type="email" placeholder="official@ngo.org" value={formData.orgEmail || ''} onChange={handleChange} required />
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="orgPhone">Contact Phone *</Label>
                                                            <Input id="orgPhone" type="tel" placeholder="+91 98765 43210" value={formData.orgPhone || ''} onChange={handleChange} required />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="expEducation">Experience in Education CSR Projects *</Label>
                                                        <Textarea
                                                            id="expEducation"
                                                            placeholder="Detail past educational projects, number of schools built, or students reached..."
                                                            className="min-h-[120px]"
                                                            value={formData.expEducation || ''} onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* STEP 2: Project Details */}
                                            {currentStep === 2 && (
                                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="projTitle">Project Title *</Label>
                                                        <Input id="projTitle" placeholder="e.g., Digital Classrooms for Rural Communities" value={formData.projTitle || ''} onChange={handleChange} required />
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="projObjectives">Objectives & Rationale *</Label>
                                                        <Textarea
                                                            id="projObjectives"
                                                            placeholder="Why is this educational project necessary? What are its primary goals?"
                                                            className="min-h-[100px]"
                                                            value={formData.projObjectives || ''} onChange={handleChange}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="targetGroup">Target Demographics (Students/Teachers) *</Label>
                                                            <Input id="targetGroup" placeholder="e.g., High school students, Women in STEM" value={formData.targetGroup || ''} onChange={handleChange} required />
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="geography">Geographical Scope *</Label>
                                                            <Input id="geography" placeholder="State(s), District(s), or specific rural areas" value={formData.geography || ''} onChange={handleChange} required />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="expectedOutcomes">Expected Educational Outcomes *</Label>
                                                        <Textarea
                                                            id="expectedOutcomes"
                                                            placeholder="e.g., 20% increase in literacy rates, 500 new skill certifications..."
                                                            className="min-h-[100px]"
                                                            value={formData.expectedOutcomes || ''} onChange={handleChange}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="monitoringPlan">Monitoring & Evaluation Plan *</Label>
                                                        <Textarea
                                                            id="monitoringPlan"
                                                            placeholder="How will attendance, grades, and implementation milestones be tracked?"
                                                            className="min-h-[100px]"
                                                            value={formData.monitoringPlan || ''} onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* STEP 3: Funding & Financials */}
                                            {currentStep === 3 && (
                                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="totalBudget">Total Estimated Budget (₹) *</Label>
                                                            <Input id="totalBudget" type="number" min="10000" placeholder="e.g., 2500000" value={formData.totalBudget || ''} onChange={handleChange} required />
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="projectDuration">Project Timeline (Months) *</Label>
                                                            <Input id="projectDuration" type="number" min="1" placeholder="e.g., 24" value={formData.projectDuration || ''} onChange={handleChange} required />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="costBreakdown">Detailed Cost Breakdown *</Label>
                                                        <Textarea
                                                            id="costBreakdown"
                                                            placeholder="Outline costs for infrastructure, teacher salaries, digital devices, study materials, etc."
                                                            className="min-h-[150px]"
                                                            value={formData.costBreakdown || ''} onChange={handleChange}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="disbursementPlan">Funding Disbursement Milestones *</Label>
                                                        <Textarea
                                                            id="disbursementPlan"
                                                            placeholder="e.g., 30% upon signing, 40% after school construction, 30% upon graduation of first batch."
                                                            className="min-h-[100px]"
                                                            value={formData.disbursementPlan || ''} onChange={handleChange}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="finSustainability">Long-term Financial Sustainability *</Label>
                                                        <Textarea
                                                            id="finSustainability"
                                                            placeholder="Who will bear the recurring operational costs of the school/program after the funding period ends?"
                                                            className="min-h-[100px]"
                                                            value={formData.finSustainability || ''} onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* STEP 4: Supporting Documents */}
                                            {currentStep === 4 && (
                                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <FileUploadInput
                                                            id="legalDocs"
                                                            label="Legal Documents (PAN, Trust Deed, Reg. Cert)"
                                                            helpText="Upload merged PDF"
                                                        />
                                                        <FileUploadInput
                                                            id="auditReports"
                                                            label="Audited Accounts (Past 3 Years)"
                                                            helpText="Upload merged PDF"
                                                        />
                                                    </div>
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <FileUploadInput
                                                            id="complianceDocs"
                                                            label="Compliance Proofs (GST, FCRA, Tax Exemption)"
                                                            helpText="Optional - if applicable"
                                                        />
                                                        <FileUploadInput
                                                            id="boardMembers"
                                                            label="List of Trustees/Board Members"
                                                            helpText="Upload PDF or CSV list"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2 pt-4">
                                                        <FileUploadInput
                                                            id="additionalMOUs"
                                                            label="Existing MOUs or Impact Reports (Optional)"
                                                            helpText="Upload previous impact reports or government MOUs"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                        </form>
                                    </CardContent>

                                    {/* Footer Actions */}
                                    <div className="p-6 border-t border-border bg-card/50 flex items-center justify-between">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={prevStep}
                                            disabled={currentStep === 1 || isSubmitting}
                                        >
                                            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                                        </Button>

                                        <Button
                                            type="button"
                                            className="min-w-[140px]"
                                            onClick={(e) => {
                                                if (currentStep < 4) {
                                                    e.preventDefault();
                                                    // In a real app with react-hook-form we would trigger validation here
                                                    // For now, bypass and go next
                                                    nextStep();
                                                } else {
                                                    // This will trigger the form submit handler
                                                    const form = document.getElementById("proposal-form") as HTMLFormElement;
                                                    if (form) form.requestSubmit();
                                                }
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    Submitting
                                                </>
                                            ) : currentStep === 4 ? (
                                                <>
                                                    Submit Proposal <CheckCircle2 className="ml-2 h-4 w-4" />
                                                </>
                                            ) : (
                                                <>
                                                    Next Step <ChevronRight className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
