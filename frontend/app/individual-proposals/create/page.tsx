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
import { AlertCircle, ArrowLeft, Upload, CheckCircle2, ChevronRight, ChevronLeft, Building2, Target, DollarSign, FileText, BookOpen } from "lucide-react"
import Link from "next/link"

const STEPS = [
    { id: 1, title: "Basic Information", icon: Building2 },
    { id: 2, title: "Project Details", icon: Target },
    { id: 3, title: "Funding & Financials", icon: DollarSign },
    { id: 4, title: "Supporting Documents", icon: FileText },
]

export default function CreateBeneficiaryProposalPage() {
    const { user, isLoading } = useAuth()
    const { addIndividualProposal } = useProposals()
    const router = useRouter()

    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [formData, setFormData] = useState<any>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    // Guard clause
    if (isLoading) return null

    if (!user || user.role !== "beneficiary") {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex flex-1 items-center justify-center px-6">
                    <div className="text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                        <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>Access Denied</h1>
                        <p className="text-muted-foreground mb-6">You must be logged in as a Beneficiary to view this page.</p>
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

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Create new proposal
        const newProposal = {
            id: `ind-${Date.now()}`,
            icon: BookOpen,
            name: formData.orgName || user?.name || "Unknown Beneficiary",
            title: formData.projTitle || "New Individual Project",
            category: "Digital Education", // Simplified for demo
            fundingRequired: `₹${(Number(formData.totalBudget) || 0).toLocaleString()}`,
            fundingRaised: "₹0",
            progress: 0,
            beneficiaries: 10,
            status: "Seeking Funding",
            location: formData.geography || "Pan India",
            deadline: "Dec 31, 2026",
            description: formData.projObjectives || "A grassroots initiative for learning.",
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

        addIndividualProposal(newProposal)

        setIsSubmitting(false)
        setIsSuccess(true)

        // Redirect back to individual proposals list after success
        setTimeout(() => {
            router.push("/individual-proposals")
        }, 2000)
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
                            <Link href="/individual-proposals">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Proposals
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                            Submit an Individual Education Proposal
                        </h1>
                        <p className="mt-2 text-muted-foreground bg-primary/5 border border-primary/20 p-3 rounded-md text-sm inline-block">
                            Logged in as Beneficiary: <strong>{user.name}</strong>
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
                                            {currentStep === 1 && "Provide your personal or community group details."}
                                            {currentStep === 2 && "Detail the core objectives, demographics, and educational scope of the project."}
                                            {currentStep === 3 && "Break down the financial requirements, disbursement stages, and long-term sustainability."}
                                            {currentStep === 4 && "Upload necessary identification or community endorsements to verify authenticity."}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 p-6 pt-8">
                                        <form id="proposal-form" onSubmit={handleSubmit} className="flex flex-col gap-8">

                                            {/* STEP 1: Basic Info (Beneficiary Specific) */}
                                            {currentStep === 1 && (
                                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="orgName">Your Name / Community Group *</Label>
                                                            <Input id="orgName" placeholder="e.g., Jane Doe / Village Youth Forum" value={formData.orgName || ''} onChange={handleChange} required />
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="regDetails">ID Number / Local Registration (Optional)</Label>
                                                            <Input id="regDetails" placeholder="e.g., Aadhar No. or Panchayat ID" value={formData.regDetails || ''} onChange={handleChange} />
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="orgEmail">Contact Email *</Label>
                                                            <Input id="orgEmail" type="email" placeholder="jane@example.com" value={formData.orgEmail || ''} onChange={handleChange} required />
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="orgPhone">Contact Phone *</Label>
                                                            <Input id="orgPhone" type="tel" placeholder="+91 98765 43210" value={formData.orgPhone || ''} onChange={handleChange} required />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="expEducation">Your Background / Need *</Label>
                                                        <Textarea
                                                            id="expEducation"
                                                            placeholder="Detail your background, any previous community initiatives, or why you specifically need educational support..."
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
                                                        <Input id="projTitle" placeholder="e.g., College Tuition Fund / Local Library Setup" value={formData.projTitle || ''} onChange={handleChange} required />
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
                                                            <Label htmlFor="targetGroup">Target Demographics (Students/Community) *</Label>
                                                            <Input id="targetGroup" placeholder="e.g., Myself (Engineering Student), Local village children" value={formData.targetGroup || ''} onChange={handleChange} required />
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
                                                            placeholder="e.g., Securing a B.Tech degree, 50 children gaining basic literacy..."
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
                                                            <Input id="totalBudget" type="number" min="1000" placeholder="e.g., 50000" value={formData.totalBudget || ''} onChange={handleChange} required />
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor="projectDuration">Project Timeline (Months) *</Label>
                                                            <Input id="projectDuration" type="number" min="1" placeholder="e.g., 12" value={formData.projectDuration || ''} onChange={handleChange} required />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="costBreakdown">Detailed Cost Breakdown *</Label>
                                                        <Textarea
                                                            id="costBreakdown"
                                                            placeholder="Outline costs for tuition fees, books, digital devices, study materials, etc."
                                                            className="min-h-[150px]"
                                                            value={formData.costBreakdown || ''} onChange={handleChange}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="disbursementPlan">Funding Disbursement Milestones *</Label>
                                                        <Textarea
                                                            id="disbursementPlan"
                                                            placeholder="e.g., 50% for tuition semester 1, 50% for semester 2."
                                                            className="min-h-[100px]"
                                                            value={formData.disbursementPlan || ''} onChange={handleChange}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="finSustainability">Long-term Financial Sustainability *</Label>
                                                        <Textarea
                                                            id="finSustainability"
                                                            placeholder="Who will bear the recurring operational costs after the funding period ends?"
                                                            className="min-h-[100px]"
                                                            value={formData.finSustainability || ''} onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* STEP 4: Supporting Documents (Beneficiary Specific) */}
                                            {currentStep === 4 && (
                                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <FileUploadInput
                                                            id="legalDocs"
                                                            label="Personal ID / Aadhar Card"
                                                            helpText="Upload merged PDF"
                                                        />
                                                        <FileUploadInput
                                                            id="auditReports"
                                                            label="Previous Academic Records"
                                                            helpText="Upload merged PDF of marksheets/certificates"
                                                        />
                                                    </div>
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <FileUploadInput
                                                            id="complianceDocs"
                                                            label="Fee Structure / Estimate from Institution"
                                                            helpText="Upload PDF or Images"
                                                        />
                                                        <FileUploadInput
                                                            id="boardMembers"
                                                            label="Recommendation Letters"
                                                            helpText="Optional - From teachers or community leaders"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2 pt-4">
                                                        <FileUploadInput
                                                            id="additionalMOUs"
                                                            label="Other Supporting Evidence (Optional)"
                                                            helpText="Upload any other proof of need or merit"
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
                                                    // Move to next step
                                                    nextStep();
                                                } else {
                                                    // Submit form
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
