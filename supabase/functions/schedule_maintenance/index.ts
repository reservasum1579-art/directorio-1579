// supabase/functions/schedule_maintenance/index.ts
import { serve } from 'https://deno.land/x/supabase/functions/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts' // helper that returns supabase client with service_role

serve(async (req) => {
  const { data: tasks, error } = await supabaseAdmin
    .from('maintenance_tasks')
    .select('*')
    .eq('is_active', true)

  if (error) return new Response(JSON.stringify({ error }), { status: 500 })

  const today = new Date()
  const notifications: any[] = []

  for (const task of tasks) {
    const next = new Date(task.next_due_date)
    const alertDate = new Date(next)
    alertDate.setDate(alertDate.getDate() - (task.alert_days_before ?? 7))

    if (today >= alertDate && today <= next) {
      // create notification
      const { error: nErr } = await supabaseAdmin.from('notifications').insert({
        user_id: null, // broadcast to all admins/consejo
        title: `Mantenimiento próximo: ${task.title}`,
        body: `El mantenimiento "${task.title}" vence el ${next.toISOString().split('T')[0]}`,
        type: 'maintenance_alert',
        metadata: { task_id: task.id },
      })
      if (nErr) console.error('notification error', nErr)
    }

    // if overdue, generate overdue notification
    if (today > next) {
      const { error: oErr } = await supabaseAdmin.from('notifications').insert({
        user_id: null,
        title: `Mantenimiento VENCIDO: ${task.title}`,
        body: `El mantenimiento "${task.title}" está vencido desde ${next.toISOString().split('T')[0]}`,
        type: 'maintenance_overdue',
        metadata: { task_id: task.id },
      })
      if (oErr) console.error('overdue error', oErr)
    }
  }

  return new Response(JSON.stringify({ ok: true, processed: tasks.length }))
})
