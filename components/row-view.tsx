"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPlants, getRowActions, getPossibleActions, getSpecies } from "@/lib/api"
import type {Farm, Plot, Row, Plant, Action, Species, PossibleAction} from "@/lib/types"
import { CreatePlantDialog } from "@/components/create-plant-dialog"
import { BatchCreatePlantsDialog } from "@/components/batch-create-plants-dialog"
import { EditRowDialog } from "@/components/edit-row-dialog"
import { AddActionDialog } from "@/components/add-action-dialog"
import { PlantView } from "@/components/plant-view"
import { Loader2, Plus, ArrowLeft, Settings, Activity, Sprout, Calendar, Users } from "lucide-react"

interface RowViewProps {
  row: Row
  plot: Plot
  farm: Farm
  onBack: () => void
}

export function RowView({ row, plot, farm, onBack }: RowViewProps) {
  const [plants, setPlants] = useState<Plant[]>([])
  const [rowActions, setRowActions] = useState<Action[]>([])
  const [PossibleActions, setPossibleActions] = useState<PossibleAction[]>([])
  const [species, setSpecies] = useState<Species[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [showCreatePlantDialog, setShowCreatePlantDialog] = useState(false)
  const [showBatchCreateDialog, setShowBatchCreateDialog] = useState(false)
  const [showEditRowDialog, setShowEditRowDialog] = useState(false)
  const [showAddActionDialog, setShowAddActionDialog] = useState(false)

  useEffect(() => {
    loadData()
  }, [row.id])

  const loadData = async () => {
    try {
      const [plantsData, actionsData, PossibleActionsData, speciesData] = await Promise.all([
        getPlants(row.id),
        getRowActions(row.id),
        getPossibleActions(),
        getSpecies(),
      ])
      setPlants(plantsData)
      setRowActions(actionsData)
      setPossibleActions(PossibleActionsData)
      setSpecies(speciesData)
    } catch (error) {
      console.error("Failed to load row data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlantCreated = (newPlant: Plant) => {
    setPlants([...plants, newPlant])
    setShowCreatePlantDialog(false)
  }

  const handlePlantsCreated = (newPlants: Plant[]) => {
    setPlants([...plants, ...newPlants])
    setShowBatchCreateDialog(false)
  }

  const handleActionAdded = (newAction: Action) => {
    setRowActions([...rowActions, newAction])
    setShowAddActionDialog(false)
  }

  const getStatusColor = (status: Plant["status"]) => {
    switch (status) {
      case "HEALTHY":
        return "status-healthy"
      case "DISEASED":
        return "status-diseased"
      case "NEEDSATTENTION":
        return "status-needs-attention"
      default:
        return ""
    }
  }

  if (selectedPlant) {
    return <PlantView plant={selectedPlant} row={row} plot={plot} farm={farm} onBack={() => setSelectedPlant(null)} />
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
                Back to {plot.name}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{row.name}</h1>
                <p className="text-muted-foreground">
                  {row.length}m × {row.width}m • {plants.length} plants
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowEditRowDialog(true)} className="gap-2">
                <Settings className="h-4 w-4" />
                Edit Row
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
          <Tabs defaultValue="plants" className="space-y-6">
            <TabsList>
              <TabsTrigger value="plants">Plants</TabsTrigger>
              <TabsTrigger value="actions">Row Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="plants" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Plants in {row.name}</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setShowBatchCreateDialog(true)} className="gap-2">
                    <Users className="h-4 w-4" />
                    Batch Create
                  </Button>
                  <Button onClick={() => setShowCreatePlantDialog(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Plant
                  </Button>
                </div>
              </div>

              {plants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Sprout className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No plants yet</h3>
                  <p className="text-muted-foreground mb-6">Add plants to start tracking their growth</p>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" onClick={() => setShowBatchCreateDialog(true)} className="gap-2">
                      <Users className="h-4 w-4" />
                      Batch Create
                    </Button>
                    <Button onClick={() => setShowCreatePlantDialog(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Plant
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plants.map((plant) => (
                    <Card
                      key={plant.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setSelectedPlant(plant)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{plant.identifier}</CardTitle>
                          <Badge className={getStatusColor(plant.status)} variant="outline">
                            {plant.status}
                          </Badge>
                        </div>
                        <CardDescription>{plant.speciesCommonName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Position: {plant.position}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(plant.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="actions" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Row Actions</h2>
                <Button onClick={() => setShowAddActionDialog(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Action
                </Button>
              </div>

              {rowActions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Activity className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No actions recorded</h3>
                  <p className="text-muted-foreground mb-6">Start tracking row activities</p>
                  <Button onClick={() => setShowAddActionDialog(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Action
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {rowActions.map((rowAction) => (
                    <Card key={rowAction.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{rowAction.possibleActionName}</CardTitle>
                          <Badge variant="outline">{new Date(rowAction.createdAt).toLocaleDateString()}</Badge>
                        </div>
                        <CardDescription>{rowAction.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <CreatePlantDialog
        open={showCreatePlantDialog}
        onOpenChange={setShowCreatePlantDialog}
        onPlantCreated={handlePlantCreated}
        rowId={row.id}
        species={species}
      />

      <BatchCreatePlantsDialog
        open={showBatchCreateDialog}
        onOpenChange={setShowBatchCreateDialog}
        onPlantsCreated={handlePlantsCreated}
        rowId={row.id}
        species={species}
      />

      <EditRowDialog open={showEditRowDialog} onOpenChange={setShowEditRowDialog} row={row} onRowUpdated={loadData} />

      <AddActionDialog
        open={showAddActionDialog}
        onOpenChange={setShowAddActionDialog}
        onActionAdded={handleActionAdded}
        PossibleActions={PossibleActions}
        targetId={row.id}
        targetType="row"
      />
    </div>
  )
}
