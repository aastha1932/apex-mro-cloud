import { cn } from "@/lib/utils"

export function CriticalityBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    "Tier 1 - Critical": "bg-destructive/10 text-destructive",
    "Tier 2 - Essential": "bg-accent/10 text-accent",
    "Tier 3 - Standard": "bg-muted text-muted-foreground",
  }
  return (
    <span className={cn("inline-flex whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium", styles[level] ?? styles["Tier 3 - Standard"])}>
      {level}
    </span>
  )
}

const EQUIPMENT_STATUS: Record<string, { label: string; dot: string; text: string }> = {
  active: { label: "Active", dot: "bg-success", text: "text-success" },
  under_repair: { label: "Under Repair", dot: "bg-destructive", text: "text-destructive" },
  standby: { label: "Standby", dot: "bg-warning", text: "text-warning" },
  inactive: { label: "Inactive", dot: "bg-muted-foreground", text: "text-muted-foreground" },
}

export function EquipmentStatusBadge({ status }: { status: string }) {
  const s = EQUIPMENT_STATUS[status] ?? EQUIPMENT_STATUS.inactive
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium", s.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  )
}

const PRIORITY: Record<string, string> = {
  critical: "bg-destructive text-white",
  high: "bg-warning/15 text-warning",
  medium: "bg-accent/10 text-accent",
  low: "bg-muted text-muted-foreground",
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={cn("inline-flex whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide", PRIORITY[priority] ?? PRIORITY.low)}>
      {priority}
    </span>
  )
}

const AVAILABILITY: Record<string, { label: string; dot: string; text: string }> = {
  available: { label: "Available", dot: "bg-success", text: "text-success" },
  busy: { label: "Busy", dot: "bg-destructive", text: "text-destructive" },
  on_call: { label: "On Call (Standby)", dot: "bg-accent", text: "text-accent" },
  offline: { label: "Offline", dot: "bg-muted-foreground", text: "text-muted-foreground" },
}

export function AvailabilityBadge({ availability }: { availability: string }) {
  const s = AVAILABILITY[availability] ?? AVAILABILITY.offline
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", s.text)}>
      <span className={cn("h-2 w-2 rounded-full", s.dot)} />
      {s.label}
    </span>
  )
}

const PART_STATUS: Record<string, string> = {
  in_stock: "bg-success/10 text-success",
  low_stock: "bg-warning/15 text-warning",
  out_of_stock: "bg-destructive/10 text-destructive",
}

export function PartStatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = { in_stock: "In Stock", low_stock: "Low Stock", out_of_stock: "Out of Stock" }
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium", PART_STATUS[status] ?? PART_STATUS.in_stock)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status] ?? status}
    </span>
  )
}
