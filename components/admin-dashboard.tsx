"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { TOTAL_POINTS } from "@/lib/exam-data"

interface Submission {
  id: string
  first_name: string
  last_name: string
  email: string
  score: number
  total_time_seconds: number
  completed_at: string
  answers: Record<string, string>
}

interface AdminDashboardProps {
  submissions: Submission[]
}

export function AdminDashboard({ submissions }: AdminDashboardProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const exportToExcel = () => {
    // Create CSV content
    const headers = ["Nombre", "Apellido", "Email", "Puntaje", "Tiempo Total", "Fecha y Hora"]

    const rows = submissions.map((sub) => [
      sub.first_name,
      sub.last_name,
      sub.email,
      `${sub.score}/${TOTAL_POINTS}`,
      formatTime(sub.total_time_seconds),
      formatDate(sub.completed_at),
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    // Create blob and download
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `resultados_examen_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const averageScore =
    submissions.length > 0
      ? (submissions.reduce((sum, sub) => sum + sub.score, 0) / submissions.length).toFixed(2)
      : "0"

  const averageTime =
    submissions.length > 0
      ? Math.floor(submissions.reduce((sum, sub) => sum + sub.total_time_seconds, 0) / submissions.length)
      : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-muted-foreground">Resultados del Examen de Contabilidad</p>
          </div>
          <Button onClick={handleLogout} variant="outline" disabled={isLoggingOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Exámenes</CardDescription>
              <CardTitle className="text-4xl">{submissions.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Puntaje Promedio</CardDescription>
              <CardTitle className="text-4xl">
                {averageScore}/{TOTAL_POINTS}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tiempo Promedio</CardDescription>
              <CardTitle className="text-4xl">{formatTime(averageTime)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resultados</CardTitle>
                <CardDescription>Lista completa de exámenes completados</CardDescription>
              </div>
              <Button onClick={exportToExcel} disabled={submissions.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Exportar a Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Puntaje</TableHead>
                    <TableHead className="text-center">Tiempo</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No hay exámenes completados aún
                      </TableCell>
                    </TableRow>
                  ) : (
                    submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.first_name}</TableCell>
                        <TableCell>{submission.last_name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell className="text-center font-mono">
                          {submission.score}/{TOTAL_POINTS}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {formatTime(submission.total_time_seconds)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(submission.completed_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
