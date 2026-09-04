import { createClient } from "@/lib/supabase/server"
import { MroShell } from "@/components/mro/shell"
import { PageHeader } from "@/components/mro/page-header"
import { AddWorkOrderDialog } from "@/components/mro/add-work-order-dialog"
import { WorkOrderCard } from "@/components/mro/work-order-card"
import type { WorkOrder } from "@/lib/types"

const COLUMNS = [
  { key: "open", label: "Open", dot: "bg-destructive" },
  { key: "in_progress", label: "In Progress", dot: "bg-warning" },
  { key: "completed", label: "Completed", dot: "bg-success" },
] as const

export default async function WorkOrdersPage() {
  const supabase = await createClient()

  const [{ data: orders }, { data: equipmentList }, { data: technicianList }] = await Promise.all([
    supabase
      .from("work_orders")
      .select("*, equipment:equipment_id(id, name, equipment_id, location), technician:technician_id(id, name, badge_id)")
      .order("created_at", { ascending: false }),
    supabase.from("equipment").select("id, name, equipment_id, location").order("name"),
    supabase.from("technicians").select("id, name, badge_id").order("name"),
  ])

  const workOrders = (orders ?? []) as unknown as WorkOrder[]

  return (
    <MroShell>
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <PageHeader
          crumbs={[{ label: "Operations Command", href: "/" }, { label: "Work Orders" }]}
          title="Work Order Dispatch"
          description="Live triage board for corrective and preventive maintenance across the plant floor."
          actions={
            <AddWorkOrderDialog equipmentOptions={equipmentList ?? []} technicianOptions={technicianList ?? []} />
          }
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {COLUMNS.map((col) => {
            const items = workOrders.filter((w) => w.status === col.key)
            return (
              <div key={col.key} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
                  <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                  <span className="text-sm font-semibold text-foreground">{col.label}</span>
                  <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {items.map((wo) => (
                    <WorkOrderCard key={wo.id} wo={wo} />
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-md border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      No work orders in this stage.
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </MroShell>
  )
}
