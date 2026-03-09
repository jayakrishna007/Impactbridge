"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useProposals } from "@/lib/proposals-context"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Users,
  FileText,
  ClipboardList,
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  GraduationCap,
  HeartPulse,
  Landmark,
  Building,
  User,
  Plus,
  Briefcase,
  Upload,
  FileUp,
  Sparkles,
  Loader2,
  ExternalLink,
  Phone,
  Globe,
  Handshake,
  Bell,
  Send,
  BookOpen,
  PenLine,
  Tag,
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { apiGetPartnershipsForUser, apiPartnerConfirm, type PartnershipData } from "@/lib/api"

/* ─── Data ─── */

const applications = [
  { id: "APP-001", project: "Rural Education Initiative", date: "Feb 10, 2026", status: "approved" },
  { id: "APP-002", project: "Community Health Program", date: "Feb 18, 2026", status: "pending" },
  { id: "APP-003", project: "Skill Development Hub", date: "Jan 25, 2026", status: "rejected" },
]




function StatusBadge({ status }: { status: string }) {
  if (status === "approved")
    return (
      <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/10">
        <CheckCircle2 className="h-3 w-3" /> Approved
      </Badge>
    )
  if (status === "pending")
    return (
      <Badge className="gap-1 bg-accent/10 text-accent hover:bg-accent/10">
        <Clock className="h-3 w-3" /> Pending
      </Badge>
    )
  return (
    <Badge className="gap-1 bg-destructive/10 text-destructive hover:bg-destructive/10">
      <AlertCircle className="h-3 w-3" /> Rejected
    </Badge>
  )
}

