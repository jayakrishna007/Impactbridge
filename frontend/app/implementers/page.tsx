"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Building2,
  ClipboardList,
  FileText,
  Plus,
  Upload,
  IndianRupee,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  BarChart3,

  Briefcase,
  Star,
  Award,
  Globe,
  ExternalLink,
  MapPin,
} from "lucide-react"

/* ─── Data ─── */

const summaryCards = [
  { title: "Active Projects", value: "6", icon: ClipboardList },
  { title: "Total Funds Received", value: "3.8 Cr", icon: IndianRupee },
  { title: "Beneficiaries Served", value: "2,100", icon: Users },
  { title: "Reports Submitted", value: "24", icon: FileText },
]

const managedProjects = [
  { id: 1, title: "Rural Education Initiative", category: "Education", funder: "Tata Trusts", budget: "2 Cr", spent: "1.2 Cr", progress: 60, beneficiaries: 450, status: "Active", nextMilestone: "Mid-term assessment due Mar 15" },
  { id: 2, title: "Community Health Program", category: "Healthcare", funder: "Reliance Foundation", budget: "1.5 Cr", spent: "85 L", progress: 57, beneficiaries: 320, status: "Active", nextMilestone: "Phase 2 rollout Apr 01" },
  { id: 3, title: "Clean Water Access", category: "Infrastructure", funder: "Infosys Foundation", budget: "2.5 Cr", spent: "2.1 Cr", progress: 84, beneficiaries: 1200, status: "Active", nextMilestone: "Final delivery May 20" },
  { id: 4, title: "Skill Development Hub", category: "Livelihood", funder: "Wipro Foundation", budget: "1 Cr", spent: "60 L", progress: 60, beneficiaries: 180, status: "Delayed", nextMilestone: "Trainer onboarding pending" },
]

const reports = [
  { id: "RPT-001", project: "Rural Education Initiative", type: "Monthly Progress", date: "Feb 25, 2026", status: "Submitted" },
  { id: "RPT-002", project: "Clean Water Access", type: "Financial Audit", date: "Feb 20, 2026", status: "Under Review" },
  { id: "RPT-003", project: "Community Health Program", type: "Impact Assessment", date: "Feb 15, 2026", status: "Approved" },
  { id: "RPT-004", project: "Skill Development Hub", type: "Monthly Progress", date: "Feb 10, 2026", status: "Revision Needed" },
]



const portfolioProjects = [
  {
    title: "Rural Education Initiative",
    client: "Tata Trusts",
    year: "2025-26",
    status: "Active",
    impact: "450 students supported",
    rating: 4.7,
    categories: ["Education", "Skill Development"],
    location: "Rajasthan",
  },
  {
    title: "Clean Water Access",
    client: "Infosys Foundation",
    year: "2024-25",
    status: "Completed",
    impact: "1,200 families served",
    rating: 4.9,
    categories: ["Infrastructure", "Environment"],
    location: "Karnataka",
  },
  {
    title: "Maternal Health Initiative",
    client: "HDFC Foundation",
    year: "2024-25",
    status: "Completed",
    impact: "600 women covered",
    rating: 4.6,
    categories: ["Healthcare"],
    location: "Maharashtra",
  },
]

function ReportStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Submitted: "bg-chart-3/10 text-chart-3 hover:bg-chart-3/10",
    "Under Review": "bg-accent/10 text-accent hover:bg-accent/10",
    Approved: "bg-primary/10 text-primary hover:bg-primary/10",
    "Revision Needed": "bg-destructive/10 text-destructive hover:bg-destructive/10",
  }
  const icons: Record<string, React.ReactNode> = {
    Submitted: <CheckCircle2 className="mr-1 h-3 w-3" />,
    "Under Review": <Clock className="mr-1 h-3 w-3" />,
    Approved: <CheckCircle2 className="mr-1 h-3 w-3" />,
    "Revision Needed": <AlertTriangle className="mr-1 h-3 w-3" />,
  }
  return (
    <Badge className={styles[status] || ""}>
      {icons[status]}
      {status}
    </Badge>
  )
}

