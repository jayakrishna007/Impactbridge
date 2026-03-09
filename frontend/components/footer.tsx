import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                ImpactBridge
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Connecting stakeholders for transparent, impactful Corporate Social
              Responsibility initiatives across India.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Stakeholders</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/beneficiaries" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Beneficiaries</Link></li>
              <li><Link href="/funders" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Funders</Link></li>
              <li><Link href="/implementers" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Implementers</Link></li>
              <li><Link href="/register" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Platform</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/#projects" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Projects</Link></li>
              <li><Link href="/#locations" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Projects by Location</Link></li>
              <li><Link href="/#partnerships" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Partnerships</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Compliance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Legal</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">CSR Guidelines</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            ImpactBridge. Building bridges between intention and impact.
          </p>
          <p className="text-xs text-muted-foreground">
            Compliant with Companies Act 2013, Section 135 (CSR)
          </p>
        </div>
      </div>
    </footer>
  )
}
