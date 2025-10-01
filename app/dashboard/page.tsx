"use client"

import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"
import { FarmDashboard } from "@/components/farm-dashboard"

export default function DashboardPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const path = usePathname()

    useEffect(() => {
        if (!loading && !user) {
            const next = encodeURIComponent(path)
            router.replace(`/login?next=${next}`)
        }
    }, [loading, user, router, path])

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return <FarmDashboard/>
}