"use client"

import { useTransition } from "react"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateEquipmentStatus } from "@/lib/actions"

const OPTIONS = [
  { value: "active", label: "Mark Active" },
  { value: "under_repair", label: "Mark Under Repair" },
  { value: "standby", label: "Mark Standby" },
  { value: "inactive", label: "Mark Inactive" },
]

export function EquipmentStatusMenu({ id, current }: { id: string; current: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={pending}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-50"
          aria-label="Change equipment status"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-xs">Update Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {OPTIONS.map((o) => (
          <DropdownMenuItem
            key={o.value}
            disabled={o.value === current}
            onSelect={() => startTransition(() => updateEquipmentStatus(id, o.value))}
          >
            {o.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
