"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import {
    GraduationCap,
    HeartPulse,
    Landmark,
    Building,
    Users,
    School,
    BookOpen,
    Globe,
    FileText,
} from "lucide-react"
import {
    apiGetNgoProposals,
    apiGetIndividualProposals,
    apiGetCsrProjects,
    apiCreateNgoProposal,
    apiCreateIndividualProposal,
    NGOProposalData,
    IndividualProposalData,
    CSRProjectData,
} from "@/lib/api"

// ── Icon map (icons can't be stored in MongoDB, so we assign locally) ──
const ICON_MAP: Record<string, any> = {
    "Primary Education": GraduationCap,
    "Teacher Training": GraduationCap,
    "Higher Education": GraduationCap,
    "Digital Education": BookOpen,
    "Curriculum Design": FileText,
    "School Infrastructure": Landmark,
    "Infrastructure": Landmark,
    "Skill Development": Building,
    "Vocational": Building,
    "Support Services": HeartPulse,
    "Scholarships": Users,
    "Literacy": BookOpen,
    "STEM": GraduationCap,
}

function iconForCategory(category: string) {
    return ICON_MAP[category] ?? BookOpen
}

// ── Types (extend backend types with a local `icon` field) ───────────────
export interface NGOProposal extends NGOProposalData {
    icon: any
}

export interface IndividualProposal extends IndividualProposalData {
    icon: any
}

export interface CSRProject extends CSRProjectData {
    icon: any
}

// ── Fallback seed data (shown when backend is offline) ───────────────────
const FALLBACK_NGO_PROPOSALS: NGOProposal[] = [
    { id: "ngo-1", icon: GraduationCap, ngoName: "Pratham Education Foundation", title: "Digital Classrooms for Rural India", category: "Primary Education", fundingRequired: "1.5 Cr", fundingRaised: "20 L", progress: 13, beneficiaries: 2000, status: "Seeking Funding", location: "Rajasthan", deadline: "Apr 30, 2026", description: "Setting up 50 digital classrooms with tablets, projectors, and internet in remote Rajasthan villages." },
    { id: "ngo-2", icon: BookOpen, ngoName: "Teach For India", title: "Fellowship for Under-resourced Schools", category: "Teacher Training", fundingRequired: "2 Cr", fundingRaised: "45 L", progress: 23, beneficiaries: 5000, status: "Seeking Funding", location: "Maharashtra", deadline: "May 15, 2026", description: "Placing high-potential fellows in low-income schools to drive systemic change." },
    { id: "ngo-3", icon: Landmark, ngoName: "Room to Read", title: "Library Infrastructure Project", category: "School Infrastructure", fundingRequired: "80 L", fundingRaised: "30 L", progress: 38, beneficiaries: 800, status: "Partially Funded", location: "Karnataka", deadline: "Jun 01, 2026", description: "Building state-of-the-art libraries in 40 government schools." },
    { id: "ngo-4", icon: Building, ngoName: "Magic Bus India Foundation", title: "Vocational Skills for School Graduates", category: "Skill Development", fundingRequired: "60 L", fundingRaised: "10 L", progress: 17, beneficiaries: 300, status: "Seeking Funding", location: "Gujarat", deadline: "Jul 20, 2026", description: "Preparing adolescent students with life skills and vocational training." },
    { id: "ngo-5", icon: GraduationCap, ngoName: "Lila Poonawalla Foundation", title: "STEM Scholarships for Girls", category: "Higher Education", fundingRequired: "1.2 Cr", fundingRaised: "30 L", progress: 25, beneficiaries: 800, status: "Partially Funded", location: "Uttar Pradesh", deadline: "Aug 30, 2026", description: "Merit-cum-need scholarships and mentorship for girls pursuing science, technology, engineering, and mathematics degrees." },
    { id: "ngo-6", icon: Users, ngoName: "Lila Poonawalla Foundation", title: "Scholarships for Girls in STEM", category: "Higher Education", fundingRequired: "90 L", fundingRaised: "15 L", progress: 17, beneficiaries: 500, status: "Seeking Funding", location: "Tamil Nadu", deadline: "Sep 15, 2026", description: "Merit-cum-need scholarships to girls pursuing engineering degrees." },
    { id: "ngo-7", icon: BookOpen, ngoName: "Pratham Education Foundation", title: "Adult Literacy Drive", category: "Literacy", fundingRequired: "40 L", fundingRaised: "8 L", progress: 20, beneficiaries: 3000, status: "Seeking Funding", location: "Madhya Pradesh", deadline: "Oct 15, 2026", description: "Evening literacy classes for adults in rural areas using volunteer teachers and mobile learning kits." },
    { id: "ngo-8", icon: FileText, ngoName: "National Independent Schools Alliance", title: "Curriculum Modernization Initiative", category: "Curriculum Design", fundingRequired: "1.8 Cr", fundingRaised: "25 L", progress: 14, beneficiaries: 12000, status: "Seeking Funding", location: "Pan India", deadline: "Nov 30, 2026", description: "Developing interactive curriculum materials for affordable private schools." },
]

