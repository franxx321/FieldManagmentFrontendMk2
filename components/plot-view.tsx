"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getRows, getPlotActions, getPossibleActions } from "@/lib/api"
import type {Farm, Plot, Row, Action, PossibleAction} from "@/lib/types"
import { CreateRowDialog } from "@/components/create-row-dialog"
import { EditPlotDialog } from "@/components/edit-plot-dialog"
import { AddActionDialog } from "@/components/add-action-dialog"
import { RowView } from "@/components/row-view"
import {useSearchParams, useRouter} from "next/navigation"

import { Loader2, Plus, ArrowLeft, Settings, Activity, Grid3X3, Calendar } from "lucide-react"

interface PlotViewProps {
  plot: Plot
  farm: Farm
  onBack: () => void
}

export function PlotView({ plot, farm, onBack }: PlotViewProps) {
  const [rows, setRows] = useState<Row[]>([])
  const [plotActions, setPlotActions] = useState<Action[]>([])
  const [possibleActions, setPossibleActions] = useState<PossibleAction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRow, setSelectedRow] = useState<Row | null>(null)
  const [showCreateRowDialog, setShowCreateRowDialog] = useState(false)
  const [showEditPlotDialog, setShowEditPlotDialog] = useState(false)
  const [showAddActionDialog, setShowAddActionDialog] = useState(false)
    const router = useRouter()

  useEffect(() => {
    loadData()
  }, [plot.id])

  const loadData = async () => {
    try {
      const [rowsData, actionsData, possibleActionsData] = await Promise.all([
        getRows(plot.id),
        getPlotActions(plot.id),
        getPossibleActions(),
      ])
      setRows(rowsData)
      setPlotActions(actionsData)
      setPossibleActions(possibleActionsData)
    } catch (error) {
      console.error("Failed to load plot data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRowCreated = (newRow: Row) => {
    setRows([...rows, newRow])
    setShowCreateRowDialog(false)
  }

  const handleActionAdded = (newAction: Action) => {
    setPlotActions([...plotActions, newAction])
    setShowAddActionDialog(false)
  }

  if (selectedRow) {
    return <RowView row={selectedRow} plot={plot} farm={farm} onBack={() => setSelectedRow(null)} />
  }

  const handleRowClick = (rowId: string) => {
      router.push(`${plot.id}/rows/${rowId}`)
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
                Back to {farm.name}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{plot.name}</h1>
                <p className="text-muted-foreground">
                  {plot.coordinates} • {plot.area} m²
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowEditPlotDialog(true)} className="gap-2">
                <Settings className="h-4 w-4" />
                Edit Plot
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="rows" className="space-y-6">
            <TabsList>
              <TabsTrigger value="rows">Rows</TabsTrigger>
              <TabsTrigger value="actions">Plot Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="rows" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Rows in {plot.name}</h2>
                <Button onClick={() => setShowCreateRowDialog(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Row
                </Button>
              </div>

              {rows.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Grid3X3 className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No rows yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first row to organize plants</p>
                  <Button onClick={() => setShowCreateRowDialog(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Row
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rows.map((row) => (
                    <Card
                      key={row.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleRowClick(row.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{row.name}</CardTitle>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <CardDescription>
                          {row.length}m × {row.width}m
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Created {new Date(row.createdAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="actions" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Plot Actions</h2>
                <Button onClick={() => setShowAddActionDialog(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Action
                </Button>
              </div>

              {plotActions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Activity className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No actions recorded</h3>
                  <p className="text-muted-foreground mb-6">Start tracking plot activities</p>
                  <Button onClick={() => setShowAddActionDialog(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Action
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {plotActions.map((plotAction) => (
                    <Card key={plotAction.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plotAction.possibleActionName}</CardTitle>
                          <Badge variant="outline">{new Date(plotAction.createdAt).toLocaleDateString()}</Badge>
                        </div>
                        <CardDescription>{plotAction.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <CreateRowDialog
        open={showCreateRowDialog}
        onOpenChange={setShowCreateRowDialog}
        onRowCreated={handleRowCreated}
        plotId={plot.id}
      />

      <EditPlotDialog
        open={showEditPlotDialog}
        onOpenChange={setShowEditPlotDialog}
        plot={plot}
        onPlotUpdated={loadData}
      />

      <AddActionDialog
        open={showAddActionDialog}
        onOpenChange={setShowAddActionDialog}
        onActionAdded={handleActionAdded}
        PossibleActions={possibleActions}
        targetId={plot.id}
        targetType="plot"
      />
    </div>
  )
}
