"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname, useParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"
import { getFarm, getPlot } from "@/lib/api"
import type { Farm, Plot } from "@/lib/types"
import { PlotView } from "@/components/plot-view"

export default function PlotRoute() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const path = usePathname()
    const params = useParams<{ farmId: string; plotId: string }>()
    const [farm, setFarm] = useState<Farm | null>(null)
    const [plot, setPlot] = useState<Plot | null>(null)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        if (!loading && !user) {
            router.replace(`/login?next=${encodeURIComponent(path)}`)
        }
    }, [loading, user, router, path])

    useEffect(() => {
        const run = async () => {
            try {
                if (!params?.farmId || !params?.plotId || !user) return
                const [farmData, plotData] = await Promise.all([getFarm(params.farmId), getPlot(params.plotId)])
                setFarm(farmData)
                setPlot(plotData)
            } finally {
                setFetching(false)
            }
        }
        run()
    }, [params?.farmId, params?.plotId, user])

    if (loading || !user || fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!farm || !plot) return <div className="p-6">Plot not found</div>

    return <PlotView plot={plot} farm={farm} onBack={() => router.push(`/farms/${farm.id}`)} />
}