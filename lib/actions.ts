"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

function genId(prefix: string) {
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${rand}`
}

export async function createEquipment(formData: FormData) {
  const supabase = await createClient()
  const payload = {
    equipment_id: (formData.get("equipment_id") as string) || genId("EQ"),
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    location: formData.get("location") as string,
    oem: (formData.get("oem") as string) || null,
    criticality: formData.get("criticality") as string,
    status: formData.get("status") as string,
    notes: (formData.get("notes") as string) || null,
    health_score: Number(formData.get("health_score") ?? 100),
  }
  const { error } = await supabase.from("equipment").insert(payload)
  if (error) throw new Error(error.message)
  revalidatePath("/equipment")
  revalidatePath("/")
}

export async function updateEquipmentStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("equipment").update({ status, updated_at: new Date().toISOString() }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/equipment")
  revalidatePath("/")
}

export async function createWorkOrder(formData: FormData) {
  const supabase = await createClient()
  const payload = {
    wo_number: genId("WO-2024"),
    equipment_id: (formData.get("equipment_id") as string) || null,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    priority: formData.get("priority") as string,
    maintenance_type: formData.get("maintenance_type") as string,
    technician_id: (formData.get("technician_id") as string) || null,
    location: (formData.get("location") as string) || null,
    status: "open",
    dispatched_at: new Date().toISOString(),
  }
  const { error } = await supabase.from("work_orders").insert(payload)
  if (error) throw new Error(error.message)
  revalidatePath("/work-orders")
  revalidatePath("/")
}

export async function updateWorkOrderStatus(id: string, status: "open" | "in_progress" | "completed") {
  const supabase = await createClient()
  const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (status === "completed") patch.resolved_at = new Date().toISOString()
  const { error } = await supabase.from("work_orders").update(patch).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/work-orders")
  revalidatePath("/")
}

export async function createSparePart(formData: FormData) {
  const supabase = await createClient()
  const qty = Number(formData.get("qty_in_stock") ?? 0)
  const threshold = Number(formData.get("reorder_threshold") ?? 0)
  const payload = {
    part_number: (formData.get("part_number") as string) || genId("SKU"),
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    specification: (formData.get("specification") as string) || null,
    qty_in_stock: qty,
    reorder_threshold: threshold,
    unit_cost: Number(formData.get("unit_cost") ?? 0),
    bin_location: (formData.get("bin_location") as string) || null,
    status: qty === 0 ? "out_of_stock" : qty <= threshold ? "low_stock" : "in_stock",
  }
  const { error } = await supabase.from("spare_parts").insert(payload)
  if (error) throw new Error(error.message)
  revalidatePath("/spare-parts")
  revalidatePath("/")
}

export async function adjustPartStock(id: string, delta: number) {
  const supabase = await createClient()
  const { data: part, error: fetchError } = await supabase
    .from("spare_parts")
    .select("qty_in_stock, reorder_threshold")
    .eq("id", id)
    .single()
  if (fetchError || !part) throw new Error(fetchError?.message ?? "Part not found")

  const newQty = Math.max(0, part.qty_in_stock + delta)
  const status = newQty === 0 ? "out_of_stock" : newQty <= part.reorder_threshold ? "low_stock" : "in_stock"

  const { error } = await supabase
    .from("spare_parts")
    .update({ qty_in_stock: newQty, status, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/spare-parts")
  revalidatePath("/")
}

export async function createTechnician(formData: FormData) {
  const supabase = await createClient()
  const certifications = ((formData.get("certifications") as string) || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean)
  const payload = {
    badge_id: genId("TECH"),
    name: formData.get("name") as string,
    role: formData.get("role") as string,
    specialization: formData.get("specialization") as string,
    certifications,
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    channel: (formData.get("channel") as string) || null,
    availability: formData.get("availability") as string,
    shift: (formData.get("shift") as string) || "Shift 1",
  }
  const { error } = await supabase.from("technicians").insert(payload)
  if (error) throw new Error(error.message)
  revalidatePath("/technicians")
  revalidatePath("/")
}

export async function updateTechnicianAvailability(id: string, availability: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("technicians").update({ availability }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/technicians")
}

export async function toggleAutomationFlow(id: string, enabled: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from("automation_flows").update({ enabled }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/automations")
}
