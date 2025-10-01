"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname, useParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"
import { getFarm } from "@/lib/api"
import type { Farm } from "@/lib/types"
import { FarmView } from "@/components/farm-view"

export default function FarmRoute() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const path = usePathname()
    const params = useParams<{ farmId: string }>()
    const [farm, setFarm] = useState<Farm | null>(null)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        if (!loading && !user) {
            router.replace(`/login?next=${encodeURIComponent(path)}`)
        }
    }, [loading, user, router, path])

    useEffect(() => {
        const run = async () => {
            try {
                if (!params?.farmId || !user) return
                const data = await getFarm(params.farmId)
                setFarm(data)
            } finally {
                setFetching(false)
            }
        }
        run()
    }, [params?.farmId, user])

    if (loading || !user || fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!farm) return <div className="p-6">Farm not found</div>

    return <FarmView farm={farm} onBack={() => router.push("/dashboard")} />
}