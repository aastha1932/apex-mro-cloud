import { createClient } from "@/lib/supabase/server"
import { MroShell } from "@/components/mro/shell"
import { PageHeader } from "@/components/mro/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { CostChart } from "@/components/mro/cost-chart"
import { EquipmentStatusChart, WorkOrderPriorityChart, MaintenanceTypeChart } from "@/components/mro/reports-charts"
import { Clock, Wrench, TrendingDown, Timer } from "lucide-react"
import type { Equipment, WorkOrder } from "@/lib/types"

export default async function ReportsPage() {
  const supabase = await createClient()

  const [{ data: equipmentData }, { data: workOrderData }] = await Promise.all([
    supabase.from("equipment").select("*"),
    supabase.from("work_orders").select("*"),
  ])

  const equipment = (equipmentData ?? []) as Equipment[]
  const workOrders = (workOrderData ?? []) as WorkOrder[]

  const statusCounts = equipment.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const priorityCounts = workOrders.reduce((acc, w) => {
    acc[w.priority] = (acc[w.priority] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const preventive = workOrders.filter((w) => w.maintenance_type === "preventive").length
  const corrective = workOrders.filter((w) => w.maintenance_type === "corrective").length

  const completed = workOrders.filter((w) => w.status === "completed" && w.downtime_minutes != null)
  const avgDowntime = completed.length
    ? Math.round(completed.reduce((sum, w) => sum + (w.downtime_minutes ?? 0), 0) / completed.length)
    : 0

  const avgHealth = equipment.length
    ? Math.round(equipment.reduce((sum, e) => sum + e.health_score, 0) / equipment.length)
    : 0

  const mttrHours = workOrders
    .filter((w) => w.status === "completed" && w.resolved_at && w.dispatched_at)
    .map((w) => (new Date(w.resolved_at!).getTime() - new Date(w.dispatched_at!).getTime()) / 3600000)
  const avgMttr = mttrHours.length ? (mttrHours.reduce((a, b) => a + b, 0) / mttrHours.length).toFixed(1) : "0.0"

  return (
    <MroShell>
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <PageHeader
          crumbs={[{ label: "Operations Command", href: "/" }, { label: "Reports & Analytics" }]}
          title="Reports & Analytics"
          description="Fleet health, maintenance mix, and cost analytics across Plant 04."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Wrench} label="Avg. Health Score" value={`${avgHealth}%`} iconClass="bg-accent/10 text-accent" />
          <MetricCard icon={Timer} label="Avg. MTTR" value={`${avgMttr}h`} iconClass="bg-warning/15 text-warning" />
          <MetricCard
            icon={Clock}
            label="Avg. Downtime / Incident"
            value={`${avgDowntime}m`}
            iconClass="bg-destructive/10 text-destructive"
          />
          <MetricCard
            icon={TrendingDown}
            label="Corrective Ratio"
            value={`${workOrders.length ? Math.round((corrective / workOrders.length) * 100) : 0}%`}
            iconClass="bg-success/10 text-success"
          />
        </div>

        <CostChart />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <EquipmentStatusChart counts={statusCounts} />
          <WorkOrderPriorityChart counts={priorityCounts} />
          <MaintenanceTypeChart preventive={preventive} corrective={corrective} />
        </div>
      </div>
    </MroShell>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  iconClass,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  iconClass: string
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${iconClass}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">{value}</p>
      </CardContent>
    </Card>
  )
}