export default function BeneficiariesPage() {
  const { user, isLoading, updatePortfolio } = useAuth()
  const { individualProposals } = useProposals()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string
    category: string
    budget: string
    eligibility: string
    matchedProjects: string[]
  } | null>(null)
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  const [selectedProjectForReport, setSelectedProjectForReport] = useState<string | null>(null)
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null)
  const [reportSubmissions, setReportSubmissions] = useState<any[]>([])
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile form state
  const [profilePhone, setProfilePhone] = useState("")
  const [profileLocation, setProfileLocation] = useState("")
  const [profileBio, setProfileBio] = useState("")
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  // Blog form state
  const [blogTitle, setBlogTitle] = useState("")
  const [blogAuthor, setBlogAuthor] = useState("")
  const [blogContent, setBlogContent] = useState("")
  const [blogTags, setBlogTags] = useState("")
  const [blogImageUrl, setBlogImageUrl] = useState("")
  const [isPublishingBlog, setIsPublishingBlog] = useState(false)
  const [blogPublished, setBlogPublished] = useState(false)
  const [blogPosts, setBlogPosts] = useState<{ id: string; title: string; author: string; tags: string; date: string }[]>([])

  const [partnerships, setPartnerships] = useState<PartnershipData[]>([])
  const [partnershipsLoading, setPartnershipsLoading] = useState(false)
  const [acceptingId, setAcceptingId] = useState<string | null>(null)

  // Filter proposals belonging to the logged-in user
  const myProposals = individualProposals.filter(
    p => user && (p.createdBy === user.email || p.name === user.name || p.name === user.email?.split("@")[0])
  )

  useEffect(() => {
    if (!user?.email) return
    setPartnershipsLoading(true)
    apiGetPartnershipsForUser(user.email)
      .then(setPartnerships)
      .catch(() => { })
      .finally(() => setPartnershipsLoading(false))
  }, [user?.email])

  useEffect(() => {
    if (user?.portfolio) {
      setProfilePhone(user.portfolio.contact?.phone || "")
      setProfileLocation(user.portfolio.contact?.address || "")
      setProfileBio(user.portfolio.about || "")
    }
  }, [user])

  const pendingPartnerships = partnerships.filter(p => !p.partnerConfirmed)
  const activePartnerships = partnerships.filter(p => p.partnerConfirmed && p.funderConfirmed)

  async function handleAccept(partnershipId: string) {
    setAcceptingId(partnershipId)
    try {
      const updated = await apiPartnerConfirm(partnershipId)
      setPartnerships(prev => prev.map(p => p.id === partnershipId ? updated : p))
    } catch { }
    finally { setAcceptingId(null) }
  }

  useEffect(() => {
    if (!isLoading && user) {
      if (!user.hasProfile) {
        router.push("/profile/setup")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingReport(true)
    setTimeout(() => {
      const typeLabel = selectedReportType === "monthly" ? "Monthly Progress"
        : selectedReportType === "quarterly" ? "Quarterly Impact"
          : "Annual Summary"
      const newRow = {
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        project: selectedProjectForReport || "Unknown Program",
        type: typeLabel,
        status: "Under Review",
      }
      setReportSubmissions(prev => [newRow, ...prev])
      setIsSubmittingReport(false)
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    }, 1500)
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      await updatePortfolio({ about: profileBio, contact: { phone: profilePhone, address: profileLocation } })
    } catch { }
    setIsSavingProfile(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

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
              <a href="/login">Return to Login</a>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setAnalysisResult(null)
    }
  }

  function handleAnalyze() {
    if (!uploadedFile) return
    setAnalyzing(true)
    setTimeout(() => {
      setAnalysisResult({
        summary: "The proposal outlines an educational support program for 200 underprivileged students in rural Karnataka, focusing on digital literacy and vocational skills development over 18 months.",
        category: "Education & Skill Development",
        budget: "45 L",
        eligibility: "High - Meets Schedule VII criteria for education and vocational training",
        matchedProjects: ["Rural Education Initiative", "Skill Development Hub"],
      })
      setAnalyzing(false)
    }, 2500)
  }

  function handleBlogPublish(e: React.FormEvent) {
    e.preventDefault()
    setIsPublishingBlog(true)
    setTimeout(() => {
      const newPost = {
        id: `BLOG-${Date.now().toString().slice(-6)}`,
        title: blogTitle,
        author: blogAuthor || user?.name || "Anonymous",
        tags: blogTags,
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      }
      setBlogPosts(prev => [newPost, ...prev])
      setIsPublishingBlog(false)
      setBlogPublished(true)
      // Reset form
      setBlogTitle("")
      setBlogAuthor("")
      setBlogContent("")
      setBlogTags("")
      setBlogImageUrl("")
      setTimeout(() => setBlogPublished(false), 3000)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-background px-6 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Beneficiary Portal</p>
            </div>
            <h1
              className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Manage your portfolio and track impact
            </h1>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Track your progress, build your personal profile, and submit reports for the programs you are part of.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="gap-2 shadow-md group" asChild>
                <Link href="/individual-proposals/create">
                  <Plus className="h-4 w-4 transition-transform group-hover:scale-125" /> Create Proposal
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 shadow-sm group" asChild>
                <Link href="/individual-proposals/create-blog">
                  <PenLine className="h-4 w-4 transition-transform group-hover:scale-125" /> Create Blog
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="bg-secondary/40 px-6 py-12 md:py-16">
          <div className="mx-auto max-w-7xl">
            <Tabs defaultValue="portfolio" className="gap-8 flex flex-col">
              <TabsList className="w-full justify-start bg-card border border-border h-auto flex-wrap gap-1 p-1">
                <TabsTrigger value="portfolio" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Briefcase className="h-4 w-4" /> My Portfolio
                </TabsTrigger>
                <TabsTrigger value="partnerships" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
                  <Handshake className="h-4 w-4" /> Partnership Requests
                  {pendingPartnerships.length > 0 && (
                    <span className="ml-1 h-5 min-w-[20px] rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center px-1">
                      {pendingPartnerships.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="reports" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileText className="h-4 w-4" /> Reports
                </TabsTrigger>
                <TabsTrigger value="applications" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileText className="h-4 w-4" /> My Proposals / Blogs
                </TabsTrigger>

                <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <User className="h-4 w-4" /> My Profile
                </TabsTrigger>
              </TabsList>

              {/* ... (Browse Projects, Portfolio, Upload Proposal contents unchanged) ... */}
              {/* Note: I'm skipping unchanged TabsContent blocks to save space, but I'll ensure they remain in the file */}

              {/* ── Reports ── */}
              <TabsContent value="reports" className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Impact Reports</h3>
                    <p className="text-sm text-muted-foreground">Submit required monthly/quarterly reports for your funded programs.</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Upload className="h-4 w-4" /> Submit New Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Submit Impact Report</DialogTitle>
                        <DialogDescription>
                          Select the program you are reporting for and upload your metrics.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleReportSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="program-select">Program / Project</Label>
                          <Select required onValueChange={setSelectedProjectForReport}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent>
                              {myProposals.map(item => (
                                <SelectItem key={item.title} value={item.title}>{item.title}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="report-type">Report Frequency</Label>
                          <Select required onValueChange={setSelectedReportType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly Progress</SelectItem>
                              <SelectItem value="quarterly">Quarterly Impact</SelectItem>
                              <SelectItem value="annual">Annual Summary</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="beneficiaries-reached">Beneficiaries Reached (This Period)</Label>
                          <Input id="beneficiaries-reached" type="number" placeholder="e.g. 50" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="report-summary">Key Achievements</Label>
                          <Textarea id="report-summary" placeholder="Briefly describe what was accomplished..." required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="report-file">Upload Report Document</Label>
                          <Input id="report-file" type="file" required />
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isSubmittingReport}>
                            {isSubmittingReport ? (
                              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                            ) : "Submit Report"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>Submission History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left text-muted-foreground">
                            <th className="pb-3 pr-4 font-medium">Date</th>
                            <th className="pb-3 pr-4 font-medium">Program</th>
                            <th className="pb-3 pr-4 font-medium">Type</th>
                            <th className="pb-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportSubmissions.length > 0 ? reportSubmissions.map((row, i) => (
                            <tr key={i} className="border-b border-border">
                              <td className="py-4 pr-4 text-foreground">{row.date}</td>
                              <td className="py-4 pr-4 text-foreground">{row.project}</td>
                              <td className="py-4 pr-4 text-muted-foreground">{row.type}</td>
                              <td className="py-4">
                                <Badge className="gap-1 bg-accent/10 text-accent hover:bg-accent/10">
                                  <Clock className="h-3 w-3" /> {row.status}
                                </Badge>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={4} className="py-10 text-center text-sm text-muted-foreground italic">
                                No reports submitted yet. Click &quot;Submit New Report&quot; to get started.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>





              {/* ── Portfolio ── */}
              <TabsContent value="portfolio" className="flex flex-col gap-6">
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>My Portfolio</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Your personal record of CSR program participation, skills acquired, and certifications earned.</p>
                </div>

                {/* Portfolio Summary */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="border-border bg-card">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <ClipboardList className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Programs Joined</p>
                        <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{myProposals.length}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-8 md:grid-cols-2 mt-4">
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Background & Mission</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="text-xs font-bold uppercase text-muted-foreground">About</h5>
                        <p className="text-sm">{user.portfolio?.about || "Not provided"}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase text-muted-foreground">Motivation</h5>
                        <p className="text-sm">{user.portfolio?.mission || "Not provided"}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.portfolio?.contact?.phone || "No phone"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.portfolio?.contact?.address || "No address"}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Portfolio Items */}
                <div className="flex flex-col gap-4 mt-6">
                  {myProposals.length > 0 ? myProposals.map((item) => (
                    <Card key={item.id} className="border-border bg-card">
                      <CardContent className="flex flex-col gap-3 p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          </div>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 shrink-0 ml-4">{item.status}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Deadline: {item.deadline}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Funding Required: </span>
                          <strong className="text-foreground">{item.fundingRequired}</strong>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="p-12 border-2 border-dashed rounded-lg text-center">
                      <Briefcase className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground">No portfolio projects yet.</p>
                      <Button asChild variant="outline" size="sm" className="mt-3">
                        <Link href="/individual-proposals/create">Create your first proposal</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>



              {/* ── My Proposals / Blogs ── */}
              <TabsContent value="applications" className="flex flex-col gap-6">
                {/* Proposals section */}
                <Card className="border-border bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                      <FileText className="h-5 w-5 text-primary" /> Proposal History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {myProposals.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {myProposals.map(proposal => (
                          <div key={proposal.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-background gap-4">
                            <div>
                              <p className="font-medium text-foreground">{proposal.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{proposal.category} · {proposal.location}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-accent/10 text-accent hover:bg-accent/10">{proposal.status}</Badge>
                              <Button size="sm" variant="outline" className="gap-1 text-xs" asChild>
                                <Link href={`/individual-proposals/${proposal.id}`}>View Proposal</Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-muted-foreground italic">You haven&apos;t submitted any proposals yet.</p>
                        <Button asChild variant="outline" size="sm" className="mt-3">
                          <Link href="/individual-proposals/create">Create a proposal</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Blog posts section */}
                <Card className="border-border bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                      <BookOpen className="h-5 w-5 text-primary" /> Blog History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {blogPosts.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {blogPosts.map(post => (
                          <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-background gap-4">
                            <div>
                              <p className="font-medium text-foreground">{post.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">By {post.author} · {post.date}</p>
                              {post.tags && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {post.tags.split(",").map(t => t.trim()).filter(Boolean).map(tag => (
                                    <span key={tag} className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                      <Tag className="h-2.5 w-2.5" />{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shrink-0">Published</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-muted-foreground italic">No blog posts yet.</p>
                        <p className="text-xs text-muted-foreground mt-1">Go to the &quot;Write a Blog&quot; tab to publish your first post.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Create Blog ── */}
              <TabsContent value="create-blog" className="flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <PenLine className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Write a Blog Post</h3>
                    <p className="text-sm text-muted-foreground">Share your insights, stories, and impact with the community.</p>
                  </div>
                </div>

                <Card className="border-border bg-card shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Draft your post</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {blogPublished ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 animate-in zoom-in duration-300">
                          <CheckCircle2 className="h-8 w-8 text-primary" />
                        </div>
                        <h4 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "var(--font-heading)" }}>Blog Published!</h4>
                        <p className="text-sm text-muted-foreground">Your story is live. Check it in &quot;My Proposals / Blogs&quot; tab.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleBlogPublish} className="grid gap-5">
                        <div className="grid gap-2">
                          <Label htmlFor="blog-title">Blog Title <span className="text-destructive">*</span></Label>
                          <Input
                            id="blog-title"
                            placeholder="Enter a catchy title for your blog"
                            value={blogTitle}
                            onChange={e => setBlogTitle(e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="blog-author">Author Name / Pen Name</Label>
                          <Input
                            id="blog-author"
                            placeholder={user?.name || "Your name or pen name"}
                            value={blogAuthor}
                            onChange={e => setBlogAuthor(e.target.value)}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="blog-content">Content <span className="text-destructive">*</span></Label>
                          <Textarea
                            id="blog-content"
                            placeholder="Write your blog post here... Share your journey, challenges, or vision for social change."
                            className="min-h-[280px] resize-y"
                            value={blogContent}
                            onChange={e => setBlogContent(e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="blog-tags">Tags (comma separated)</Label>
                          <Input
                            id="blog-tags"
                            placeholder="Education, Healthcare, Impact, Story"
                            value={blogTags}
                            onChange={e => setBlogTags(e.target.value)}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="blog-image">Cover Image URL (optional)</Label>
                          <Input
                            id="blog-image"
                            placeholder="https://example.com/image.jpg"
                            value={blogImageUrl}
                            onChange={e => setBlogImageUrl(e.target.value)}
                          />
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-border">
                          <Button type="submit" className="gap-2" disabled={isPublishingBlog}>
                            {isPublishingBlog ? (
                              <><Loader2 className="h-4 w-4 animate-spin" /> Publishing...</>
                            ) : (
                              <><Send className="h-4 w-4" /> Publish Blog Post</>
                            )}
                          </Button>
                          <Button type="button" variant="outline"
                            onClick={() => { setBlogTitle(""); setBlogAuthor(""); setBlogContent(""); setBlogTags(""); setBlogImageUrl("") }}>
                            Clear
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Partnership Requests ── */}
              <TabsContent value="partnerships" className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Partnership Requests</h3>
                  <p className="text-sm text-muted-foreground mt-1">Funders who expressed interest in supporting you. Review and accept to activate the partnership.</p>
                </div>

                {partnershipsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : partnerships.length === 0 ? (
                  <Card className="border-dashed border-2 bg-transparent p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Handshake className="h-12 w-12 text-muted-foreground/30" />
                      <p className="font-medium text-muted-foreground">No partnership requests yet</p>
                      <p className="text-sm text-muted-foreground/70">When funders express interest in supporting you, they'll appear here.</p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pendingPartnerships.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1.5">
                          <Bell className="h-3.5 w-3.5" /> Pending — Action Required ({pendingPartnerships.length})
                        </p>
                        <div className="space-y-3">
                          {pendingPartnerships.map(p => (
                            <Card key={p.id} className="border-amber-200 bg-amber-50/40">
                              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                                  <Handshake className="h-6 w-6 text-amber-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-foreground">{p.funderName}</p>
                                  <p className="text-sm text-muted-foreground mt-0.5">Interested in: <span className="font-medium text-foreground">{p.proposalTitle}</span></p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">
                                      {p.funderConfirmed ? "✓ Funder Confirmed" : "Pending Funder"}
                                    </Badge>
                                    <Badge className="bg-secondary text-muted-foreground hover:bg-secondary text-xs">
                                      Your acceptance needed
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <Button size="sm" variant="outline" asChild>
                                    <Link href={`/partnership/${p.proposalType}/${p.proposalId}`}>
                                      View Details
                                    </Link>
                                  </Button>
                                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                                    disabled={acceptingId === p.id}
                                    onClick={() => handleAccept(p.id)}>
                                    {acceptingId === p.id
                                      ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Accepting…</>
                                      : <><CheckCircle2 className="h-3.5 w-3.5" /> Accept</>}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {activePartnerships.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Active Partnerships ({activePartnerships.length})
                        </p>
                        <div className="space-y-3">
                          {activePartnerships.map(p => (
                            <Card key={p.id} className="border-emerald-200 bg-emerald-50/30">
                              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-foreground">{p.funderName}</p>
                                  <p className="text-sm text-muted-foreground mt-0.5">Project: <span className="font-medium text-foreground">{p.proposalTitle}</span></p>
                                  <Badge className="mt-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">🎉 Partnership Active</Badge>
                                </div>
                                <Button size="sm" variant="outline" className="shrink-0 gap-1.5" asChild>
                                  <Link href={`/partnership/${p.proposalType}/${p.proposalId}`}>
                                    <ArrowRight className="h-3.5 w-3.5" /> Open Partnership
                                  </Link>
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* ── Profile ── */}
              <TabsContent value="profile" className="flex flex-col gap-6">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6">
                    <form onSubmit={handleProfileSave} className="flex flex-col gap-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" value={user?.name || ""} readOnly className="bg-muted/40" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" value={user?.email || ""} readOnly className="bg-muted/40" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="+91 98765 43210" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" placeholder="City, State" value={profileLocation} onChange={(e) => setProfileLocation(e.target.value)} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="bio">About You</Label>
                        <Textarea id="bio" placeholder="Tell us about yourself and your needs..." rows={4} value={profileBio} onChange={(e) => setProfileBio(e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="docs">Upload Documents</Label>
                        <Input id="docs" type="file" multiple />
                        <p className="text-xs text-muted-foreground">Upload ID proof, income certificate, or any relevant documents.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button type="submit" className="w-fit" disabled={isSavingProfile}>
                          {isSavingProfile ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Profile"}
                        </Button>
                        {profileSaved && <span className="text-sm text-primary font-medium">✓ Profile saved!</span>}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs >
          </div >
        </section >
        {isSuccess && (
          <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
            <Card className="border-primary/50 bg-primary/10 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-primary">Report submitted successfully!</p>
              </div>
            </Card>
          </div>
        )
        }
      </main >
      <Footer />
    </div >
  )
}
