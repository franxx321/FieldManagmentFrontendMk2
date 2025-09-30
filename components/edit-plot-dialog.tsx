"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { updatePlot } from "@/lib/api"
import type { Plot } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface EditPlotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plot: Plot
  onPlotUpdated: () => void
}

export function EditPlotDialog({ open, onOpenChange, plot, onPlotUpdated }: EditPlotDialogProps) {
  const [name, setName] = useState("")
  const [area, setArea] = useState("")
  const [coordinates, setCoordinates] = useState("")
  const [polygon, setPolygon] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setName(plot.name)
      setArea(plot.area.toString())
      setCoordinates(plot.coordinates)
      setPolygon(plot.polygon || "")
    }
  }, [open, plot])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await updatePlot(plot.id, {
        name,
        area: Number.parseFloat(area),
        coordinates,
        polygon,
      })
      onPlotUpdated()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update plot")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Plot</DialogTitle>
          <DialogDescription>Update plot information and attributes.</DialogDescription>
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
              Update Plot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
