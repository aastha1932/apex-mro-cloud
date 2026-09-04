export type Technician = {
  id: string
  badge_id: string
  name: string
  role: string
  specialization: string
  certifications: string[]
  phone: string | null
  email: string | null
  channel: string | null
  avatar_url: string | null
  availability: "available" | "busy" | "on_call" | "offline"
  active_wo_id: string | null
  shift: string
  created_at: string
}

export type Equipment = {
  id: string
  equipment_id: string
  name: string
  category: string
  subcategory: string | null
  oem: string | null
  location: string
  sector: string | null
  installation_date: string | null
  criticality: "Tier 1 - Critical" | "Tier 2 - Essential" | "Tier 3 - Standard"
  status: "active" | "under_repair" | "standby" | "inactive"
  operating_hours: number
  cycles: number
  health_score: number
  notes: string | null
  icon: string | null
  created_at: string
  updated_at: string
}

export type WorkOrder = {
  id: string
  wo_number: string
  equipment_id: string | null
  title: string
  description: string | null
  priority: "critical" | "high" | "medium" | "low"
  status: "open" | "in_progress" | "completed"
  maintenance_type: "preventive" | "corrective"
  technician_id: string | null
  location: string | null
  tags: string[]
  downtime_minutes: number | null
  created_at: string
  dispatched_at: string | null
  resolved_at: string | null
  updated_at: string
  equipment?: Pick<Equipment, "id" | "name" | "equipment_id" | "location"> | null
  technician?: Pick<Technician, "id" | "name" | "badge_id"> | null
}

export type SparePart = {
  id: string
  part_number: string
  name: string
  oem_sku: string | null
  category: string
  specification: string | null
  qty_in_stock: number
  reorder_threshold: number
  unit_cost: number
  bin_location: string | null
  status: "in_stock" | "low_stock" | "out_of_stock"
  created_at: string
  updated_at: string
}

export type AutomationFlow = {
  id: string
  flow_id: string
  name: string
  category: "work_orders" | "inventory" | "telemetry"
  trigger_label: string
  trigger_description: string
  action_label: string
  action_title: string
  action_description: string
  status_badge: string | null
  enabled: boolean
  runs_7d: number
  last_run_at: string | null
  created_at: string
}
