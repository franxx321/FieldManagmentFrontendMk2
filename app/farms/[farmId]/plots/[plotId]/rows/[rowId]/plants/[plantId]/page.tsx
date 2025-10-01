"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname, useParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"
import { getFarm, getPlot, getRow, getPlant } from "@/lib/api"
import type { Farm, Plot, Row, Plant } from "@/lib/types"
import { PlantView } from "@/components/plant-view"

export default function PlantRoute() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const path = usePathname()
    const params = useParams<{ farmId: string; plotId: string; rowId: string; plantId: string }>()
    const [farm, setFarm] = useState<Farm | null>(null)
    const [plot, setPlot] = useState<Plot | null>(null)
    const [row, setRow] = useState<Row | null>(null)
    const [plant, setPlant] = useState<Plant | null>(null)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        if (!loading && !user) {
            router.replace(`/login?next=${encodeURIComponent(path)}`)
        }
    }, [loading, user, router, path])

    useEffect(() => {
        const run = async () => {
            try {
                if (!params?.farmId || !params?.plotId || !params?.rowId || !params?.plantId || !user) return
                const [farmData, plotData, rowData, plantData] = await Promise.all([
                    getFarm(params.farmId),
                    getPlot(params.plotId),
                    getRow(params.rowId),
                    getPlant(params.plantId),
                ])
                setFarm(farmData)
                setPlot(plotData)
                setRow(rowData)
                setPlant(plantData)
            } finally {
                setFetching(false)
            }
        }
        run()
    }, [params?.farmId, params?.plotId, params?.rowId, params?.plantId, user])

    if (loading || !user || fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!farm || !plot || !row || !plant) return <div className="p-6">Plant not found</div>

    return (
        <PlantView
            plant={plant}
            row={row}
            plot={plot}
            farm={farm}
            onBack={() => router.push(`farms/${farm.id}/plots/${plot.id}/rows/${row.id}`)}
        />
    )
}