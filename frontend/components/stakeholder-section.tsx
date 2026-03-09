import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
} from "lucide-react"

const stakeholders = [
  {
    title: "Beneficiaries",
    description:
      "Discover CSR projects, apply for benefits, and track your progress -- all from a single portal.",
    icon: Users,
    href: "/beneficiaries",
    color: "bg-primary/10 text-primary",
    features: [
      { icon: FileText, label: "Apply to CSR projects" },
      { icon: Users, label: "Profile management" },
      { icon: ClipboardList, label: "Track application status" },
    ],
  },
  {
    title: "Funders",
    description:
      "Track contributions, monitor impact, and access real-time financial transparency on every project you support.",
    icon: DollarSign,
    href: "/funders",
    color: "bg-accent/10 text-accent",
    features: [
      { icon: HandCoins, label: "Fund CSR projects" },
      { icon: BarChart3, label: "Impact analytics" },
      { icon: Eye, label: "Financial transparency" },
    ],
  },
  {
    title: "Implementers",
    description:
      "Manage projects end-to-end, submit reports, collaborate with funders, and deliver measurable results.",
    icon: Building2,
    href: "/implementers",
    color: "bg-chart-3/10 text-chart-3",
    features: [
      { icon: ClipboardList, label: "Project management" },
      { icon: FileText, label: "Report submissions" },
      { icon: Handshake, label: "Funder collaboration" },
    ],
  },
]

export function StakeholderSection() {
  return (
    <section id="how-it-works" className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
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
            Whether you are seeking support, providing funding, or implementing
            projects -- ImpactBridge gives you the tools to make a difference.
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
                  <h3
                    className="text-xl font-bold text-foreground"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
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
                  <Link href={s.href}>
                    Explore Portal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