export default function ImplementersPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (!user || user.role !== "ngo") {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>Access Denied</h1>
            <p className="text-muted-foreground mb-6">You must be logged in as an Implementer to view this page.</p>
            <Button asChild>
              <a href="/login">Return to Login</a>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-background px-6 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/10">
                <Building2 className="h-5 w-5 text-chart-3" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wider text-chart-3">Implementer Portal</p>
            </div>
            <h1
              className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Manage projects and deliver impact
            </h1>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Create CSR projects, manage funds, submit reports, build your organization portfolio, and collaborate with funders and beneficiaries.
            </p>
          </div>
        </section>

        {/* Dashboard */}
        <section className="bg-secondary/40 px-6 py-12 md:py-16">
          <div className="mx-auto max-w-7xl">
            {/* Summary */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {summaryCards.map((card) => (
                <Card key={card.title} className="border-border bg-card">
                  <CardContent className="flex items-start justify-between p-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">{card.title}</span>
                      <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{card.value}</span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                      <card.icon className="h-5 w-5 text-chart-3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="projects" className="gap-8 flex flex-col">
              <TabsList className="w-full justify-start bg-card border border-border h-auto flex-wrap gap-1 p-1">
                <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <ClipboardList className="h-4 w-4" /> My Projects
                </TabsTrigger>

                <TabsTrigger value="portfolio" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Briefcase className="h-4 w-4" /> Portfolio
                </TabsTrigger>
                <TabsTrigger value="reports" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileText className="h-4 w-4" /> Reports
                </TabsTrigger>
                <TabsTrigger value="create" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Plus className="h-4 w-4" /> Create Project
                </TabsTrigger>
              </TabsList>

              {/* ── My Projects ── */}
              <TabsContent value="projects" className="flex flex-col gap-6">
                {managedProjects.map((project) => (
                  <Card key={project.id} className="border-border bg-card">
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{project.title}</h3>
                            <p className="text-xs text-muted-foreground">{project.category} | Funded by {project.funder}</p>
                          </div>
                        </div>
                        <Badge className={project.status === "Active" ? "bg-primary/10 text-primary hover:bg-primary/10" : "bg-accent/10 text-accent hover:bg-accent/10"}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 rounded-lg bg-secondary/60 p-4 sm:grid-cols-4">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="mt-1 font-semibold text-foreground">{project.budget}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Spent</p>
                          <p className="mt-1 font-semibold text-foreground">{project.spent}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Progress</p>
                          <p className="mt-1 font-semibold text-foreground">{project.progress}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Beneficiaries</p>
                          <p className="mt-1 font-semibold text-foreground">{project.beneficiaries}</p>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Completion</span>
                          <span className="font-medium text-foreground">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" /> {project.nextMilestone}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <BarChart3 className="h-3 w-3" /> Update Progress
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Upload className="h-3 w-3" /> Submit Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>



              {/* ── Portfolio ── */}
              <TabsContent value="portfolio" className="flex flex-col gap-6">
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Organization Portfolio</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Showcase your track record of completed and active CSR projects to attract new funders and partnerships.</p>
                </div>

                {/* Portfolio Summary */}
                <div className="grid gap-4 sm:grid-cols-4">
                  <Card className="border-border bg-card">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <ClipboardList className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Projects</p>
                        <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>9</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border bg-card">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                        <Users className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Lives Impacted</p>
                        <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>4,200+</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border bg-card">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                        <Globe className="h-5 w-5 text-chart-3" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">States Covered</p>
                        <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>6</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border bg-card">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
                        <Star className="h-5 w-5 text-chart-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg. Rating</p>
                        <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>4.73</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Portfolio Projects */}
                <div className="flex flex-col gap-4">
                  {portfolioProjects.map((item) => (
                    <Card key={item.title} className="border-border bg-card">
                      <CardContent className="flex flex-col gap-4 p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Client: {item.client} -- {item.year}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={item.status === "Active" ? "bg-primary/10 text-primary hover:bg-primary/10" : "bg-chart-3/10 text-chart-3 hover:bg-chart-3/10"}>
                              {item.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-3.5 w-3.5 fill-chart-4 text-chart-4" />
                              <span className="font-medium text-foreground">{item.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {item.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="h-3 w-3" /> {item.impact}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.categories.map((cat) => (
                            <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="gap-1.5 self-start">
                          <ExternalLink className="h-3 w-3" /> View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* ── Reports ── */}
              <TabsContent value="reports" className="flex flex-col gap-6">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>Submitted Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left text-muted-foreground">
                            <th className="pb-3 pr-4 font-medium">Report ID</th>
                            <th className="pb-3 pr-4 font-medium">Project</th>
                            <th className="pb-3 pr-4 font-medium">Type</th>
                            <th className="pb-3 pr-4 font-medium">Date</th>
                            <th className="pb-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports.map((report) => (
                            <tr key={report.id} className="border-b border-border last:border-0">
                              <td className="py-4 pr-4 font-mono text-xs text-foreground">{report.id}</td>
                              <td className="py-4 pr-4 text-foreground">{report.project}</td>
                              <td className="py-4 pr-4 text-muted-foreground">{report.type}</td>
                              <td className="py-4 pr-4 text-muted-foreground">{report.date}</td>
                              <td className="py-4"><ReportStatusBadge status={report.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Create Project ── */}
              <TabsContent value="create" className="flex flex-col gap-6">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>Create New CSR Project</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input id="projectName" placeholder="Enter project name" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="livelihood">Livelihood</SelectItem>
                            <SelectItem value="environment">Environment</SelectItem>
                            <SelectItem value="social">Social Development</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="budget">Budget (INR)</Label>
                        <Input id="budget" placeholder="e.g., 1,00,00,000" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="City, State" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="date" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="description">Project Description</Label>
                      <Textarea id="description" placeholder="Describe the project goals, expected outcomes, and methodology..." rows={4} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="outcomes">Expected Outcomes</Label>
                      <Textarea id="outcomes" placeholder="List the measurable outcomes and key performance indicators..." rows={3} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="documents">Supporting Documents</Label>
                      <Input id="documents" type="file" multiple />
                      <p className="text-xs text-muted-foreground">Upload project proposals, budgets, timelines, or any relevant documents.</p>
                    </div>
                    <Button className="w-fit gap-2">
                      <Plus className="h-4 w-4" /> Create Project
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