const FALLBACK_INDIVIDUAL_PROPOSALS: IndividualProposal[] = [
    { id: "ind-1", icon: BookOpen, name: "Rahul Sharma", title: "Village Reading Hubs", category: "Literacy", fundingRequired: "5 L", fundingRaised: "1 L", progress: 20, beneficiaries: 50, status: "Seeking Funding", location: "Maharashtra", deadline: "Dec 31, 2026", description: "Creating small reading corners in village squares for rural children." },
    { id: "ind-2", icon: GraduationCap, name: "Priya Desai", title: "After-school STEM Mentorship", category: "STEM", fundingRequired: "2 L", fundingRaised: "1.5 L", progress: 75, beneficiaries: 100, status: "Partially Funded", location: "Karnataka", deadline: "Aug 15, 2026", description: "Free science and math experiments for underprivileged students after school." },
    { id: "ind-3", icon: School, name: "Amit Patel", title: "Affordable E-Learning Tablets", category: "Digital Education", fundingRequired: "8 L", fundingRaised: "2 L", progress: 25, beneficiaries: 500, status: "Seeking Funding", location: "Gujarat", deadline: "Oct 10, 2026", description: "Low-cost tablets pre-loaded with regional language curriculum for remote areas." },
]

const FALLBACK_CSR_PROJECTS: CSRProject[] = [
    { id: "csr-1", icon: BookOpen, title: "Digital Literacy for Rural Schools", category: "Digital Education", funder: "Tata Trusts", raised: "1.2 Cr", target: "2 Cr", progress: 60, beneficiaries: 450, status: "Active", location: "Rajasthan", deadline: "Dec 31, 2025", description: "Equipping 100 rural government schools with computers, internet connectivity, and trained digital educators to bridge the urban-rural education divide." },
    { id: "csr-2", icon: GraduationCap, title: "Mobile Library Initiative", category: "Literacy", funder: "Reliance Foundation", raised: "85 L", target: "1.5 Cr", progress: 57, beneficiaries: 320, status: "Active", location: "Maharashtra", deadline: "Mar 31, 2026", description: "Deploying mobile library vans stocked with books across 60 remote villages to promote a culture of reading among children aged 6–14." },
    { id: "csr-3", icon: Landmark, title: "Smart Classroom Upgrade", category: "Infrastructure", funder: "Infosys Foundation", raised: "2.1 Cr", target: "2.5 Cr", progress: 84, beneficiaries: 1200, status: "Active", location: "Karnataka", deadline: "Jun 30, 2025", description: "Transforming traditional classrooms with interactive smart boards, projectors, and e-learning tools in 30 government high schools." },
    { id: "csr-4", icon: Building, title: "Vocational Excellence Center", category: "Vocational", funder: "Wipro Foundation", raised: "60 L", target: "1 Cr", progress: 60, beneficiaries: 180, status: "Active", location: "Tamil Nadu", deadline: "Sep 30, 2025", description: "Establishing a state-of-the-art vocational training center offering courses in electrical work, tailoring, catering, and IT for school dropouts." },
    { id: "csr-5", icon: Users, title: "Girl Child Scholarship Fund", category: "Scholarships", funder: "Mahindra Foundation", raised: "60 L", target: "1.8 Cr", progress: 33, beneficiaries: 520, status: "Active", location: "Uttar Pradesh", deadline: "Apr 15, 2026", description: "Providing need-based scholarships to girls from marginalized communities to complete secondary and higher secondary education." },
    { id: "csr-6", icon: School, title: "Govt School Model Makeover", category: "Infrastructure", funder: "Adani Foundation", raised: "1.1 Cr", target: "3 Cr", progress: 37, beneficiaries: 800, status: "Active", location: "Gujarat", deadline: "Aug 31, 2026", description: "Renovating 25 government primary schools with new classrooms, clean drinking water facilities, gender-segregated toilets, and learning parks." },
    { id: "csr-7", icon: GraduationCap, title: "STEM Education Drive", category: "Primary Education", funder: "HCL Foundation", raised: "45 L", target: "1.2 Cr", progress: 38, beneficiaries: 600, status: "Active", location: "Telangana", deadline: "Nov 30, 2025", description: "Establishing science labs and STEM kits in government schools to inspire curiosity and hands-on learning from an early age." },
    { id: "csr-8", icon: BookOpen, title: "Teacher Upskilling Programme", category: "Teacher Training", funder: "Bajaj Auto Ltd", raised: "30 L", target: "75 L", progress: 40, beneficiaries: 250, status: "Active", location: "Maharashtra", deadline: "Jan 31, 2026", description: "Training 500 government school teachers in modern pedagogy, digital tools, and inclusive teaching practices over 12 months." },
]

