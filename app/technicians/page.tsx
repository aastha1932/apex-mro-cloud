import { createClient } from "@/lib/supabase/server"
import { MroShell } from "@/components/mro/shell"
import { PageHeader } from "@/components/mro/page-header"
import { AvailabilityBadge } from "@/components/mro/badges"
import { AddTechnicianDialog } from "@/components/mro/add-technician-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, Radio, BadgeCheck } from "lucide-react"
import type { Technician } from "@/lib/types"

export default async function TechniciansPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("technicians").select("*").order("name")
  const technicians = (data ?? []) as Technician[]

  const availableCount = technicians.filter((t) => t.availability === "available").length

  return (
    <MroShell>
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <PageHeader
          crumbs={[{ label: "Operations Command", href: "/" }, { label: "Technicians" }]}
          title="Technician Roster"
          description={`${technicians.length} certified technicians on roster · ${availableCount} available now`}
          actions={<AddTechnicianDialog />}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {technicians.map((t) => (
            <Card key={t.id} className="border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.role} · {t.badge_id}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs font-medium text-muted-foreground">{t.specialization}</p>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {t.certifications.map((c) => (
                    <span
                      key={c}
                      className="flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      <BadgeCheck className="h-3 w-3 text-accent" />
                      {c}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                  {t.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3" /> {t.phone}
                    </span>
                  )}
                  {t.email && (
                    <span className="flex items-center gap-1.5 truncate">
                      <Mail className="h-3 w-3" /> {t.email}
                    </span>
                  )}
                  {t.channel && (
                    <span className="flex items-center gap-1.5">
                      <Radio className="h-3 w-3" /> {t.channel}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <AvailabilityBadge availability={t.availability} />
                  {t.active_wo_id && (
                    <span className="text-[11px] font-medium text-muted-foreground">{t.active_wo_id}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {technicians.length === 0 && (
          <Card className="border-border">
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              No technicians on roster yet. Add your first team member to begin dispatching.
            </CardContent>
          </Card>
        )}
      </div>
    </MroShell>
  )
}
