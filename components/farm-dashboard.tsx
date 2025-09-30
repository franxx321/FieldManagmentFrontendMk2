"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { getFarms } from "@/lib/api"
import type { Farm } from "@/lib/types"
import { CreateFarmDialog } from "@/components/create-farm-dialog"
import { FarmView } from "@/components/farm-view"
import { Loader2, Plus, MapPin, Calendar, Ruler } from "lucide-react"

export function FarmDashboard() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    loadFarms()
  }, [])

  const loadFarms = async () => {
    try {
      const data = await getFarms()
      setFarms(data)
    } catch (error) {
      console.error("Failed to load farms:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFarmCreated = (newFarm: Farm) => {
    setFarms([...farms, newFarm])
    setShowCreateDialog(false)
  }

  if (selectedFarm) {
    return <FarmView farm={selectedFarm} onBack={() => setSelectedFarm(null)} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Farm Management</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                New Farm
              </Button>
              <Button variant="outline" onClick={logout}>
                Sign Out
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
        ) : farms.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No farms yet</h3>
            <p className="text-muted-foreground mb-6">Get started by creating your first farm</p>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Farm
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <Card
                key={farm.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setSelectedFarm(farm)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{farm.name}</CardTitle>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {farm.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Ruler className="h-4 w-4" />
                      {farm.area} hectares
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Created {new Date(farm.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <CreateFarmDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onFarmCreated={handleFarmCreated} />
    </div>
  )
}
