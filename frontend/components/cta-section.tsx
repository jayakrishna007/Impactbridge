import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2
          className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ready to make an impact?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-primary-foreground/80">
          Join hundreds of organizations building a better future through
          transparent, collaborative CSR initiatives.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 px-8 text-base"
            asChild
          >
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
            <Link href="#how-it-works">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
