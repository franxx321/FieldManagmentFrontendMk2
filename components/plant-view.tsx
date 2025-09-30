"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updatePlant, getPlantActions, getPossibleActions } from "@/lib/api"
import { AddActionDialog } from "./add-action-dialog"
import type {Farm, Plot, Row, Plant, Action, PossibleAction, Species} from "@/lib/types"
import { Loader2, ArrowLeft, Save, Sprout, Calendar, MapPin, Plus, Activity } from "lucide-react"

interface PlantViewProps {
  plant: Plant
  row: Row
  plot: Plot
  farm: Farm
  onBack: () => void
}

export function PlantView({ plant, row, plot, farm, onBack}: PlantViewProps) {
  const [status, setStatus] = useState<Plant["status"]>(plant.status)
  const [position, setPosition] = useState(plant.position.toString())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [actions, setActions] = useState<Action[]>([])
  const [possibleActions, setPossibleActions] = useState<PossibleAction[]>([])
  const [actionsLoading, setActionsLoading] = useState(true)
  const [showAddAction, setShowAddAction] = useState(false)

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [actionsData, possibleActionsData] = await Promise.all([getPlantActions(plant.id), getPossibleActions()])
        setActions(actionsData)
        setPossibleActions(possibleActionsData)
      } catch (err) {
        console.error("Failed to load actions:", err)
      } finally {
        setActionsLoading(false)
      }
    }
    loadData()
  }, [plant.id])

  const handleSave = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await updatePlant(plant.id, {
        status,
        position: Number.parseInt(position),
      })
      setSuccess("Plant updated successfully")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update plant")
    } finally {
      setLoading(false)
    }
  }

  const handleActionAdded = (newAction: Action) => {
    setActions([...actions, newAction])
    setShowAddAction(false)
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
                Back to {row.name}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{plant.identifier}</h1>
                <p className="text-muted-foreground">
                  {plant.speciesCommonName} • Position {plant.position}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(plant.status)} variant="outline">
              {plant.status}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plant Details and Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Plant Details</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sprout className="h-5 w-5" />
                      Plant Information
                    </CardTitle>
                    <CardDescription>Update plant attributes and status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={status} onValueChange={(value: Plant["status"]) => setStatus(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HEALTHY">Healthy</SelectItem>
                            <SelectItem value="DISEASED">Diseased</SelectItem>
                            <SelectItem value="NEEDSATTENTION">Needs Attention</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          type="number"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          placeholder="Enter position number"
                        />
                      </div>
                    </div>

                    {error && <div className="text-destructive text-sm">{error}</div>}
                    {success && <div className="text-success text-sm">{success}</div>}

                    <Button onClick={handleSave} disabled={loading} className="gap-2">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>

                {/* Species Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Species Details</CardTitle>
                    <CardDescription>Information about this plant's species</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Common Name</Label>
                        <p className="text-sm text-muted-foreground">{plant.speciesCommonName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Scientific Name</Label>
                        <p className="text-sm text-muted-foreground italic">{plant.speciesScientificName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Plant Actions
                        </CardTitle>
                        <CardDescription>Actions performed on this plant</CardDescription>
                      </div>
                      <Button onClick={() => setShowAddAction(true)} size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Action
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {actionsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : actions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No actions recorded for this plant yet.</p>
                        <p className="text-sm">Click "Add Action" to record the first action.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {actions.map((action) => (
                          <div
                            key={action.id}
                            className="flex items-start justify-between p-4 border border-border rounded-lg"
                          >
                            <div className="space-y-1">
                              <h4 className="font-medium text-muted-foregrounds">{action.possibleActionName}</h4>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(action.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Location Hierarchy */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
                <CardDescription>Plant location hierarchy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Farm</Label>
                    <p className="text-sm text-muted-foreground">{farm.name}</p>
                    <p className="text-xs text-muted-foreground">{farm.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Plot</Label>
                    <p className="text-sm text-muted-foreground">{plot.name}</p>
                    <p className="text-xs text-muted-foreground">{plot.area} m²</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Row</Label>
                    <p className="text-sm text-muted-foreground">{row.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.length}m × {row.width}m
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
                <CardDescription>Plant creation and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Created</Label>
                    <p className="text-sm text-muted-foreground">{new Date(plant.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Updated</Label>
                    <p className="text-sm text-muted-foreground">{new Date(plant.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AddActionDialog
        open={showAddAction}
        onOpenChange={setShowAddAction}
        onActionAdded={handleActionAdded}
        PossibleActions={possibleActions}
        targetId={plant.id}
        targetType="plant"
      />
    </div>
  )
}
