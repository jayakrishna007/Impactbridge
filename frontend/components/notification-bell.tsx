"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, BellOff, CheckCheck, Handshake, TrendingUp, Info, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
    apiGetNotifications, apiGetUnreadCount,
    apiMarkNotificationRead, apiMarkAllRead,
    type NotificationData,
} from "@/lib/api"

/* ── Icon by notification type ── */
function NotifIcon({ type }: { type: string }) {
    if (type === "fund_interest") return <Handshake className="h-4 w-4 text-blue-500" />
    if (type === "funder_confirmed") return <TrendingUp className="h-4 w-4 text-amber-500" />
    if (type === "partner_confirmed") return <CheckCheck className="h-4 w-4 text-emerald-500" />
    return <Info className="h-4 w-4 text-muted-foreground" />
}

/* ── Relative time ── */
function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return "Just now"
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
}

const TYPE_BG: Record<string, string> = {
    fund_interest: "bg-blue-50 border-blue-100",
    funder_confirmed: "bg-amber-50 border-amber-100",
    partner_confirmed: "bg-emerald-50 border-emerald-100",
}

export function NotificationBell() {
    const { user } = useAuth()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [notifications, setNotifications] = useState<NotificationData[]>([])
    const [unread, setUnread] = useState(0)
    const [loading, setLoading] = useState(false)
    const dropRef = useRef<HTMLDivElement>(null)

    // Close on outside click
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const fetchCount = useCallback(async () => {
        if (!user?.email) return
        try {
            const res = await apiGetUnreadCount(user.email)
            setUnread(res.count)
        } catch { /* silently fail */ }
    }, [user?.email])

    const fetchAll = useCallback(async () => {
        if (!user?.email) return
        setLoading(true)
        try {
            const data = await apiGetNotifications(user.email)
            setNotifications(data)
            setUnread(data.filter(n => !n.isRead).length)
        } catch { /* silently fail */ } finally {
            setLoading(false)
        }
    }, [user?.email])

    // Poll unread count every 20 seconds
    useEffect(() => {
        if (!user) return
        fetchCount()
        const id = setInterval(fetchCount, 20000)
        return () => clearInterval(id)
    }, [fetchCount, user])

    async function handleOpen() {
        setOpen(o => !o)
        if (!open) await fetchAll()
    }

    async function handleClickNotif(notif: NotificationData) {
        if (!notif.isRead) {
            try { await apiMarkNotificationRead(notif.id) } catch { }
            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n))
            setUnread(c => Math.max(0, c - 1))
        }
        if (notif.linkHref) {
            setOpen(false)
            router.push(notif.linkHref)
        }
    }

    async function handleMarkAllRead() {
        if (!user?.email) return
        try { await apiMarkAllRead(user.email) } catch { }
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        setUnread(0)
    }

    if (!user) return null

    return (
        <div className="relative" ref={dropRef}>
            {/* Bell Button */}
            <button
                id="notification-bell-btn"
                onClick={handleOpen}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-secondary transition-colors"
                title="Notifications"
            >
                <Bell className="h-4 w-4 text-foreground" />
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none animate-in zoom-in-50 duration-200">
                        {unread > 9 ? "9+" : unread}
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {open && (
                <div className="absolute right-0 top-11 z-[200] w-[360px] max-w-[calc(100vw-24px)] rounded-2xl border border-border bg-background shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-sm text-foreground">Notifications</span>
                            {unread > 0 && (
                                <span className="rounded-full bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5">{unread} new</span>
                            )}
                        </div>
                        {unread > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                            >
                                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[420px] overflow-y-auto divide-y divide-border/50">
                        {loading ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-10 text-center px-6">
                                <BellOff className="h-8 w-8 text-muted-foreground/40" />
                                <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
                                <p className="text-xs text-muted-foreground/70">When funders show interest in your proposals, you'll see it here.</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <button
                                    key={notif.id}
                                    onClick={() => handleClickNotif(notif)}
                                    className={`w-full text-left flex gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/60 ${!notif.isRead ? "bg-primary/3" : ""}`}
                                >
                                    {/* Icon circle */}
                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${TYPE_BG[notif.type] ?? "bg-secondary border-border"}`}>
                                        <NotifIcon type={notif.type} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm leading-tight ${!notif.isRead ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
                                                {notif.title}
                                            </p>
                                            {!notif.isRead && (
                                                <span className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                                            {notif.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[10px] text-muted-foreground/70">{relativeTime(notif.createdAt)}</span>
                                            {notif.linkHref && (
                                                <span className="text-[10px] font-medium text-primary flex items-center gap-0.5">
                                                    {notif.linkLabel || "Open"} <ExternalLink className="h-2.5 w-2.5" />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="border-t border-border px-4 py-2.5 text-center">
                            <p className="text-xs text-muted-foreground">{notifications.length} notification{notifications.length !== 1 ? "s" : ""} total</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
