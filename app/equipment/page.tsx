import { createClient } from "@/lib/supabase/server"
import { MroShell } from "@/components/mro/shell"
import { PageHeader } from "@/components/mro/page-header"
import { CriticalityBadge, EquipmentStatusBadge } from "@/components/mro/badges"
import { AddEquipmentDialog } from "@/components/mro/add-equipment-dialog"
import { EquipmentStatusMenu } from "@/components/mro/equipment-status-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Cog,
  Wrench,
  Fan,
  MoveHorizontal,
  Zap,
  ArrowUpDown,
  Boxes,
  Wind,
} from "lucide-react"
import type { Equipment } from "@/lib/types"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "hydraulic-press": Wrench,
  "robot-arm": Cog,
  cnc: Cog,
  fan: Fan,
  conveyor: MoveHorizontal,
  panel: Zap,
  crane: ArrowUpDown,
  compressor: Wind,
}

export default async function EquipmentPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("equipment").select("*").order("created_at", { ascending: true })
  const equipment = (data ?? []) as Equipment[]

  const statusCounts = equipment.reduce(
    (acc, e) => {
      acc[e.status] = (acc[e.status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <MroShell>
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <PageHeader
          crumbs={[{ label: "Operations Command", href: "/" }, { label: "Equipment Registry" }]}
          title="Equipment Registry"
          description={`${equipment.length} registered assets · ${statusCounts.active ?? 0} active · ${statusCounts.under_repair ?? 0} under repair`}
          actions={<AddEquipmentDialog />}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {equipment.map((eq) => {
            const Icon = ICONS[eq.icon ?? ""] ?? Boxes
            return (
              <Card key={eq.id} className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-tight text-foreground">{eq.name}</p>
                        <p className="text-xs text-muted-foreground">{eq.equipment_id}</p>
                      </div>
                    </div>
                    <EquipmentStatusMenu id={eq.id} current={eq.status} />
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground">
                    {eq.category}
                    {eq.oem ? ` · ${eq.oem}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{eq.location}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <EquipmentStatusBadge status={eq.status} />
                    <CriticalityBadge level={eq.criticality} />
                  </div>

                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Health Score</span>
                      <span
                        className={
                          eq.health_score >= 90
                            ? "font-semibold text-success"
                            : eq.health_score >= 75
                              ? "font-semibold text-warning"
                              : "font-semibold text-destructive"
                        }
                      >
                        {eq.health_score}%
                      </span>
                    </div>
                    <Progress value={eq.health_score} className="h-1.5" />
                  </div>

                  {eq.notes && (
                    <p className="mt-3 rounded-md bg-secondary px-2.5 py-2 text-xs text-muted-foreground">{eq.notes}</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {equipment.length === 0 && (
          <Card className="border-border">
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              No equipment registered yet. Register your first asset to begin tracking telemetry.
            </CardContent>
          </Card>
        )}
      </div>
    </MroShell>
  )
}
