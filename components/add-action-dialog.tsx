"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import {createAction } from "@/lib/api"
import type { Action, PossibleAction } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface AddActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onActionAdded: (action: Action) => void
  PossibleActions: PossibleAction[]
  targetId: string
  targetType: "plot" | "row" | "plant"
}

export function AddActionDialog({
  open,
  onOpenChange,
  onActionAdded,
  PossibleActions,
  targetId,
  targetType,
}: AddActionDialogProps) {
  const [possibleActionId, setPossibleActionId] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let result
      if (targetType === "plot") {
        result = await createAction({
          plotId: targetId,
          possibleActionId: possibleActionId,
            description: description
        })
      } else if (targetType === "row") {
          result = await createAction({
              plotRowId: targetId,
              possibleActionId: possibleActionId,
              description: description
          })
      } else {
          result = await createAction({
              plantId: targetId,
              possibleActionId: possibleActionId,
              description: description
          })
      }
      onActionAdded(result)
      setPossibleActionId("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add action")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Action</DialogTitle>
          <DialogDescription>Record a new action for this {targetType}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select value={possibleActionId} onValueChange={setPossibleActionId} required disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  {PossibleActions.map((possibleAction) => (
                    <SelectItem key={possibleAction.id} value={String(possibleAction.id)}>
                        {possibleAction.name}
                    </SelectItem>
                  ))}
                </SelectContent>
                  
              </Select>
            </div>
              <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                      id="description"
                      className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={loading}
                      placeholder="Add a description for this action..."
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
              Add Action
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
