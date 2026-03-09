import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.45_0.18_160/0.08),transparent_60%),radial-gradient(ellipse_at_bottom_left,oklch(0.55_0.15_45/0.06),transparent_60%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl flex-col items-center justify-center px-6 py-20">
        <div className="flex w-full flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-secondary-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Uniting stakeholders for social impact
          </div>

          <h1
            className="max-w-4xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            One Platform For{" "}
            <span className="text-primary">Transparent</span>{" "}
            CSR Impact
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            ImpactBridge connects Beneficiaries, Funders, and Implementers on a
            single platform -- enabling collaboration, transparency, and
            measurable social change.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8 text-base" asChild>
              <Link href="/register">
                Start Your Journey <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 text-base" asChild>
              <Link href="/how-it-works">See How It Works</Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}
