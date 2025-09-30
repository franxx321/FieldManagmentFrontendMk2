"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createPlot } from "@/lib/api"
import type { Plot } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface CreatePlotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlotCreated: (plot: Plot) => void
  farmId: string
}

export function CreatePlotDialog({ open, onOpenChange, onPlotCreated, farmId }: CreatePlotDialogProps) {
  const [name, setName] = useState("")
  const [area, setArea] = useState("")
  const [coordinates, setCoordinates] = useState("")
  const [polygon, setPolygon] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const plot = await createPlot({
        name,
        area: Number.parseFloat(area),
        coordinates,
        polygon,
        farm_id: farmId,
      })
      onPlotCreated(plot)
      setName("")
      setArea("")
      setCoordinates("")
      setPolygon("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create plot")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Plot</DialogTitle>
          <DialogDescription>Add a new plot to organize your farm sections.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plot Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter plot name"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Area (m²)</Label>
              <Input
                id="area"
                type="number"
                step="0.1"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Enter area in square meters"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coordinates">Coordinates</Label>
              <Input
                id="coordinates"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                placeholder="e.g., 40.7128, -74.0060"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="polygon">Polygon Data (Optional)</Label>
              <Textarea
                id="polygon"
                value={polygon}
                onChange={(e) => setPolygon(e.target.value)}
                placeholder="Enter polygon coordinates or GeoJSON data"
                disabled={loading}
                rows={3}
              />
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Plot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
