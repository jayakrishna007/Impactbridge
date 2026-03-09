"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  BarChart3,
  Eye,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  FileText,
  GraduationCap,
  Landmark,
  Building,
  IndianRupee,
  Users,
  Upload,
  FileUp,
  Sparkles,
  ArrowRight,
  Loader2,
  Phone,
  MapPin,
  Globe,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react"

/* ─── Data ─── */

const summaryCards = [
  { title: "Total Contributions", value: "2.45 Cr", change: "+12%", trend: "up", icon: IndianRupee },
  { title: "Active Projects", value: "8", change: "+2", trend: "up", icon: FileText },
  { title: "Beneficiaries Reached", value: "1,240", change: "+18%", trend: "up", icon: Users },
  { title: "Fund Utilization", value: "94%", change: "+3%", trend: "up", icon: TrendingUp },
]

const fundedProjects = [
  { id: 1, title: "Digital Classrooms for Rural India", category: "Primary Education", icon: GraduationCap, contributed: "45 L", total: "2 Cr", utilization: 82, beneficiaries: 450, status: "On Track" },
  { id: 2, title: "Teacher Fellowship Programme", category: "Teacher Training", icon: GraduationCap, contributed: "60 L", total: "1.5 Cr", utilization: 76, beneficiaries: 320, status: "On Track" },
  { id: 3, title: "Smart Classroom Upgrade", category: "Infrastructure", icon: Landmark, contributed: "1.2 Cr", total: "2.5 Cr", utilization: 91, beneficiaries: 1200, status: "Ahead" },
  { id: 4, title: "Vocational Skills for Graduates", category: "Vocational", icon: Building, contributed: "20 L", total: "1 Cr", utilization: 60, beneficiaries: 180, status: "Delayed" },
]

const availableProjects = [
  { id: 5, title: "Girl Child Scholarship Fund", category: "Scholarships", icon: Users, target: "1.8 Cr", raised: "60 L", progress: 33, location: "Uttar Pradesh" },
  { id: 6, title: "STEM Education Drive", category: "Primary Education", icon: GraduationCap, target: "1.2 Cr", raised: "45 L", progress: 38, location: "Telangana" },
]

const mockReports = [
  { id: "R-1001", project: "Digital Classrooms for Rural India", type: "Monthly Progress", date: "2024-03-01", status: "Approved" },
  { id: "R-1002", project: "Teacher Fellowship Programme", type: "Quarterly Impact", date: "2024-02-15", status: "Under Review" },
  { id: "R-1003", project: "Smart Classroom Upgrade", type: "Annual Financial & Impact", date: "2024-01-20", status: "Approved" },
  { id: "R-1004", project: "Vocational Skills for Graduates", type: "Monthly Progress", date: "2024-03-05", status: "Revision Needed" },
]

function ReportStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Submitted: "bg-blue-100 text-blue-700 border-blue-200",
    "Under Review": "bg-amber-100 text-amber-700 border-amber-200",
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Revision Needed": "bg-rose-100 text-rose-700 border-rose-200",
  }
  const icons: Record<string, React.ReactNode> = {
    Submitted: <CheckCircle2 className="mr-1 h-3 w-3" />,
    "Under Review": <Clock className="mr-1 h-3 w-3" />,
    Approved: <CheckCircle2 className="mr-1 h-3 w-3" />,
    "Revision Needed": <AlertCircle className="mr-1 h-3 w-3" />,
  }
  return (
    <Badge variant="outline" className={`${styles[status] || ""} border flex items-center w-fit`}>
      {icons[status]}
      {status}
    </Badge>
  )
}





/* ─── Suggested Projects after CSR analysis ─── */
const suggestedProjects = [
  { title: "Digital Classrooms for Rural India", category: "Primary Education", match: 95, amount: "20 L", icon: GraduationCap },
  { title: "Teacher Fellowship Programme", category: "Teacher Training", match: 88, amount: "15 L", icon: GraduationCap },
  { title: "Girl Child Scholarship Fund", category: "Scholarships", match: 82, amount: "10 L", icon: Users },
]

