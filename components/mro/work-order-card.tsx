"use client"

import { useTransition } from "react"
import { ArrowRight, Clock, MapPin, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PriorityBadge } from "@/components/mro/badges"
import { updateWorkOrderStatus } from "@/lib/actions"
import type { WorkOrder } from "@/lib/types"

const NEXT_STATUS: Record<string, { status: "open" | "in_progress" | "completed"; label: string } | null> = {
  open: { status: "in_progress", label: "Start Work" },
  in_progress: { status: "completed", label: "Mark Complete" },
  completed: null,
}

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export function WorkOrderCard({ wo }: { wo: WorkOrder }) {
  const [pending, startTransition] = useTransition()
  const next = NEXT_STATUS[wo.status]

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold text-muted-foreground">{wo.wo_number}</p>
          <PriorityBadge priority={wo.priority} />
        </div>
        <p className="mt-1.5 text-sm font-semibold leading-snug text-foreground text-pretty">
          {wo.equipment?.name ?? wo.title}
        </p>
        {wo.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground text-pretty">{wo.description}</p>}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {wo.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {wo.location ?? wo.equipment?.location ?? "Unassigned"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo(wo.dispatched_at ?? wo.created_at)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <UserRound className="h-3.5 w-3.5" />
            {wo.technician?.name ?? "Unassigned"}
          </span>
          {next && (
            <Button
              size="sm"
              variant="ghost"
              disabled={pending}
              onClick={() => startTransition(() => updateWorkOrderStatus(wo.id, next.status))}
              className="h-7 gap-1 px-2 text-xs text-accent hover:text-accent"
            >
              {next.label} <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