// ── Context type ─────────────────────────────────────────────────────────
interface ProposalsContextType {
    ngoProposals: NGOProposal[]
    individualProposals: IndividualProposal[]
    csrProjects: CSRProject[]
    isLoadingData: boolean
    addNgoProposal: (proposal: Omit<NGOProposalData, "id" | "fundingRaised" | "progress" | "status">) => Promise<void>
    addIndividualProposal: (proposal: Omit<IndividualProposalData, "id" | "fundingRaised" | "progress" | "status">) => Promise<void>
}

const ProposalsContext = createContext<ProposalsContextType | undefined>(undefined)

export function ProposalsProvider({ children }: { children: ReactNode }) {
    const [ngoProposals, setNgoProposals] = useState<NGOProposal[]>(FALLBACK_NGO_PROPOSALS)
    const [individualProposals, setIndividualProposals] = useState<IndividualProposal[]>(FALLBACK_INDIVIDUAL_PROPOSALS)
    const [csrProjects, setCsrProjects] = useState<CSRProject[]>(FALLBACK_CSR_PROJECTS)
    const [isLoadingData, setIsLoadingData] = useState(true)

    // ── Load data from backend on mount ──────────────────────────────────
    useEffect(() => {
        let cancelled = false

        async function loadAll() {
            setIsLoadingData(true)
            try {
                const [ngo, ind, csr] = await Promise.all([
                    apiGetNgoProposals(),
                    apiGetIndividualProposals(),
                    apiGetCsrProjects(),
                ])

                if (cancelled) return

                // Attach icons (not stored in MongoDB)
                setNgoProposals(ngo.map(p => ({ ...p, icon: iconForCategory(p.category) })))
                setIndividualProposals(ind.map(p => ({ ...p, icon: iconForCategory(p.category) })))
                setCsrProjects(csr.map(p => ({ ...p, icon: iconForCategory(p.category) })))

            } catch (err) {
                // Backend offline → use fallback seed data already in state
                console.warn("Backend offline – using local seed data:", err)
            } finally {
                if (!cancelled) setIsLoadingData(false)
            }
        }

        loadAll()
        return () => { cancelled = true }
    }, [])

    // ── Add NGO Proposal ─────────────────────────────────────────────────
    const addNgoProposal = async (
        data: Omit<NGOProposalData, "id" | "fundingRaised" | "progress" | "status">
    ) => {
        try {
            // Save to MongoDB via backend
            const saved = await apiCreateNgoProposal(data)
            const withIcon: NGOProposal = { ...saved, icon: iconForCategory(saved.category) }
            setNgoProposals(prev => [withIcon, ...prev])
        } catch (err) {
            // Offline fallback – add locally only
            console.warn("Backend offline – adding proposal locally:", err)
            const local: NGOProposal = {
                id: `ngo-local-${Date.now()}`,
                fundingRaised: "0",
                progress: 0,
                status: "Seeking Funding",
                icon: iconForCategory(data.category),
                ...data,
                beneficiaries: data.beneficiaries ?? 0,
            }
            setNgoProposals(prev => [local, ...prev])
        }
    }

    // ── Add Individual Proposal ──────────────────────────────────────────
    const addIndividualProposal = async (
        data: Omit<IndividualProposalData, "id" | "fundingRaised" | "progress" | "status">
    ) => {
        try {
            const saved = await apiCreateIndividualProposal(data)
            const withIcon: IndividualProposal = { ...saved, icon: iconForCategory(saved.category) }
            setIndividualProposals(prev => [withIcon, ...prev])
        } catch (err) {
            console.warn("Backend offline – adding proposal locally:", err)
            const local: IndividualProposal = {
                id: `ind-local-${Date.now()}`,
                fundingRaised: "0",
                progress: 0,
                status: "Seeking Funding",
                icon: iconForCategory(data.category),
                ...data,
                beneficiaries: data.beneficiaries ?? 0,
            }
            setIndividualProposals(prev => [local, ...prev])
        }
    }

    return (
        <ProposalsContext.Provider value={{
            ngoProposals,
            individualProposals,
            csrProjects,
            isLoadingData,
            addNgoProposal,
            addIndividualProposal,
        }}>
            {children}
        </ProposalsContext.Provider>
    )
}

export function useProposals() {
    const context = useContext(ProposalsContext)
    if (context === undefined) {
        throw new Error("useProposals must be used within a ProposalsProvider")
    }
    return context
}
