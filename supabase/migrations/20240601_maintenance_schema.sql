-- Migration: maintenance schema
-- File: 20240601_maintenance_schema.sql

-- ------------------------------------------------------------
-- Table: maintenance_tasks (preventive tasks)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.maintenance_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  frequency text NOT NULL,          -- monthly, quarterly, custom, etc.
  custom_interval_days int,          -- used when frequency = 'custom'
  vendor text,
  next_due_date date,
  alert_days_before int DEFAULT 7,
  estimated_cost numeric,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- ------------------------------------------------------------
-- Table: maintenance_executions (historical executions of tasks)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.maintenance_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.maintenance_tasks(id) ON DELETE CASCADE,
  performed_by uuid NOT NULL,
  vendor text,
  performed_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text,
  cost numeric,
  status text NOT NULL,               -- completed, pending, cancelled
  created_at timestamp with time zone DEFAULT now()
);

-- ------------------------------------------------------------
-- Table: maintenance_incidents (corrective incidents)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.maintenance_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  location text,
  category text,
  priority text NOT NULL,
  reported_by uuid NOT NULL,
  assigned_to uuid,
  possible_cause text,
  solution text,
  status text NOT NULL,
  detected_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone,
  total_cost numeric,
  created_at timestamp with time zone DEFAULT now()
);

-- ------------------------------------------------------------
-- Table: maintenance_files (evidences for tasks/incidents)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.maintenance_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,   -- 'task', 'execution', 'incident'
  entity_id uuid NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  uploaded_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_building ON public.maintenance_tasks(building_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_next_due ON public.maintenance_tasks(next_due_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_executions_task ON public.maintenance_executions(task_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_incidents_building ON public.maintenance_incidents(building_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_files_entity ON public.maintenance_files(entity_type, entity_id);

-- ------------------------------------------------------------
-- Row Level Security (RLS) policies
-- ------------------------------------------------------------
-- Enable RLS on all tables
ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_files ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role (already exists in other migrations)
-- Policies for admin_general & admin (full CRUD)
CREATE POLICY admin_full_access ON public.maintenance_tasks FOR ALL USING (auth.role() IN ('admin_general','admin','admin_consorcio')) WITH CHECK (auth.role() IN ('admin_general','admin','admin_consorcio'));
CREATE POLICY admin_full_access ON public.maintenance_executions FOR ALL USING (auth.role() IN ('admin_general','admin','admin_consorcio')) WITH CHECK (auth.role() IN ('admin_general','admin','admin_consorcio'));
CREATE POLICY admin_full_access ON public.maintenance_incidents FOR ALL USING (auth.role() IN ('admin_general','admin','admin_consorcio')) WITH CHECK (auth.role() IN ('admin_general','admin','admin_consorcio'));
CREATE POLICY admin_full_access ON public.maintenance_files FOR ALL USING (auth.role() IN ('admin_general','admin','admin_consorcio')) WITH CHECK (auth.role() IN ('admin_general','admin','admin_consorcio'));

-- Consejo: can INSERT/UPDATE tasks (preventive) and SELECT on all tables
CREATE POLICY consejo_task_write ON public.maintenance_tasks FOR INSERT, UPDATE USING (auth.role() = 'consejo') WITH CHECK (auth.role() = 'consejo');
CREATE POLICY consejo_select_all ON public.maintenance_tasks FOR SELECT USING (auth.role() = 'consejo');
CREATE POLICY consejo_select_all ON public.maintenance_executions FOR SELECT USING (auth.role() = 'consejo');
CREATE POLICY consejo_select_all ON public.maintenance_incidents FOR SELECT USING (auth.role() = 'consejo');
CREATE POLICY consejo_select_all ON public.maintenance_files FOR SELECT USING (auth.role() = 'consejo');

-- Users without explicit role can only see their own incidents (optional)
CREATE POLICY user_own_incident ON public.maintenance_incidents FOR SELECT USING (auth.uid() = reported_by);

-- ------------------------------------------------------------
-- Triggers (example: update next_due_date after execution)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_next_due_date() RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    IF NEW.task_id IS NOT NULL THEN
      UPDATE public.maintenance_tasks SET next_due_date =
        CASE
          WHEN frequency = 'monthly' THEN (NEW.performed_at + interval '1 month')::date
          WHEN frequency = 'bimonthly' THEN (NEW.performed_at + interval '2 months')::date
          WHEN frequency = 'quarterly' THEN (NEW.performed_at + interval '3 months')::date
          WHEN frequency = 'semiannual' THEN (NEW.performed_at + interval '6 months')::date
          WHEN frequency = 'annual' THEN (NEW.performed_at + interval '12 months')::date
          WHEN frequency = 'custom' AND custom_interval_days IS NOT NULL THEN (NEW.performed_at + (custom_interval_days || ' days')::interval)::date
          ELSE next_due_date
        END
      WHERE id = NEW.task_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_next_due AFTER INSERT ON public.maintenance_executions FOR EACH ROW EXECUTE FUNCTION public.update_next_due_date();

-- ------------------------------------------------------------
-- End of migration
-- ------------------------------------------------------------
