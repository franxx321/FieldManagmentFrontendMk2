"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createRow } from "@/lib/api"
import type { Row } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface CreateRowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRowCreated: (row: Row) => void
  plotId: string
}

export function CreateRowDialog({ open, onOpenChange, onRowCreated, plotId }: CreateRowDialogProps) {
  const [name, setName] = useState("")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const row = await createRow({
        name,
        length: Number.parseFloat(length),
        width: Number.parseFloat(width),
        plot_id: plotId,
      })
      onRowCreated(row)
      setName("")
      setLength("")
      setWidth("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create row")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Row</DialogTitle>
          <DialogDescription>Add a new row to organize plants within this plot.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Row Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter row name"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length (meters)</Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="Enter row length"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width (meters)</Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Enter row width"
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
              Create Row
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
