import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FavoriteButton } from "@/components/favorite-button"
import DeleteFileButton from "@/components/delete-file-button"

interface SubjectFilesPageProps {
  params: Promise<{ collegeId: string; departmentId: string; semesterId: string; subjectId: string }>
}

export default async function SubjectFilesPage({ params }: SubjectFilesPageProps) {
  const { collegeId, departmentId, semesterId, subjectId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch all details
  const { data: college } = await supabase.from("colleges").select("*").eq("id", collegeId).single()
  const { data: department } = await supabase.from("departments").select("*").eq("id", departmentId).single()
  const { data: semester } = await supabase.from("semesters").select("*").eq("id", semesterId).single()
  const { data: subject } = await supabase.from("subjects").select("*").eq("id", subjectId).single()

  if (!college || !department || !semester || !subject) {
    notFound()
  }

  // Fetch files for this subject
  const { data: filesRaw, error: filesError } = await supabase
    .from("files")
    .select("id, name, description, file_path, file_size, mime_type, created_at")
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: false })

  if (filesError) {
    console.error("Error fetching files:", filesError)
  }

  // Create public URLs (assuming bucket name is "files")
  const files = await Promise.all(
    (filesRaw || []).map(async (f) => {
      const { data: pub } = await supabase.storage.from("files").getPublicUrl(f.file_path)
      return { ...f, publicUrl: pub.publicUrl }
    })
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{subject.name}</h1>
            <p className="text-muted-foreground mt-2">
              {college.name} • {department.name} • {semester.name} • {subject.description || "Browse and manage files"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/colleges/${collegeId}/departments/${departmentId}/semesters/${semesterId}/subjects`}>
              <Button variant="outline">Back to Subjects</Button>
            </Link>
            <Link href={`/upload?subject_id=${subjectId}`}>
              <Button>Upload File</Button>
            </Link>
          </div>
        </div>

        {files && files.length > 0 ? (
          <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <Card key={file.id} className="hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{file.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {file.description || "No description available"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="text-sm text-muted-foreground">
                      <div>Size: {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : 'Unknown'}</div>
                      <div>Type: {file.mime_type || 'Unknown'}</div>
                      <div>Uploaded: {new Date(file.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <a href={file.publicUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button variant="outline" size="sm" className="w-full">View</Button>
                      </a>
                      <FavoriteButton entityType="file" entityId={file.id} />
                      {/* Admin-only delete is enforced by RLS, button will error for non-admins */}
                      <DeleteFileButton table="files" id={file.id} filePath={file.file_path} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <p className="text-sm text-red-600">
              IF THE FILE YOU WANT IS NOT HERE! JUST CONTACT US — WE WILL ADD THAT FILE WITHIN 2 HOURS. WhatsApp - 6353676040
            </p>
          </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Files Found</h2>
            <p className="text-muted-foreground mb-6">
              There are no files available for {subject.name} at the moment.
            </p>
            <p className="text-sm text-red-600 mb-6">
              IF THE FILE YOU WANT IS NOT HERE! JUST CONTACT US — WE WILL ADD THAT FILE WITHIN 2 HOURS. WhatsApp - 6353676040
            </p>
            <div className="flex gap-4 justify-center">
              <Link href={`/upload?subject_id=${subjectId}`}>
                <Button>Upload First File</Button>
              </Link>
              <Link href={`/colleges/${collegeId}/departments/${departmentId}/semesters/${semesterId}/subjects`}>
                <Button variant="outline">Back to Subjects</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="mt-8 pt-4 border-t">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/colleges" className="hover:text-foreground">
              Colleges
            </Link>
            <span>/</span>
            <Link href={`/colleges/${collegeId}/departments`} className="hover:text-foreground">
              {college.name}
            </Link>
            <span>/</span>
            <Link href={`/colleges/${collegeId}/departments/${departmentId}/semesters`} className="hover:text-foreground">
              {department.name}
            </Link>
            <span>/</span>
            <Link href={`/colleges/${collegeId}/departments/${departmentId}/semesters/${semesterId}/subjects`} className="hover:text-foreground">
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



