"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, User as UserIcon, LogOut } from "lucide-react"
import { NotificationBell } from "@/components/notification-bell"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth, getDashboardPath, getRoleLabel } from "@/lib/auth-context"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "CSR Projects", href: "/csr-projects" },
  { label: "NGO Proposal", href: "/ngo-proposal" },
  { label: "Individual Proposals", href: "/individual-proposals" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Returns true if the current route matches or starts with the link href
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <header className="sticky top-0 z-50 bg-blue-700 shadow-lg">
      <nav className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-4 lg:px-6 py-3 relative">

        {/* Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
              ImpactBridge
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center justify-center gap-0 xl:flex flex-1 px-4">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${active
                  ? "text-white bg-white/20"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4/5 rounded-full bg-white" />
                )}
              </Link>
            )
          })}

          {/* Companies List Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${pathname.startsWith("/companies-list")
                ? "text-white bg-white/20"
                : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}>
                Companies List <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px] p-2">
              <DropdownMenuItem asChild>
                <Link href="/companies-list?type=ngo" className="w-full cursor-pointer py-2">
                  NGO&apos;s List
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/companies-list?type=csr" className="w-full cursor-pointer py-2">
                  Funders List
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Products & Services (Funders only) */}
          {user?.role === "funder" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${pathname.startsWith("/products") || pathname.startsWith("/services")
                  ? "text-white bg-white/20"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}>
                  Products &amp; Services <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px] p-2">
                <DropdownMenuItem asChild>
                  <Link href="/products" className="w-full cursor-pointer py-2 font-medium">Products</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services" className="w-full cursor-pointer py-2 font-medium">Services</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* About Us Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${pathname.startsWith("/about-us") || pathname.startsWith("/board-of-advisors")
                ? "text-white bg-white/20"
                : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}>
                About Us <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px] p-2">
              <DropdownMenuItem asChild>
                <Link href="/about-us" className="w-full cursor-pointer py-2">About Us</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/board-of-advisors" className="w-full cursor-pointer py-2">Board of Advisors</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* My Dashboard */}
          {user && (
            <Link
              href={getDashboardPath(user.role)}
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-150 relative ${pathname.startsWith("/funders") || pathname.startsWith("/ngo-dashboard") || pathname.startsWith("/beneficiaries")
                ? "text-white bg-white/20"
                : "text-yellow-300 hover:text-white hover:bg-white/10"
                }`}
            >
              My Dashboard
              {(pathname.startsWith("/funders") || pathname.startsWith("/ngo-dashboard") || pathname.startsWith("/beneficiaries")) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4/5 rounded-full bg-white" />
              )}
            </Link>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center justify-end gap-3 xl:flex shrink-0 min-w-[180px]">
          {user && <NotificationBell />}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 pl-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white">
                    <UserIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col items-start px-1 text-left">
                    <span className="text-xs font-semibold leading-none">{user.name}</span>
                    <span className="text-[10px] text-blue-100 mt-0.5">{getRoleLabel(user.role)}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-blue-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 flex flex-col gap-1">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardPath(user.role)}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="flex items-center justify-center rounded-md p-2 text-white xl:hidden shrink-0"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-white/20 bg-blue-800 px-6 py-4 xl:hidden">
          <div className="flex flex-col gap-1">
            {user && (
              <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/10 p-3 border border-white/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                  <span className="text-xs text-blue-200">{getRoleLabel(user.role)}</span>
                </div>
                <NotificationBell />
              </div>
            )}

            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-white/20 text-white font-semibold" : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}

            <p className="mt-3 mb-1 text-xs font-semibold uppercase tracking-wider text-blue-300 px-3">Companies List</p>
            {[
              { label: "NGO's List", href: "/companies-list?type=ngo" },
              { label: "Funders List", href: "/companies-list?type=csr" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className={`rounded-md px-6 py-2.5 text-sm transition-colors ${pathname.includes("companies-list") ? "bg-white/20 text-white font-semibold" : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                onClick={() => setMobileOpen(false)}>{l.label}</Link>
            ))}

            {user?.role === "funder" && (
              <>
                <p className="mt-3 mb-1 text-xs font-semibold uppercase tracking-wider text-blue-300 px-3">Products &amp; Services</p>
                {[
                  { label: "Products", href: "/products" },
                  { label: "Services", href: "/services" },
                ].map((l) => (
                  <Link key={l.href} href={l.href}
                    className={`rounded-md px-6 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith(l.href) ? "bg-white/20 text-white" : "text-blue-100 hover:bg-white/10 hover:text-white"
                      }`}
                    onClick={() => setMobileOpen(false)}>{l.label}</Link>
                ))}
              </>
            )}

            <p className="mt-3 mb-1 text-xs font-semibold uppercase tracking-wider text-blue-300 px-3">About</p>
            {[
              { label: "About Us", href: "/about-us" },
              { label: "Board of Advisors", href: "/board-of-advisors" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className={`rounded-md px-6 py-2.5 text-sm transition-colors ${pathname === l.href ? "bg-white/20 text-white font-semibold" : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                onClick={() => setMobileOpen(false)}>{l.label}</Link>
            ))}

            {user && (
              <Link
                href={getDashboardPath(user.role)}
                className={`rounded-md px-3 py-2.5 text-sm font-semibold transition-colors mt-1 ${pathname.startsWith("/funders") || pathname.startsWith("/ngo-dashboard") || pathname.startsWith("/beneficiaries")
                  ? "bg-white/20 text-white"
                  : "text-yellow-300 hover:bg-white/10 hover:text-white"
                  }`}
                onClick={() => setMobileOpen(false)}
              >
                My Dashboard
              </Link>
            )}

            <div className="my-3 h-px bg-white/20" />

            <div className="flex flex-col gap-2">
              {user ? (
                <Button variant="outline" className="w-full border-white/30 text-white bg-white/10 hover:bg-white/20" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Log Out
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20">
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild className="w-full bg-white text-blue-700 hover:bg-blue-50 font-semibold">
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
