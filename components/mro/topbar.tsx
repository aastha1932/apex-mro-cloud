"use client"

import { Search, Bell, AlertTriangle, ChevronDown, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MroTopbar({ breadcrumb }: { breadcrumb?: React.ReactNode }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      <button className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-foreground shrink-0">
        <span className="hidden sm:inline">Plant 04 - Detroit Assembly</span>
        <span className="sm:hidden">Plant 04</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      <div className="relative hidden md:flex flex-1 max-w-xl items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search Equipment ID, Work Orders, Parts SKU"
          className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-14 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
        <kbd className="absolute right-2.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          Ctrl+K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Button size="sm" className="hidden sm:flex gap-1.5 bg-destructive text-white hover:bg-destructive/90">
          <AlertTriangle className="h-4 w-4" />
          Report Breakdown
        </Button>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <div className="flex items-center gap-2 border-l border-border pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <UserRound className="h-4.5 w-4.5" />
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-foreground">Tech #4082</p>
            <p className="text-[11px] text-muted-foreground">Lead Specialist</p>
          </div>
        </div>
      </div>
    </header>
  )
}
