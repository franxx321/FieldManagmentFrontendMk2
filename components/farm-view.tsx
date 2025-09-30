"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPlots } from "@/lib/api"
import type { Farm, Plot } from "@/lib/types"
import { CreatePlotDialog } from "@/components/create-plot-dialog"
import { PlotView } from "@/components/plot-view"
import { Loader2, Plus, ArrowLeft, Grid3X3, Calendar, Ruler } from "lucide-react"

interface FarmViewProps {
  farm: Farm
  onBack: () => void
}

export function FarmView({ farm, onBack }: FarmViewProps) {
  const [plots, setPlots] = useState<Plot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    loadPlots()
  }, [farm.id])

  const loadPlots = async () => {
    try {
      const data = await getPlots(farm.id)
      setPlots(data)
    } catch (error) {
      console.error("Failed to load plots:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlotCreated = (newPlot: Plot) => {
    setPlots([...plots, newPlot])
    setShowCreateDialog(false)
  }

  if (selectedPlot) {
    return <PlotView plot={selectedPlot} farm={farm} onBack={() => setSelectedPlot(null)} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Farms
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{farm.name}</h1>
                <p className="text-muted-foreground">
                  {farm.location} • {farm.area} hectares
                </p>
              </div>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Plot
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : plots.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Grid3X3 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No plots yet</h3>
            <p className="text-muted-foreground mb-6">Create your first plot to start organizing your farm</p>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Plot
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plots.map((plot) => (
              <Card
                key={plot.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setSelectedPlot(plot)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plot.name}</CardTitle>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <CardDescription>Plot coordinates: {plot.coordinates}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Ruler className="h-4 w-4" />
                      {plot.area} m²
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Created {new Date(plot.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <CreatePlotDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onPlotCreated={handlePlotCreated}
        farmId={farm.id}
      />
    </div>
  )
}
