"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createPlant } from "@/lib/api"
import type { Plant, Species } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface CreatePlantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlantCreated: (plant: Plant) => void
  rowId: string
  species: Species[]
}

export function CreatePlantDialog({ open, onOpenChange, onPlantCreated, rowId, species }: CreatePlantDialogProps) {
  const [speciesId, setSpeciesId] = useState("")
  const [position, setPosition] = useState("")
  const [status, setStatus] = useState<Plant["status"]>("HEALTHY")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const plant = await createPlant({
        speciesId: speciesId,
        position: Number.parseInt(position),
        status,
        plotRowId: rowId,
      })
      onPlantCreated(plant)
      setSpeciesId("")
      setPosition("")
      setStatus("HEALTHY")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create plant")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Plant</DialogTitle>
          <DialogDescription>Add a new plant to this row.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="species">Species</Label>
              <Select value={speciesId} onValueChange={setSpeciesId} required disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a species" />
                </SelectTrigger>
                <SelectContent>
                  {species.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.commonName} ({s.scientificName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: Plant["status"]) => setStatus(value)} disabled={loading}>
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
            {error && <div className="text-destructive text-sm">{error}</div>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Plant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
