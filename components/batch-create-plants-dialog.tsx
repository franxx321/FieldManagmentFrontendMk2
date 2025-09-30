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
import { batchCreatePlants } from "@/lib/api"
import type { Plant, Species } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface BatchCreatePlantsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlantsCreated: (plants: Plant[]) => void
  rowId: string
  species: Species[]
}

export function BatchCreatePlantsDialog({
  open,
  onOpenChange,
  onPlantsCreated,
  rowId,
  species,
}: BatchCreatePlantsDialogProps) {
  const [speciesId, setSpeciesId] = useState("")
  const [count, setCount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const plants = await batchCreatePlants({
        row_id: rowId,
        species_id: speciesId,
        count: Number.parseInt(count),
      })
      onPlantsCreated(plants)
      setSpeciesId("")
      setCount("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create plants")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Batch Create Plants</DialogTitle>
          <DialogDescription>Create multiple plants of the same species at once.</DialogDescription>
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
              <Label htmlFor="count">Number of Plants</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="Enter number of plants to create"
                required
                disabled={loading}
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
              Create {count} Plants
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
