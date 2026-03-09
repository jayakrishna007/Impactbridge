/**
 * api.ts  –  Central API client for ImpactBridge
 *
 * All calls to the Python/FastAPI backend go through here.
 * Base URL is read from the environment variable NEXT_PUBLIC_API_URL.
 *
 * Set in .env.local:
 *   NEXT_PUBLIC_API_URL=http://localhost:8000     (local dev)
 *   NEXT_PUBLIC_API_URL=https://your-api.render.com  (production)
 */

const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Generic fetch wrapper ────────────────────────────────────────────────
async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "API Error");
    }
    return res.json() as Promise<T>;
}

// ══════════════════════════════════════════════════════════════════════════
// Auth
// ══════════════════════════════════════════════════════════════════════════

export interface UserData {
    id?: string;
    name: string;
    email: string;
    role: string;
    hasProfile: boolean;
    portfolio?: Record<string, any>;
}

/** Login (or auto-register) a user. Returns full user record.
 *  Throws an Error with a human-readable message if role mismatches. */
export async function apiLogin(
    name: string,
    email: string,
    role: string
): Promise<UserData> {
    return apiFetch<UserData>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ name, email, role }),
    });
}

/** Update a user's portfolio. */
export async function apiUpdatePortfolio(
    email: string,
    portfolio: Record<string, any>
): Promise<{ status: string; hasProfile: boolean; portfolio: Record<string, any> }> {
    return apiFetch(`/user/portfolio?email=${encodeURIComponent(email)}`, {
        method: "PUT",
        body: JSON.stringify(portfolio),
    });
}

/** Get a specific user by email. */
export async function apiGetUser(email: string): Promise<UserData> {
    return apiFetch<UserData>(`/user/${encodeURIComponent(email)}`);
}

// ══════════════════════════════════════════════════════════════════════════
// NGO Proposals
// ══════════════════════════════════════════════════════════════════════════

export interface NGOProposalData {
    id: string;
    ngoName: string;
    title: string;
    category: string;
    fundingRequired: string;
    fundingRaised: string;
    progress: number;
    beneficiaries: number;
    status: string;
    location: string;
    deadline: string;
    description: string;
    createdBy?: string;
    fullDetails?: Record<string, any>;
}

export async function apiGetNgoProposals(): Promise<NGOProposalData[]> {
    return apiFetch<NGOProposalData[]>("/proposals/ngo");
}

/** Get only the proposals created by a specific user (for dashboard history) */
export async function apiGetMyNgoProposals(email: string): Promise<NGOProposalData[]> {
    return apiFetch<NGOProposalData[]>(`/proposals/ngo/by-user/${encodeURIComponent(email)}`);
}

export async function apiGetNgoProposal(id: string): Promise<NGOProposalData> {
    return apiFetch<NGOProposalData>(`/proposals/ngo/${id}`);
}

