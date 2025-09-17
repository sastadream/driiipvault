import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FavoriteButton } from "@/components/favorite-button"

interface CollegeDepartmentSemesterSubjectsPageProps {
  params: Promise<{ collegeId: string; departmentId: string; semesterId: string }>
}

export default async function CollegeDepartmentSemesterSubjectsPage({ params }: CollegeDepartmentSemesterSubjectsPageProps) {
  const { collegeId, departmentId, semesterId } = await params
  const supabase = await createClient()

  // Fetch college, department, and semester details
  const [{ data: college }, { data: department }, { data: semester }] = await Promise.all([
    supabase.from("colleges").select("id,name").eq("id", collegeId).single(),
    supabase.from("departments").select("id,name,description").eq("id", departmentId).single(),
    supabase.from("semesters").select("id,name,description").eq("id", semesterId).single(),
  ])

  if (!college || !department || !semester) {
    notFound()
  }

  // Fetch subjects for this semester
  const { data: subjects, error: subError } = await supabase
    .from("subjects")
    .select("id,name,description,created_at")
    .eq("semester_id", semesterId)
    .order("name")

  if (subError) {
    console.error("Error fetching subjects:", subError)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{semester.name}</h1>
            <p className="text-muted-foreground mt-2">
              {college.name} • {department.name} • {semester.description || "Select a subject to browse files"}
            </p>
          </div>
          <Link href={`/colleges/${collegeId}/departments/${departmentId}/semesters`}>
            <Button variant="outline">Back to Semesters</Button>
          </Link>
        </div>

        {subjects && subjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{subject.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {subject.description || "Browse and manage files"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(subject.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/colleges/${collegeId}/departments/${departmentId}/semesters/${semesterId}/subjects/${subject.id}/files`} className="flex-1">
                        <Button className="w-full" size="sm">
                          View Files
                        </Button>
                      </Link>
                      <FavoriteButton entityType="subject" entityId={subject.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Subjects Found</h2>
            <p className="text-muted-foreground mb-6">
              There are no subjects available for {semester.name} at the moment.
            </p>
            <Link href={`/colleges/${collegeId}/departments/${departmentId}/semesters`}>
              <Button>Back to Semesters</Button>
            </Link>
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
            <span className="text-foreground">{semester.name}</span>
          </nav>
        </div>
      </div>
    </div>
  )
}



