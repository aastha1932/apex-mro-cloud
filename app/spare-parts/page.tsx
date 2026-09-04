import { createClient } from "@/lib/supabase/server"
import { MroShell } from "@/components/mro/shell"
import { PageHeader } from "@/components/mro/page-header"
import { PartStatusBadge } from "@/components/mro/badges"
import { AddSparePartDialog } from "@/components/mro/add-spare-part-dialog"
import { StockAdjuster } from "@/components/mro/stock-adjuster"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { SparePart } from "@/lib/types"

export default async function SparePartsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("spare_parts").select("*").order("name")
  const parts = (data ?? []) as SparePart[]

  const totalValue = parts.reduce((sum, p) => sum + p.qty_in_stock * p.unit_cost, 0)
  const lowStockCount = parts.filter((p) => p.status !== "in_stock").length

  return (
    <MroShell>
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <PageHeader
          crumbs={[{ label: "Operations Command", href: "/" }, { label: "Spare Parts" }]}
          title="Spare Parts Inventory"
          description={`${parts.length} SKUs tracked · ${lowStockCount} at or below reorder threshold · $${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} total on-hand value`}
          actions={<AddSparePartDialog />}
        />

        <Card className="border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Bin Location</TableHead>
                  <TableHead className="text-center">Qty in Stock</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.part_number}
                        {p.specification ? ` · ${p.specification}` : ""}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.bin_location ?? "—"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <StockAdjuster id={p.id} qty={p.qty_in_stock} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-foreground">
                      ${p.unit_cost.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <PartStatusBadge status={p.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {parts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      No spare parts recorded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MroShell>
  )
}
