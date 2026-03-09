import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Building, Landmark, GraduationCap, HeartPulse } from "lucide-react"

const projects = [
  {
    icon: GraduationCap,
    title: "Rural Education Initiative",
    category: "Education",
    funder: "Tata Trusts",
    raised: "1.2 Cr",
    target: "2 Cr",
    progress: 60,
    beneficiaries: 450,
    status: "Active",
  },
  {
    icon: HeartPulse,
    title: "Community Health Program",
    category: "Healthcare",
    funder: "Reliance Foundation",
    raised: "85 L",
    target: "1.5 Cr",
    progress: 57,
    beneficiaries: 320,
    status: "Active",
  },
  {
    icon: Landmark,
    title: "Clean Water Access",
    category: "Infrastructure",
    funder: "Infosys Foundation",
    raised: "2.1 Cr",
    target: "2.5 Cr",
    progress: 84,
    beneficiaries: 1200,
    status: "Active",
  },
  {
    icon: Building,
    title: "Skill Development Hub",
    category: "Livelihood",
    funder: "Wipro Foundation",
    raised: "60 L",
    target: "1 Cr",
    progress: 60,
    beneficiaries: 180,
    status: "Active",
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              Active projects
            </p>
            <h2
              className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Making a difference, together
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
              Browse CSR projects across education, healthcare, environment, and
              livelihoods -- all open for funding and collaboration.
            </p>
          </div>
          <Button variant="outline" className="gap-2 shrink-0" asChild>
            <Link href="#projects">
              View All Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((p) => (
            <Card
              key={p.title}
              className="group border-border bg-card transition-all hover:shadow-lg"
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {p.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">{p.category}</p>
                  <h3 className="mt-1 font-semibold text-foreground">{p.title}</h3>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Raised: {p.raised}</span>
                    <span>Goal: {p.target}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>By {p.funder}</span>
                  <span>{p.beneficiaries} beneficiaries</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
