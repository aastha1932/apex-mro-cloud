"use client"

import { useTransition } from "react"
import { Switch } from "@/components/ui/switch"
import { toggleAutomationFlow } from "@/lib/actions"

export function FlowToggle({ id, enabled }: { id: string; enabled: boolean }) {
  const [pending, startTransition] = useTransition()

  return (
    <Switch
      checked={enabled}
      disabled={pending}
      onCheckedChange={(checked) => startTransition(() => toggleAutomationFlow(id, checked))}
      aria-label="Toggle automation flow"
    />
  )
}
