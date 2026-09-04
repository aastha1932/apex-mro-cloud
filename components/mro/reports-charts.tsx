"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

const STATUS_COLORS: Record<string, string> = {
  active: "var(--color-success)",
  under_repair: "var(--color-destructive)",
  standby: "var(--color-warning)",
  inactive: "var(--color-muted-foreground)",
}

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  under_repair: "Under Repair",
  standby: "Standby",
  inactive: "Inactive",
}

export function EquipmentStatusChart({ counts }: { counts: Record<string, number> }) {
  const data = Object.entries(counts).map(([key, value]) => ({
    status: STATUS_LABELS[key] ?? key,
    value,
    fill: STATUS_COLORS[key] ?? "var(--color-muted-foreground)",
  }))

  const config = Object.fromEntries(
    Object.entries(STATUS_LABELS).map(([key, label]) => [key, { label, color: STATUS_COLORS[key] }]),
  ) satisfies ChartConfig

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base">Equipment Status Distribution</CardTitle>
        <CardDescription>Fleet-wide operational status across all registered assets</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto h-64 w-full max-w-xs">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
            <Pie data={data} dataKey="value" nameKey="status" innerRadius={55} outerRadius={90} strokeWidth={2}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="status" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: "var(--color-destructive)",
  high: "var(--color-warning)",
  medium: "var(--color-chart-1)",
  low: "var(--color-muted-foreground)",
}

export function WorkOrderPriorityChart({ counts }: { counts: Record<string, number> }) {
  const data = ["critical", "high", "medium", "low"].map((key) => ({
    priority: key.charAt(0).toUpperCase() + key.slice(1),
    count: counts[key] ?? 0,
    fill: PRIORITY_COLORS[key],
  }))

  const config = {
    count: { label: "Work Orders" },
  } satisfies ChartConfig

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base">Work Orders by Priority</CardTitle>
        <CardDescription>Current triage load across severity tiers</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis type="category" dataKey="priority" tickLine={false} axisLine={false} width={70} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell key={entry.priority} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function MaintenanceTypeChart({ preventive, corrective }: { preventive: number; corrective: number }) {
  const data = [
    { type: "Preventive", count: preventive, fill: "var(--color-success)" },
    { type: "Corrective", count: corrective, fill: "var(--color-destructive)" },
  ]
  const config = { count: { label: "Work Orders" } } satisfies ChartConfig

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base">Preventive vs Corrective</CardTitle>
        <CardDescription>Maintenance strategy mix, all-time work orders</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="type" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.type} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
