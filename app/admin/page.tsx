import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/admin/login")
  }

  // Fetch all exam submissions
  const { data: submissions, error: submissionsError } = await supabase
    .from("exam_submissions")
    .select("*")
    .order("completed_at", { ascending: false })

  if (submissionsError) {
    console.error("[v0] Error fetching submissions:", submissionsError)
  }

  return <AdminDashboard submissions={submissions || []} />
}
