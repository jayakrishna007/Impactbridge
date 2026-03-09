"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { apiLogin, apiUpdatePortfolio, UserData } from "@/lib/api"

export type UserRole = "ngo" | "funder" | "beneficiary"

export interface User {
    id?: string
    name: string
    email: string
    role: UserRole
    hasProfile?: boolean
    portfolio?: {
        about?: string
        mission?: string
        vision?: string
        experience?: string
        contact?: {
            phone?: string
            website?: string
            address?: string
        }
    }
}

interface AuthContextType {
    user: User | null
    login: (name: string, email: string, role: UserRole) => Promise<{ hasProfile: boolean; error?: string }>
    updatePortfolio: (data: Partial<User["portfolio"]>) => Promise<void>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => ({ hasProfile: false }),
    updatePortfolio: async () => { },
    logout: () => { },
    isLoading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // ── Rehydrate from localStorage on first render ────────────────────
    useEffect(() => {
        try {
            const stored = localStorage.getItem("impactbridge_user")
            if (stored) setUser(JSON.parse(stored))
        } catch { }
        setIsLoading(false)
    }, [])

    // ── Login ──────────────────────────────────────────────────────────
    const login = async (
        name: string,
        email: string,
        role: UserRole
    ): Promise<{ hasProfile: boolean; error?: string }> => {
        try {
            // Call the Python/FastAPI backend → MongoDB
            const userData: UserData = await apiLogin(name, email, role)
            const loggedIn: User = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role as UserRole,
                hasProfile: userData.hasProfile,
                portfolio: userData.portfolio as User["portfolio"],
            }
            setUser(loggedIn)
            localStorage.setItem("impactbridge_user", JSON.stringify(loggedIn))
            return { hasProfile: !!loggedIn.hasProfile }

        } catch (err: any) {
            // ── Fix 1: Surface role-mismatch error from backend ────────
            // Backend returns 403 with a detail message explaining the issue
            if (err.message && err.message.includes("registered as a")) {
                return { hasProfile: false, error: err.message }
            }

            // ── Graceful fallback to localStorage when backend is offline ──
            console.warn("Backend offline – falling back to localStorage:", err)
            const allUsersRaw = localStorage.getItem("impactbridge_all_users")
            const allUsers: User[] = allUsersRaw ? JSON.parse(allUsersRaw) : []
            const existing = allUsers.find(u => u.email === email)

            // Offline: also enforce role check locally
            if (existing && existing.role !== role) {
                const errorMessage = `This email is already registered as a '${existing.role}'. Please select '${existing.role}' as your role.`
                return {
                    hasProfile: false,
                    error: errorMessage
                }
            }

            const userToLogin: User = existing
                ? { ...existing }
                : { name, email, role, hasProfile: false }

            if (!existing) {
                allUsers.push(userToLogin)
                localStorage.setItem("impactbridge_all_users", JSON.stringify(allUsers))
            }

            setUser(userToLogin)
            localStorage.setItem("impactbridge_user", JSON.stringify(userToLogin))
            return { hasProfile: !!userToLogin.hasProfile }
        }
    }

    // ── Update Portfolio ───────────────────────────────────────────────
    const updatePortfolio = async (data: Partial<User["portfolio"]>) => {
        if (!user) return

        const updatedPortfolio = { ...user.portfolio, ...data }
        const updatedUser: User = {
            ...user,
            hasProfile: true,
            portfolio: updatedPortfolio,
        }

        // Optimistic UI update
        setUser(updatedUser)
        localStorage.setItem("impactbridge_user", JSON.stringify(updatedUser))

        try {
            // Persist to MongoDB via backend
            await apiUpdatePortfolio(user.email, updatedPortfolio)
        } catch (err) {
            // Backend offline – localStorage already updated above
            console.warn("Portfolio saved to localStorage only (backend offline):", err)
        }

        // Keep "all_users" localStorage in sync (for offline fallback)
        try {
            const allUsersRaw = localStorage.getItem("impactbridge_all_users")
            const allUsers: User[] = allUsersRaw ? JSON.parse(allUsersRaw) : []
            const idx = allUsers.findIndex(u => u.email === user.email)
            if (idx !== -1) allUsers[idx] = updatedUser
            else allUsers.push(updatedUser)
            localStorage.setItem("impactbridge_all_users", JSON.stringify(allUsers))
        } catch { }
    }

    // ── Logout ─────────────────────────────────────────────────────────
    const logout = () => {
        setUser(null)
        localStorage.removeItem("impactbridge_user")
    }

    return (
        <AuthContext.Provider value={{ user, login, updatePortfolio, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}

/** Maps a role to its profile/dashboard route */
export function getDashboardPath(role: UserRole, hasProfile: boolean = false): string {
    if (!hasProfile) return "/profile/setup"
    switch (role) {
        case "ngo": return "/ngo-dashboard"
        case "funder": return "/funders"
        case "beneficiary": return "/beneficiaries"
    }
}

/** Human-readable role labels */
export function getRoleLabel(role: UserRole): string {
    switch (role) {
        case "ngo": return "NGO"
        case "funder": return "Funder"
        case "beneficiary": return "Beneficiary"
    }
}
