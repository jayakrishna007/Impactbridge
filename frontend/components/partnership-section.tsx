import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Handshake, FileCheck, Users } from "lucide-react"

export function PartnershipSection() {
  return (
    <section id="partnerships" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
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
                  Collaborate with registered Section 8 companies to maximize
                  your CSR impact. Submit partnership proposals, receive
                  approvals, and co-create projects that drive lasting social
                  change.
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
                ].map((item, i) => (
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
      </div>
    </section>
  )
}
