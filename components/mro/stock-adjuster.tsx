"use client"

import { useTransition } from "react"
import { Minus, Plus } from "lucide-react"
import { adjustPartStock } from "@/lib/actions"

export function StockAdjuster({ id, qty }: { id: string; qty: number }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-1.5">
      <button
        disabled={pending || qty <= 0}
        onClick={() => startTransition(() => adjustPartStock(id, -1))}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary disabled:opacity-40"
        aria-label="Decrease stock"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums text-foreground">{qty}</span>
      <button
        disabled={pending}
        onClick={() => startTransition(() => adjustPartStock(id, 1))}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary disabled:opacity-40"
        aria-label="Increase stock"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  )
}
