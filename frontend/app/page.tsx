"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  DollarSign,
  Building2,
  ArrowRight,
  FileText,
  BarChart3,
  ClipboardList,
  HandCoins,
  Eye,
  Handshake,
  MapPin,
  GraduationCap,
  HeartPulse,
  Landmark,
  Building,

  Briefcase,
  FileCheck,
  FolderOpen,
  School,
  BookOpen,
} from "lucide-react"
import { useAuth, getDashboardPath } from "@/lib/auth-context"

/* ─── Data ─── */

const stakeholders = [
  {
    title: "Beneficiaries",
    description: "Discover CSR projects, apply for benefits, and track your progress from a single portal.",
    icon: Users,
    href: "/login?role=beneficiary",
    color: "bg-primary/10 text-primary",
    role: "beneficiary",
    features: [
      { icon: FileText, label: "Apply to CSR projects" },
      { icon: Users, label: "Personal portfolio" },

      { icon: ClipboardList, label: "Track application status" },
    ],
  },
  {
    title: "Funders",
    description: "Track contributions, monitor impact, and access real-time financial transparency on every project.",
    icon: DollarSign,
    href: "/login?role=funder",
    color: "bg-accent/10 text-accent",
    role: "funder",
    features: [
      { icon: HandCoins, label: "Fund CSR projects" },

      { icon: BarChart3, label: "Impact analytics" },
      { icon: Eye, label: "Financial transparency" },
    ],
  },
  {
    title: "NGO",
    description: "Manage projects, submit reports, collaborate with funders, and deliver measurable results.",
    icon: Building2,
    href: "/login?role=ngo",
    color: "bg-chart-3/10 text-chart-3",
    role: "ngo",
    features: [
      { icon: ClipboardList, label: "Project management" },

      { icon: Briefcase, label: "Personal portfolio" },
      { icon: Handshake, label: "Funder collaboration" },
    ],
  },
]

const projects = [
  {
    icon: GraduationCap,
    title: "Digital Literacy for Rural Schools",
    category: "Digital Education",
    funder: "Tata Trusts",
    raised: "1.2 Cr",
    target: "2 Cr",
    progress: 60,
    beneficiaries: 450,
    status: "Active",
    location: "Rajasthan",
  },
  {
    icon: BookOpen,
    title: "Mobile Library Initiative",
    category: "Literacy",
    funder: "Reliance Foundation",
    raised: "85 L",
    target: "1.5 Cr",
    progress: 57,
    beneficiaries: 320,
    status: "Active",
    location: "Maharashtra",
  },
  {
    icon: Landmark,
    title: "Smart Classroom Upgrade",
    category: "Infrastructure",
    funder: "Infosys Foundation",
    raised: "2.1 Cr",
    target: "2.5 Cr",
    progress: 84,
    beneficiaries: 1200,
    status: "Active",
    location: "Karnataka",
  },
  {
    icon: Building,
    title: "Vocational Excellence Center",
    category: "Vocational",
    funder: "Wipro Foundation",
    raised: "60 L",
    target: "1 Cr",
    progress: 60,
    beneficiaries: 180,
    status: "Active",
    location: "Tamil Nadu",
  },
  {
    icon: Users,
    title: "Girl Child Scholarship Fund",
    category: "Scholarships",
    funder: "Mahindra Foundation",
    raised: "60 L",
    target: "1.8 Cr",
    progress: 33,
    beneficiaries: 520,
    status: "Active",
    location: "Uttar Pradesh",
  },
  {
    icon: School,
    title: "Govt School Model Makeover",
    category: "Infrastructure",
    funder: "Adani Foundation",
    raised: "1.1 Cr",
    target: "3 Cr",
    progress: 37,
    beneficiaries: 800,
    status: "Active",
    location: "Gujarat",
  },
]

