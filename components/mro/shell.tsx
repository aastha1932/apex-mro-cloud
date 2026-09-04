import { createClient } from "@/lib/supabase/server"
import { MroSidebar } from "./sidebar"
import { MroTopbar } from "./topbar"

export async function MroShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const [{ count: openWorkOrders }, { count: lowStock }] = await Promise.all([
    supabase.from("work_orders").select("id", { count: "exact", head: true }).neq("status", "completed"),
    supabase.from("spare_parts").select("id", { count: "exact", head: true }).in("status", ["low_stock", "out_of_stock"]),
  ])

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <MroSidebar openWorkOrders={openWorkOrders ?? 0} lowStock={lowStock ?? 0} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MroTopbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
