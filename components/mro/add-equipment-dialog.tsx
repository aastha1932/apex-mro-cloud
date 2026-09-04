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
import { createEquipment } from "@/lib/actions"

const CATEGORIES = [
  "Hydraulic Stamping & Press",
  "PLC Robotics & Automation",
  "CNC Machining Tooling",
  "HVAC & Ventilation",
  "Material Handling & Drive",
  "Electrical Power Dist.",
  "Heavy Lifting & Hoists",
  "Pneumatics & Utilities",
]

export function AddEquipmentDialog() {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4" />
          Register Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Equipment</DialogTitle>
          <DialogDescription>Add an asset to the plant equipment registry.</DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          action={(formData) => {
            startTransition(async () => {
              await createEquipment(formData)
              setOpen(false)
              formRef.current?.reset()
            })
          }}
          className="grid gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Equipment Name</Label>
              <Input id="name" name="name" required placeholder="Schuler HydroPress 500T" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="equipment_id">Equipment ID</Label>
              <Input id="equipment_id" name="equipment_id" placeholder="Auto-generated if blank" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required defaultValue={CATEGORIES[0]}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="oem">OEM / Manufacturer</Label>
              <Input id="oem" name="oem" placeholder="Schuler" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required placeholder="Bay 01 - Heavy Stamping" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="criticality">Criticality Tier</Label>
              <Select name="criticality" required defaultValue="Tier 2 - Essential">
                <SelectTrigger id="criticality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tier 1 - Critical">Tier 1 - Critical</SelectItem>
                  <SelectItem value="Tier 2 - Essential">Tier 2 - Essential</SelectItem>
                  <SelectItem value="Tier 3 - Standard">Tier 3 - Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="status">Status</Label>
              <Select name="status" required defaultValue="active">
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="under_repair">Under Repair</SelectItem>
                  <SelectItem value="standby">Standby</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" rows={2} placeholder="Optional maintenance notes" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90">
              {pending ? "Registering..." : "Register Equipment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
