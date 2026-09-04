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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTechnician } from "@/lib/actions"

export function AddTechnicianDialog() {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4" />
          Add Technician
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Technician</DialogTitle>
          <DialogDescription>Onboard a certified technician onto the plant floor roster.</DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          action={(formData) => {
            startTransition(async () => {
              await createTechnician(formData)
              setOpen(false)
              formRef.current?.reset()
            })
          }}
          className="grid gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required placeholder="Elena Rostova" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" required placeholder="Senior Lead Specialist" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="specialization">Specialization</Label>
            <Input id="specialization" name="specialization" required placeholder="PLC Robotics & Automation" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="certifications">Certifications (comma separated)</Label>
            <Input id="certifications" name="certifications" placeholder="FANUC LEVEL 3, SIEMENS S7, LOTO CERT" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" placeholder="+1 (313) 555-0182" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="name@apex-mro.detroit.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="channel">Radio Channel</Label>
              <Input id="channel" name="channel" placeholder="Ch 4 - Stamping Bay 01" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="availability">Availability</Label>
              <Select name="availability" required defaultValue="available">
                <SelectTrigger id="availability">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="on_call">On Call (Standby)</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90">
              {pending ? "Adding..." : "Add Technician"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
