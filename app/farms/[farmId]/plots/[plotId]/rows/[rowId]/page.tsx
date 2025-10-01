"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname, useParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"
import { getFarm, getPlot, getRow } from "@/lib/api"
import type { Farm, Plot, Row } from "@/lib/types"
import { RowView } from "@/components/row-view"

export default function RowRoute() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const path = usePathname()
    const params = useParams<{ farmId: string; plotId: string; rowId: string }>()
    const [farm, setFarm] = useState<Farm | null>(null)
    const [plot, setPlot] = useState<Plot | null>(null)
    const [row, setRow] = useState<Row | null>(null)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        if (!loading && !user) {
            router.replace(`/login?next=${encodeURIComponent(path)}`)
        }
    }, [loading, user, router, path])

    useEffect(() => {
        const run = async () => {
            try {
                if (!params?.farmId || !params?.plotId || !params?.rowId || !user) return
                const [farmData, plotData, rowData] = await Promise.all([
                    getFarm(params.farmId),
                    getPlot(params.plotId),
                    getRow(params.rowId),
                ])
                setFarm(farmData)
                setPlot(plotData)
                setRow(rowData)
            } finally {
                setFetching(false)
            }
        }
        run()
    }, [params?.farmId, params?.plotId, params?.rowId, user])

    if (loading || !user || fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!farm || !plot || !row) return <div className="p-6">Row not found</div>

    return <RowView row={row} plot={plot} farm={farm} onBack={() => router.push(`/farms/${farm.id}/plots/${plot.id}`)} />
}