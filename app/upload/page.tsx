import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileUpload } from "@/components/file-upload"

interface UploadPageProps {
  searchParams: Promise<{ subject_id?: string }>
}

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const supabase = await createClient()
  const params = await searchParams
  const subjectId = params?.subject_id

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // If a subject is provided, show direct upload form
  if (subjectId) {
    // Fetch subject context for breadcrumbs
    const { data: subject } = await supabase.from("subjects").select("*").eq("id", subjectId).single()
    if (!subject) {
      redirect("/colleges")
    }

    const { data: semester } = await supabase.from("semesters").select("*").eq("id", subject.semester_id).single()
    const { data: department } = await supabase
      .from("departments")
      .select("*")
      .eq("id", semester?.department_id)
      .single()
    const { data: college } = await supabase
      .from("colleges")
      .select("*")
      .eq("id", department?.college_id)
      .single()

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href={
                college && department && semester
                  ? `/colleges/${college.id}/departments/${department.id}/semesters/${semester.id}/subjects/${subject.id}/files`
                  : "/colleges"
              }
            >
              <Button variant="outline" size="sm">
                <span className="mr-2">←</span>
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload Files</h1>
              <p className="text-gray-600 mt-1">
                {college?.name ? `${college.name} • ${department?.name} • ${semester?.name} • ${subject.name}` : "Select a subject"}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload to {subject.name}</CardTitle>
              <CardDescription>Files will be associated with this subject</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload subjectId={subjectId} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Otherwise, start from colleges selection
  const { data: colleges } = await supabase.from("colleges").select("*").order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <span className="mr-2">←</span>
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Files</h1>
            <p className="text-gray-600 mt-1">Select a college to upload your files</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {colleges?.map((college) => (
            <Card key={college.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href={`/colleges/${college.id}/departments`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <span className="text-xl text-blue-600">🏫</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{college.name}</CardTitle>
                      <CardDescription className="text-sm">{college.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Click to browse</span>
                    <span className="text-gray-400 group-hover:text-blue-600 transition-colors">⬆️</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {!colleges?.length && (
          <Card className="text-center py-12">
            <CardContent>
              <span className="text-5xl text-gray-400 block mb-4">🏫</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Colleges Available</h3>
              <p className="text-gray-600">
                No colleges have been set up yet. Contact your administrator to add colleges.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
