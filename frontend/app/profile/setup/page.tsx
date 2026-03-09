"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, getDashboardPath } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, User, Building2, Globe, MapPin, Phone, Briefcase, Rocket, Loader2 } from "lucide-react"

export default function ProfileSetupPage() {
    const router = useRouter()
    const { user, updatePortfolio, isLoading } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const [formData, setFormData] = useState({
        about: "",
        mission: "",
        vision: "",
        experience: "",
        phone: "",
        website: "",
        address: ""
    })

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login")
            } else if (user.hasProfile) {
                // Already has a profile — skip setup and go straight to dashboard
                router.push(getDashboardPath(user.role, true))
            }
        }
    }, [user, isLoading, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        await updatePortfolio({
            about: formData.about,
            mission: formData.mission,
            vision: formData.vision,
            experience: formData.experience,
            contact: {
                phone: formData.phone,
                website: formData.website,
                address: formData.address
            }
        })

        setIsSubmitting(false)
        setIsSuccess(true)

        setTimeout(() => {
            if (user) {
                router.push(getDashboardPath(user.role, true))
            }
        }, 1500)
    }

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 bg-secondary/20 py-12 px-6">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                            Complete Your Profile
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Tell us more about your {user.role === 'ngo' ? 'organization' : user.role === 'funder' ? 'company' : 'background'} to build your portfolio.
                        </p>
                    </div>

                    <Card className="border-border shadow-md">
                        <CardHeader>
                            <CardTitle>Professional Portfolio</CardTitle>
                            <CardDescription>This information will be visible to potential partners on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isSuccess ? (
                                <div className="flex flex-col items-center py-12 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 animate-in zoom-in">
                                        <CheckCircle2 className="h-8 w-8 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground">Portfolio Created!</h2>
                                    <p className="mt-2 text-muted-foreground">Redirecting you to your dashboard...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="about">About {user.role === 'ngo' ? 'Organization' : 'Me'}</Label>
                                            <Textarea
                                                id="about"
                                                placeholder="Brief description of your work..."
                                                value={formData.about}
                                                onChange={handleChange}
                                                required
                                                className="min-h-[100px]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mission">Mission Statement</Label>
                                            <Textarea
                                                id="mission"
                                                placeholder="What is your primary goal?"
                                                value={formData.mission}
                                                onChange={handleChange}
                                                required
                                                className="min-h-[100px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="experience">Years of Experience / Track Record</Label>
                                        <Input
                                            id="experience"
                                            placeholder="e.g. 5 years in educational development"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input id="phone" className="pl-10" placeholder="+91 ..." value={formData.phone} onChange={handleChange} required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="website">Website / Portfolio Link</Label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input id="website" className="pl-10" placeholder="https://..." value={formData.website} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Location / Address</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input id="address" className="pl-10" placeholder="City, State" value={formData.address} onChange={handleChange} required />
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-12 text-lg shadow-md" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Building Portfolio...
                                            </>
                                        ) : (
                                            <>
                                                <Rocket className="mr-2 h-5 w-5" /> Save and Continue to Dashboard
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
