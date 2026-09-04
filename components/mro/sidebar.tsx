"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  ClipboardList,
  Cog,
  Package,
  Users,
  BarChart3,
  Workflow,
  Wifi,
  Compass,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "Master Operations", icon: LayoutGrid },
  { href: "/work-orders", label: "Work Orders", icon: ClipboardList, badgeKey: "openWorkOrders" as const },
  { href: "/equipment", label: "Equipment Registry", icon: Cog },
  { href: "/spare-parts", label: "Spare Parts", icon: Package, badgeKey: "lowStock" as const },
  { href: "/technicians", label: "Technicians", icon: Users },
  { href: "/reports", label: "Reports & Analytics", icon: BarChart3 },
  { href: "/automations", label: "Automations (Flows)", icon: Workflow },
]

export function MroSidebar({
  openWorkOrders,
  lowStock,
}: {
  openWorkOrders?: number
  lowStock?: number
}) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Compass className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-sidebar-foreground">Apex MRO Cloud</p>
          <p className="text-[11px] text-muted-foreground">Enterprise Telemetry</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-2.5 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground">
          OPERATIONS COMMAND
        </p>
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const badgeValue = item.badgeKey === "openWorkOrders" ? openWorkOrders : item.badgeKey === "lowStock" ? lowStock : undefined
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <item.icon className={cn("h-4 w-4", isActive && "text-accent")} strokeWidth={2} />
                  {item.label}
                </span>
                {typeof badgeValue === "number" && badgeValue > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                      item.badgeKey === "lowStock"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-accent/10 text-accent",
                    )}
                  >
                    {item.badgeKey === "lowStock" ? `${badgeValue} low` : badgeValue}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-3">
        <div className="rounded-md border border-sidebar-border bg-sidebar-accent/40 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sidebar-foreground">IoT Fleet Gateway</span>
            <Wifi className="h-3.5 w-3.5 text-success" />
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Connected
          </p>
        </div>
      </div>
    </aside>
  )
}