const locations = [
  "All Locations",
  "Rajasthan",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Gujarat",
]

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const { user } = useAuth()

  const filteredProjects =
    selectedLocation === "All Locations"
      ? projects
      : projects.filter((p) => p.location === selectedLocation)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />

        {/* Impact Statistics Section */}
        <section className="bg-background border-y border-border">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
              {[
                { value: "500+", label: "Projects Funded" },
                { value: "120+", label: "NGO Partners" },
                { value: "50Cr+", label: "Funds Deployed" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-2 bg-card px-4 py-10">
                  <span className="text-3xl font-bold tracking-tight text-foreground md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Tabbed Content */}
        <section className="bg-secondary/40 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <Tabs defaultValue="stakeholders" className="flex flex-col gap-10">
              <TabsList className="mx-auto w-full max-w-3xl justify-start bg-card border border-border h-auto flex-wrap gap-1 p-1.5">
                <TabsTrigger
                  value="stakeholders"
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Users className="h-4 w-4" /> Stakeholders
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <FolderOpen className="h-4 w-4" /> Projects
                </TabsTrigger>
                <TabsTrigger
                  value="partnerships"
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Handshake className="h-4 w-4" /> Partnerships
                </TabsTrigger>
              </TabsList>

              {/* ── Stakeholders Tab ── */}
              <TabsContent value="stakeholders">
                <div className="mb-10 text-center">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                    For every stakeholder
                  </p>
                  <h2
                    className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Three roles, one mission
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
                    Whether you are seeking support, providing funding, or implementing projects -- ImpactBridge gives you the tools to make a difference.
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {stakeholders.map((s) => (
                    <Card
                      key={s.title}
                      className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                    >
                      <CardContent className="flex flex-col gap-6 p-8">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
                          <s.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                            {s.title}
                          </h3>
                          <p className="mt-2 leading-relaxed text-muted-foreground">{s.description}</p>
                        </div>
                        <ul className="flex flex-col gap-3">
                          {s.features.map((f) => (
                            <li key={f.label} className="flex items-center gap-3 text-sm text-foreground">
                              <f.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                              {f.label}
                            </li>
                          ))}
                        </ul>
                        <Button variant="outline" className="mt-auto gap-2 group-hover:border-primary group-hover:text-primary" asChild>
                          <Link href={user && user.role === s.role ? getDashboardPath(user.role) : s.href}>
                            Explore Portal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* ── Projects Tab ── */}
              <TabsContent value="projects">
                <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Active projects</p>
                    <h2
                      className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Making a difference, together
                    </h2>
                    <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
                      Browse CSR projects across Digital Education, Literacy, Infrastructure, and Vocational training.
                    </p>
                  </div>
                </div>

                <div className="mb-8 flex flex-wrap items-center gap-2">
                  {locations.map((loc) => (
                    <Button
                      key={loc}
                      variant={selectedLocation === loc ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLocation(loc)}
                      className="gap-1.5"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {loc}
                    </Button>
                  ))}
                </div>

                {filteredProjects.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((p) => (
                      <ProjectCard key={p.title} project={p} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground/40" />
                    <p className="text-muted-foreground">No projects found in this location.</p>
                  </div>
                )}
              </TabsContent>

              {/* ── Partnerships Tab ── */}
              <TabsContent value="partnerships">
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="grid items-center md:grid-cols-2">
                    <div className="flex flex-col gap-6 p-8 md:p-12 lg:p-16">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                        <Handshake className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
                          Section 8 Partnerships
                        </p>
                        <h2
                          className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          Partner with Section 8 companies
                        </h2>
                        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                          Collaborate with registered Section 8 companies to maximize your CSR impact. Submit partnership proposals, receive approvals, and co-create projects that drive lasting social change.
                        </p>
                      </div>
                      <ul className="flex flex-col gap-3">
                        {[
                          { icon: FileCheck, label: "Submit partnership proposals easily" },
                          { icon: Users, label: "Collaborate across organizations" },
                          { icon: Handshake, label: "Receive fast approvals and onboarding" },
                        ].map((item) => (
                          <li key={item.label} className="flex items-center gap-3 text-sm text-foreground">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10">
                              <item.icon className="h-4 w-4 text-accent" />
                            </div>
                            {item.label}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-fit gap-2" asChild>
                        <Link href="/register">
                          Submit a Proposal <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className="flex items-center justify-center bg-secondary/40 p-8 md:p-12 lg:p-16">
                      <div className="flex w-full max-w-sm flex-col gap-4">
                        {[
                          { step: "01", title: "Register Your Organization", desc: "Create your account and verify your Section 8 registration status." },
                          { step: "02", title: "Submit a Proposal", desc: "Outline your CSR project goals, budget, and expected outcomes." },
                          { step: "03", title: "Get Matched & Approved", desc: "Connect with funders and beneficiaries and start making an impact." },
                        ].map((item) => (
                          <div
                            key={item.step}
                            className="flex gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
                          >
                            <span
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              {item.step}
                            </span>
                            <div>
                              <h4 className="font-semibold text-foreground">{item.title}</h4>
                              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2
              className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to make an impact?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-primary-foreground/80">
              Join hundreds of organizations building a better future through transparent, collaborative CSR initiatives.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="gap-2 px-8 text-base" asChild>
                <Link href="/register">
                  Create Your Account <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent px-8 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

/* ─── Reusable Project Card ─── */

function ProjectCard({ project: p }: { project: typeof projects[number] }) {
  return (
    <Card className="group border-border bg-card transition-all hover:shadow-lg">
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <p.icon className="h-5 w-5 text-primary" />
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">{p.status}</Badge>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-muted-foreground">{p.category}</p>
            <span className="text-muted-foreground/40">|</span>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {p.location}
            </p>
          </div>
          <h3 className="mt-1 font-semibold text-foreground">{p.title}</h3>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Raised: {p.raised}</span>
            <span>Goal: {p.target}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${p.progress}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <span>By {p.funder}</span>
          <span>{p.beneficiaries} beneficiaries</span>
        </div>
      </CardContent>
    </Card>
  )
}
