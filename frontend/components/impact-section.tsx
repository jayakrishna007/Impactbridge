import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Globe, Award, ShieldCheck } from "lucide-react"

const stats = [
  {
    icon: TrendingUp,
    value: "98%",
    label: "Fund utilization rate",
    description: "Transparent tracking ensures maximum impact",
  },
  {
    icon: Globe,
    value: "18",
    label: "States covered",
    description: "Pan-India reach across rural and urban areas",
  },
  {
    icon: Award,
    value: "200+",
    label: "Beneficiaries served",
    description: "Thousands of lives transformed through CSR",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Audit compliant",
    description: "End-to-end compliance with CSR regulations",
  },
]

export function ImpactSection() {
  return (
    <section id="impact" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Measurable impact
          </p>
          <h2
            className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Numbers that tell our story
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Every rupee, every project, every life changed -- tracked and
            reported with complete transparency.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-border bg-card text-center transition-shadow hover:shadow-md"
            >
              <CardContent className="flex flex-col items-center gap-3 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <span
                  className="text-3xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-foreground">{stat.label}</span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {stat.description}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
