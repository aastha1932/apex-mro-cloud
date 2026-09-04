"use client"

import { useRef, useState, useTransition } from "react"
import { Plus } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { createSparePart } from "@/lib/actions"

export function AddSparePartDialog() {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4" />
          Add Part
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Spare Part</DialogTitle>
          <DialogDescription>Register a new SKU into the parts inventory ledger.</DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          action={(formData) => {
            startTransition(async () => {
              await createSparePart(formData)
              setOpen(false)
              formRef.current?.reset()
            })
          }}
          className="grid gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Part Name</Label>
              <Input id="name" name="name" required placeholder="Hydraulic Solenoid Valve" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="part_number">Part Number</Label>
              <Input id="part_number" name="part_number" placeholder="Auto-generated if blank" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" required placeholder="Hydraulics & Valves" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="specification">Specification</Label>
            <Input id="specification" name="specification" placeholder="420-bar Rated - DIN 24340 Form A" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="qty_in_stock">Qty in Stock</Label>
              <Input id="qty_in_stock" name="qty_in_stock" type="number" min={0} defaultValue={0} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="reorder_threshold">Reorder At</Label>
              <Input id="reorder_threshold" name="reorder_threshold" type="number" min={0} defaultValue={5} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="unit_cost">Unit Cost ($)</Label>
              <Input id="unit_cost" name="unit_cost" type="number" min={0} step="0.01" defaultValue={0} required />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="bin_location">Bin Location</Label>
            <Input id="bin_location" name="bin_location" placeholder="Bay 3 - Shelf 12A" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90">
              {pending ? "Adding..." : "Add Part"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
