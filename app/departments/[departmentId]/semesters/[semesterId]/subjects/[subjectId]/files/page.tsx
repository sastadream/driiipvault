import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FileUpload } from "@/components/file-upload"
import { FileList } from "@/components/file-list"

interface FilesPageProps {
  params: Promise<{ departmentId: string; semesterId: string; subjectId: string }>
}

export default async function FilesPage({ params }: FilesPageProps) {
  const { departmentId, semesterId, subjectId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch all the context data
  const { data: department } = await supabase.from("departments").select("*").eq("id", departmentId).single()
  const { data: semester } = await supabase.from("semesters").select("*").eq("id", semesterId).single()
  const { data: subject } = await supabase.from("subjects").select("*").eq("id", subjectId).single()

  if (!department || !semester || !subject) {
    notFound()
  }

  // Fetch files for this subject
  const { data: filesData, error: filesError } = await supabase
    .from("files")
    .select("*")
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: false })

  if (filesError) {
    console.error("Error fetching files:", filesError)
  }

  let files = filesData || []
  if (files.length > 0) {
    const userIds = [...new Set(files.map((file) => file.uploaded_by))]
    const { data: profiles } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds)

    files = files.map((file) => ({
      ...file,
      profiles: profiles?.find((profile) => profile.id === file.uploaded_by) || null,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{subject.name}</h1>
            <p className="text-muted-foreground mt-2">
              {department.name} • {semester.name} • {subject.description || "Manage and browse files"}
            </p>
          </div>
          <Link href={`/departments/${departmentId}/semesters/${semesterId}/subjects`}>
            <Button variant="outline">Back to Subjects</Button>
          </Link>
        </div>

        {/* File Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">📤 Upload Files</CardTitle>
            <CardDescription>Upload new files to share with others in this subject</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload subjectId={subjectId} />
          </CardContent>
        </Card>

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">📁 Files ({files?.length || 0})</span>
              {files && files.length > 0 && (
                <Badge variant="secondary">
                  {files.length} file{files.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Browse and download files uploaded to this subject</CardDescription>
          </CardHeader>
          <CardContent>
            <FileList files={files || []} currentUserId={data.user.id} />
          </CardContent>
        </Card>

        {/* Breadcrumb */}
        <div className="mt-8 pt-4 border-t">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/departments" className="hover:text-foreground">
              Departments
            </Link>
            <span>/</span>
            <Link href={`/departments/${departmentId}/semesters`} className="hover:text-foreground">
              {department.name}
            </Link>
            <span>/</span>
            <Link
              href={`/departments/${departmentId}/semesters/${semesterId}/subjects`}
              className="hover:text-foreground"
            >
              {semester.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{subject.name}</span>
          </nav>
        </div>
      </div>
    </div>
  )
}
