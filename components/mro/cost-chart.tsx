"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Apr", labor: 18400, parts: 9200 },
  { month: "May", labor: 21100, parts: 12600 },
  { month: "Jun", labor: 19800, parts: 8100 },
  { month: "Jul", labor: 24200, parts: 15300 },
  { month: "Aug", labor: 22600, parts: 11800 },
  { month: "Sep", labor: 26900, parts: 17400 },
]

const chartConfig = {
  labor: { label: "Labor Cost", color: "var(--color-chart-1)" },
  parts: { label: "Parts Cost", color: "var(--color-chart-2)" },
} satisfies ChartConfig

export function CostChart() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base">Maintenance Cost Trend</CardTitle>
        <CardDescription>Labor & spare parts expenditure, last 6 months (USD)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `$${v / 1000}k`} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="labor" stackId="a" fill="var(--color-labor)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="parts" stackId="a" fill="var(--color-parts)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
