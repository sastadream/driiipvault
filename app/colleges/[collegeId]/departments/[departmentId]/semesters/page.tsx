import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"

interface CollegeDepartmentSemestersPageProps {
  params: Promise<{ collegeId: string; departmentId: string }>
}

export default async function CollegeDepartmentSemestersPage({ params }: CollegeDepartmentSemestersPageProps) {
  const { collegeId, departmentId } = await params
  const supabase = await createClient()

  // Fetch college and department details
  const [{ data: college }, { data: department }] = await Promise.all([
    supabase.from("colleges").select("id,name").eq("id", collegeId).single(),
    supabase.from("departments").select("id,name,description").eq("id", departmentId).single(),
  ])

  if (!college || !department) {
    notFound()
  }

  // Fetch semesters for this department
  const { data: semesters, error: semError } = await supabase
    .from("semesters")
    .select("id,name,description,created_at")
    .eq("department_id", departmentId)
    .order("name")

  if (semError) {
    console.error("Error fetching semesters:", semError)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{department.name}</h1>
            <p className="text-muted-foreground mt-2">
              {college.name} • {department.description || "Select a semester to browse subjects and files"}
            </p>
          </div>
          <Link href={`/colleges/${collegeId}/departments`}>
            <Button variant="outline">Back to Departments</Button>
          </Link>
        </div>

        {semesters && semesters.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {semesters.map((semester) => (
              <Card key={semester.id} className="hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{semester.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {semester.description || "Browse subjects and files"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(semester.created_at).toLocaleDateString()}
                    </div>
                    <Link href={`/colleges/${collegeId}/departments/${departmentId}/semesters/${semester.id}/subjects`}>
                      <Button className="w-full" size="sm">
                        View Subjects
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Semesters Found</h2>
            <p className="text-muted-foreground mb-6">
              There are no semesters available for {department.name} at the moment.
            </p>
            <Link href={`/colleges/${collegeId}/departments`}>
              <Button>Back to Departments</Button>
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
            <span className="text-foreground">{department.name}</span>
          </nav>
        </div>
      </div>
    </div>
  )
}



