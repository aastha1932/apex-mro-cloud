import { createClient } from "@/lib/supabase/server"
import { MroShell } from "@/components/mro/shell"
import { PageHeader } from "@/components/mro/page-header"
import { FlowToggle } from "@/components/mro/flow-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Zap, Workflow } from "lucide-react"
import type { AutomationFlow } from "@/lib/types"

const CATEGORY_LABELS: Record<string, string> = {
  work_orders: "Work Orders",
  inventory: "Inventory",
  telemetry: "Telemetry",
}

export default async function AutomationsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("automation_flows").select("*").order("created_at")
  const flows = (data ?? []) as AutomationFlow[]

  const activeCount = flows.filter((f) => f.enabled).length
  const totalRuns = flows.reduce((sum, f) => sum + f.runs_7d, 0)

  return (
    <MroShell>
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <PageHeader
          crumbs={[{ label: "Operations Command", href: "/" }, { label: "Automations" }]}
          title="Automation Flows"
          description={`${activeCount} of ${flows.length} flows active · ${totalRuns} runs in the last 7 days`}
        />

        <div className="flex flex-col gap-4">
          {flows.map((flow) => (
            <Card key={flow.id} className="border-border">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                      <Workflow className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{flow.name}</p>
                        <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          {CATEGORY_LABELS[flow.category] ?? flow.category}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{flow.flow_id}</p>
                    </div>
                  </div>
                  <FlowToggle id={flow.id} enabled={flow.enabled} />
                </div>

                <div className="mt-4 flex flex-col gap-3 rounded-md bg-secondary/60 p-4 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {flow.trigger_label}
                    </p>
                    <p className="mt-0.5 text-sm text-foreground text-pretty">{flow.trigger_description}</p>
                  </div>
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
                  <div className="flex-1">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
                      <Zap className="h-3 w-3" />
                      {flow.action_title}
                    </p>
                    <p className="mt-0.5 text-sm text-foreground text-pretty">{flow.action_description}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {flow.runs_7d} runs (7d){flow.status_badge ? ` · ${flow.status_badge}` : ""}
                  </span>
                  {flow.last_run_at && (
                    <span>
                      Last run{" "}
                      {new Date(flow.last_run_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {flows.length === 0 && (
            <Card className="border-border">
              <CardContent className="p-10 text-center text-sm text-muted-foreground">
                No automation flows configured yet.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MroShell>
  )
}
