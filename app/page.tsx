import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { MroShell } from "@/components/mro/shell"
import { PageHeader } from "@/components/mro/page-header"
import { PriorityBadge } from "@/components/mro/badges"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cog, ClipboardCheck, AlertTriangle, Package, Download, Plus, ArrowRight } from "lucide-react"
import { CostChart } from "@/components/mro/cost-chart"
import type { WorkOrder } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ count: totalEquipment }, { count: openWO }, { count: completedWO }, { count: lowStock }, { data: recent }] =
    await Promise.all([
      supabase.from("equipment").select("id", { count: "exact", head: true }),
      supabase.from("work_orders").select("id", { count: "exact", head: true }).neq("status", "completed"),
      supabase.from("work_orders").select("id", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("spare_parts").select("id", { count: "exact", head: true }).in("status", ["low_stock", "out_of_stock"]),
      supabase
        .from("work_orders")
        .select("*, equipment:equipment_id(id, name, equipment_id, location)")
        .order("created_at", { ascending: false })
        .limit(5),
    ])

  const recentOrders = (recent ?? []) as unknown as WorkOrder[]

  return (
    <MroShell>
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <PageHeader
          crumbs={[{ label: "Operations Command" }, { label: "Dashboard Summary" }]}
          title="Dashboard Summary"
          description="Overview & real-time fleet status across equipment, work orders, spare parts, and technician dispatch."
          actions={
            <>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-4 w-4" />
                Export Summary
              </Button>
              <Button size="sm" asChild className="gap-1.5 bg-accent hover:bg-accent/90">
                <Link href="/work-orders">
                  <Plus className="h-4 w-4" />
                  New Work Order
                </Link>
              </Button>
            </>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Cog}
            label="Total Equipment"
            value={totalEquipment ?? 0}
            iconClass="bg-accent/10 text-accent"
            footer="Across Plant 04 subsystems"
          />
          <StatCard
            icon={AlertTriangle}
            label="Open Work Orders"
            value={openWO ?? 0}
            iconClass="bg-destructive/10 text-destructive"
            valueClass="text-destructive"
            footer="Live triage queue"
          />
          <StatCard
            icon={ClipboardCheck}
            label="Completed Work Orders"
            value={completedWO ?? 0}
            iconClass="bg-success/10 text-success"
            footer="Resolved to date"
          />
          <StatCard
            icon={Package}
            label="Low Stock Parts"
            value={lowStock ?? 0}
            iconClass="bg-warning/15 text-warning"
            footer="Below reorder threshold"
          />
        </div>

        <CostChart />

        <Card className="border-border">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">Recent Maintenance Activities</h2>
                <p className="text-sm text-muted-foreground">Real-time incident dispatch and certified technician sign-offs</p>
              </div>
              <Button variant="ghost" size="sm" asChild className="gap-1 text-accent hover:text-accent">
                <Link href="/work-orders">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {recentOrders.map((wo) => (
                <div key={wo.id} className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                    <Cog className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{wo.equipment?.name ?? wo.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {wo.equipment?.equipment_id ?? wo.wo_number} · {wo.location}
                    </p>
                  </div>
                  <p className="hidden max-w-xs flex-1 truncate text-sm text-muted-foreground md:block">{wo.description}</p>
                  <PriorityBadge priority={wo.priority} />
                  <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                    {new Date(wo.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="p-8 text-center text-sm text-muted-foreground">No maintenance activity recorded yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MroShell>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  footer,
  iconClass,
  valueClass,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  footer: string
  iconClass: string
  valueClass?: string
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
        <p className={`mt-2 text-3xl font-semibold tabular-nums text-foreground ${valueClass ?? ""}`}>{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{footer}</p>
      </CardContent>
    </Card>
  )
}