export async function apiCreateNgoProposal(
    data: Omit<NGOProposalData, "id" | "fundingRaised" | "progress" | "status"> & { createdBy?: string }
): Promise<NGOProposalData> {
    return apiFetch<NGOProposalData>("/proposals/ngo", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// ══════════════════════════════════════════════════════════════════════════
// Individual Proposals
// ══════════════════════════════════════════════════════════════════════════

export interface IndividualProposalData {
    id: string;
    name: string;
    title: string;
    category: string;
    fundingRequired: string;
    fundingRaised: string;
    progress: number;
    beneficiaries: number;
    status: string;
    location: string;
    deadline: string;
    description: string;
    createdBy?: string;
    fullDetails?: Record<string, any>;
}

export async function apiGetIndividualProposals(): Promise<IndividualProposalData[]> {
    return apiFetch<IndividualProposalData[]>("/proposals/individual");
}

/** Get only the proposals created by a specific user (for dashboard history) */
export async function apiGetMyIndividualProposals(email: string): Promise<IndividualProposalData[]> {
    return apiFetch<IndividualProposalData[]>(`/proposals/individual/by-user/${encodeURIComponent(email)}`);
}

export async function apiGetIndividualProposal(id: string): Promise<IndividualProposalData> {
    return apiFetch<IndividualProposalData>(`/proposals/individual/${id}`);
}

export async function apiCreateIndividualProposal(
    data: Omit<IndividualProposalData, "id" | "fundingRaised" | "progress" | "status"> & { createdBy?: string }
): Promise<IndividualProposalData> {
    return apiFetch<IndividualProposalData>("/proposals/individual", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// ══════════════════════════════════════════════════════════════════════════
// CSR Projects
// ══════════════════════════════════════════════════════════════════════════

export interface CSRProjectData {
    id: string;
    title: string;
    category: string;
    funder: string;
    raised: string;
    target: string;
    progress: number;
    beneficiaries: number;
    status: string;
    location: string;
    deadline: string;
    description: string;
}

export async function apiGetCsrProjects(): Promise<CSRProjectData[]> {
    return apiFetch<CSRProjectData[]>("/projects/csr");
}

// ══════════════════════════════════════════════════════════════════════════
// Partnerships
// ══════════════════════════════════════════════════════════════════════════

export interface PartnershipData {
    id: string;
    proposalId: string;
    proposalType: string;        // "ngo" | "individual"
    proposalTitle: string;
    funderEmail: string;
    funderName: string;
    partnerEmail: string;
    partnerName: string;
    funderConfirmed: boolean;
    partnerConfirmed: boolean;
    status: string;              // "pending" | "active" | "closed"
    createdAt: string;
    funderConfirmedAt: string | null;
    partnerConfirmedAt: string | null;
}

/** Create a new partnership record (or return existing one). Called when funder lands on /partnership page. */
export async function apiCreatePartnership(data: {
    proposalId: string;
    proposalType: string;
    proposalTitle: string;
    funderEmail: string;
    funderName: string;
    partnerEmail: string;
    partnerName: string;
}): Promise<PartnershipData> {
    return apiFetch<PartnershipData>("/partnerships", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

/** Funder confirms their interest — returns updated partnership. */
export async function apiFunderConfirm(partnershipId: string): Promise<PartnershipData> {
    return apiFetch<PartnershipData>(`/partnerships/${partnershipId}/funder-confirm`, {
        method: "PUT",
    });
}

/** NGO / Beneficiary accepts the partnership — returns updated partnership. */
export async function apiPartnerConfirm(partnershipId: string): Promise<PartnershipData> {
    return apiFetch<PartnershipData>(`/partnerships/${partnershipId}/partner-confirm`, {
        method: "PUT",
    });
}

/** Get a specific partnership between funder + proposal. */
export async function apiGetPartnership(
    proposalType: string,
    proposalId: string,
    funderEmail: string
): Promise<PartnershipData | null> {
    try {
        return await apiFetch<PartnershipData>(
            `/partnerships/${proposalType}/${proposalId}?funder_email=${encodeURIComponent(funderEmail)}`
        );
    } catch {
        return null; // returns null if not found yet
    }
}

/** Get all partnerships for a user (used on NGO/beneficiary dashboard). */
export async function apiGetPartnershipsForUser(email: string): Promise<PartnershipData[]> {
    return apiFetch<PartnershipData[]>(`/partnerships/for-user/${encodeURIComponent(email)}`);
}

// ══════════════════════════════════════════════════════════════════════════
// Notifications
// ══════════════════════════════════════════════════════════════════════════

export interface NotificationData {
    id: string;
    recipientEmail: string;
    senderName: string;
    type: string;            // "fund_interest" | "funder_confirmed" | "partner_confirmed" | "general"
    title: string;
    message: string;
    linkHref: string | null;
    linkLabel: string | null;
    isRead: boolean;
    createdAt: string;
}

/** Get all notifications for a user. */
export async function apiGetNotifications(email: string): Promise<NotificationData[]> {
    return apiFetch<NotificationData[]>(`/notifications/${encodeURIComponent(email)}`);
}

/** Get unread count (for bell badge). */
export async function apiGetUnreadCount(email: string): Promise<{ count: number }> {
    return apiFetch<{ count: number }>(`/notifications/${encodeURIComponent(email)}/unread-count`);
}

/** Mark a single notification as read. */
export async function apiMarkNotificationRead(notificationId: string): Promise<void> {
    await apiFetch(`/notifications/${notificationId}/read`, { method: "PUT" });
}

/** Mark all notifications as read for a user. */
export async function apiMarkAllRead(email: string): Promise<void> {
    await apiFetch(`/notifications/mark-all-read/${encodeURIComponent(email)}`, { method: "PUT" });
}