export default function FundersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{
    revenue: string
    profit: string
    csrBudget: string
    csrPercent: string
    suggestions: typeof suggestedProjects
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Empty states for new users
  const [fundedProjects, setFundedProjects] = useState<any[]>([])

  // States for reports filtering
  const [reportFilter, setReportFilter] = useState<string>("all")
  const [reportSearch, setReportSearch] = useState<string>("")
  const [filteredReports, setFilteredReports] = useState<typeof mockReports>(mockReports)

  useEffect(() => {
    let result = mockReports

    if (reportFilter !== "all") {
      result = result.filter(r => r.type.toLowerCase().includes(reportFilter.toLowerCase()))
    }

    if (reportSearch) {
      result = result.filter(r =>
        r.project.toLowerCase().includes(reportSearch.toLowerCase()) ||
        r.id.toLowerCase().includes(reportSearch.toLowerCase())
      )
    }

    setFilteredReports(result)
  }, [reportFilter, reportSearch])

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

  if (!user || user.role !== "funder") {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>Access Denied</h1>
            <p className="text-muted-foreground mb-6">You must be logged in as a CSR Funder to view this page.</p>
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
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        revenue: "850 Cr",
        profit: "120 Cr",
        csrBudget: "2.4 Cr",
        csrPercent: "2%",
        suggestions: suggestedProjects,
      })
      setAnalyzing(false)
    }, 2500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-background px-6 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">Funder Dashboard</p>
            </div>
            <h1
              className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Track your contributions and impact
            </h1>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Monitor every rupee, measure real outcomes, and fund the projects that matter most -- with full financial transparency.
            </p>
          </div>
        </section>

        {/* Dashboard */}
        <section className="bg-secondary/40 px-6 py-12 md:py-16">
          <div className="mx-auto max-w-7xl">
            {/* Summary Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {summaryCards.map((card) => (
                <Card key={card.title} className="border-border bg-card">
                  <CardContent className="flex items-start justify-between p-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">{card.title}</span>
                      <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{card.value}</span>
                      <span className={`flex items-center gap-1 text-xs font-medium ${card.trend === "up" ? "text-primary" : "text-destructive"}`}>
                        {card.trend === "up"
                          ? <ArrowUpRight className="h-3 w-3" />
                          : <ArrowDownRight className="h-3 w-3" />}
                        {card.change} this quarter
                      </span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <card.icon className="h-5 w-5 text-accent" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="portfolio" className="gap-8 flex flex-col">
              <TabsList className="w-full justify-start bg-card border border-border h-auto flex-wrap gap-1 p-1">
                <TabsTrigger value="portfolio" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <BarChart3 className="h-4 w-4" /> My Portfolio
                </TabsTrigger>
                <TabsTrigger value="reports" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileText className="h-4 w-4" /> Project Reports
                </TabsTrigger>
                <TabsTrigger value="upload" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Upload className="h-4 w-4" /> Upload Report
                </TabsTrigger>

              </TabsList>



              {/* ── Portfolio ── */}
              <TabsContent value="portfolio" className="flex flex-col gap-6">
                <div className="grid gap-8 md:grid-cols-2">
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Company Profile & Mission</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="text-xs font-bold uppercase text-muted-foreground">About</h5>
                        <p className="text-sm">{user.portfolio?.about || "Not provided"}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase text-muted-foreground">CSR Mission</h5>
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

                <div className="mt-8">
                  <h4 className="text-md font-semibold mb-4">Supported Projects</h4>
                  {fundedProjects.length > 0 ? (
                    <div className="grid gap-6 lg:grid-cols-2">
                      {fundedProjects.map((project) => (
                        <Card key={project.id} className="border-border bg-card">
                          {/* ... project card content ... */}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                      You haven't funded any projects yet.
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ── Project Reports ── */}
              <TabsContent value="reports" className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Comprehensive Project Reports</h3>
                    <p className="text-sm text-muted-foreground">Monitor the monthly, quarterly, and annual progress of your funded CSR initiatives.</p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Filter by project..."
                      className="pl-9"
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                    />
                  </div>
                </div>

                <Card className="border-border bg-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>Latest Reports</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant={reportFilter === "all" ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setReportFilter("all")}
                      >
                        All
                      </Button>
                      <Button
                        variant={reportFilter === "monthly" ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setReportFilter("monthly")}
                      >
                        Monthly
                      </Button>
                      <Button
                        variant={reportFilter === "quarterly" ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setReportFilter("quarterly")}
                      >
                        Quarterly
                      </Button>
                      <Button
                        variant={reportFilter === "annual" ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setReportFilter("annual")}
                      >
                        Annual
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left text-muted-foreground">
                            <th className="pb-3 pr-4 font-medium">Report ID</th>
                            <th className="pb-3 pr-4 font-medium">Project Name</th>
                            <th className="pb-3 pr-4 font-medium">Reporting Cycle</th>
                            <th className="pb-3 pr-4 font-medium">Submission Date</th>
                            <th className="pb-3 font-medium">Status</th>
                            <th className="pb-3 text-right font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                              <tr key={report.id} className="group hover:bg-muted/30 transition-colors">
                                <td className="py-4 pr-4 font-mono text-xs font-medium">{report.id}</td>
                                <td className="py-4 pr-4">
                                  <span className="font-semibold text-foreground">{report.project}</span>
                                </td>
                                <td className="py-4 pr-4 text-muted-foreground">{report.type}</td>
                                <td className="py-4 pr-4 text-muted-foreground">{report.date}</td>
                                <td className="py-4 pr-4">
                                  <ReportStatusBadge status={report.status} />
                                </td>
                                <td className="py-4 text-right">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-muted-foreground italic">
                                No reports found matching your current filters.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Summary Section */}
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                      <p className="text-xs font-bold uppercase text-primary tracking-wider mb-2">Monthly Updates</p>
                      <h4 className="text-2xl font-bold">128</h4>
                      <p className="text-sm text-muted-foreground mt-1">Verified milestones met this month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-accent/5 border-accent/20">
                    <CardContent className="pt-6">
                      <p className="text-xs font-bold uppercase text-accent tracking-wider mb-2">Quarterly Impact</p>
                      <h4 className="text-2xl font-bold">3,450</h4>
                      <p className="text-sm text-muted-foreground mt-1">Beneficiaries reached across all sectors</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-emerald-50 border-emerald-200">
                    <CardContent className="pt-6">
                      <p className="text-xs font-bold uppercase text-emerald-700 tracking-wider mb-2">Annual Compliance</p>
                      <h4 className="text-2xl font-bold font-heading text-emerald-800">100%</h4>
                      <p className="text-sm text-emerald-600/80 mt-1">Audit readiness score for FY 2023-24</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* ── Upload Report & CSR Analysis ── */}
              <TabsContent value="upload" className="flex flex-col gap-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Upload Card */}
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                        <FileUp className="h-5 w-5 text-accent" /> Upload Annual Report
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Upload your company's annual report or financial statement. Our system will analyze the report, extract your net profit, and calculate the mandatory 2% CSR budget under Section 135 of the Companies Act.
                      </p>
                      <div
                        className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-border bg-secondary/40 p-10 text-center transition-colors hover:border-primary/40 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                          <Upload className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">PDF, XLSX, or CSV (max 25MB)</p>
                        </div>
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.xlsx,.csv"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                      <Button
                        onClick={handleAnalyze}
                        disabled={!uploadedFile || analyzing}
                        className="gap-2"
                      >
                        {analyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Analyzing Report...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" /> Analyze Report
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Analysis Result Card */}
                  <Card className={`border-border bg-card transition-opacity ${analysisResult ? "opacity-100" : "opacity-50"}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                        <Sparkles className="h-5 w-5 text-primary" /> CSR Budget Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                      {analysisResult ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-secondary/60 p-4 text-center">
                              <p className="text-xs text-muted-foreground">Annual Revenue</p>
                              <p className="mt-1 text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                                {analysisResult.revenue}
                              </p>
                            </div>
                            <div className="rounded-lg bg-secondary/60 p-4 text-center">
                              <p className="text-xs text-muted-foreground">Net Profit</p>
                              <p className="mt-1 text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                                {analysisResult.profit}
                              </p>
                            </div>
                            <div className="col-span-2 rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
                              <p className="text-xs text-muted-foreground">Mandatory CSR Budget ({analysisResult.csrPercent} of Net Profit)</p>
                              <p className="mt-1 text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                                {analysisResult.csrBudget}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="mb-3 font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                              Suggested Projects for Your Budget
                            </h4>
                            <div className="flex flex-col gap-3">
                              {analysisResult.suggestions.map((s) => (
                                <div key={s.title} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                      <s.icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-foreground">{s.title}</p>
                                      <p className="text-xs text-muted-foreground">{s.category} -- {s.match}% match</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-primary">{s.amount}</span>
                                    <Button size="sm" variant="outline" className="gap-1 h-8">
                                      Fund <ArrowRight className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 py-12 text-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <Sparkles className="h-7 w-7 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground">
                            Upload and analyze your annual report to see your CSR budget breakdown and project suggestions.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>


            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
