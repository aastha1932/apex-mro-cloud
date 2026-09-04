"use client"

import { useRef, useState, useTransition } from "react"
import { Plus } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createWorkOrder } from "@/lib/actions"

export function AddWorkOrderDialog({
  equipmentOptions,
  technicianOptions,
}: {
  equipmentOptions: { id: string; name: string; equipment_id: string; location: string }[]
  technicianOptions: { id: string; name: string; badge_id: string }[]
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4" />
          New Work Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Dispatch New Work Order</DialogTitle>
          <DialogDescription>Create a maintenance work order and optionally assign a technician.</DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          action={(formData) => {
            startTransition(async () => {
              await createWorkOrder(formData)
              setOpen(false)
              formRef.current?.reset()
            })
          }}
          className="grid gap-4"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required placeholder="Hydraulic manifold seal rupture" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={2} placeholder="Describe the issue and required action" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="equipment_id">Equipment</Label>
            <Select name="equipment_id">
              <SelectTrigger id="equipment_id">
                <SelectValue placeholder="Select affected equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipmentOptions.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name} ({e.equipment_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" required defaultValue="medium">
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="maintenance_type">Type</Label>
              <Select name="maintenance_type" required defaultValue="corrective">
                <SelectTrigger id="maintenance_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrective">Corrective</SelectItem>
                  <SelectItem value="preventive">Preventive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="technician_id">Assign Technician</Label>
              <Select name="technician_id">
                <SelectTrigger id="technician_id">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  {technicianOptions.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} ({t.badge_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="Bay 01 - Stamping" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90">
              {pending ? "Dispatching..." : "Dispatch Work Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
