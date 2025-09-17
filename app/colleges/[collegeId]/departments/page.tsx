import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FavoriteButton } from "@/components/favorite-button"

interface CollegeDepartmentsPageProps {
  params: Promise<{ collegeId: string }>
}

export default async function CollegeDepartmentsPage({ params }: CollegeDepartmentsPageProps) {
  const { collegeId } = await params
  const supabase = await createClient()

  // Fetch college details
  const { data: college } = await supabase.from("colleges").select("id,name,description").eq("id", collegeId).single()

  if (!college) {
    notFound()
  }

  // Fetch departments for this college
  const { data: departments, error: deptError } = await supabase
    .from("departments")
    .select("id,name,description,created_at")
    .eq("college_id", collegeId)
    .order("name")

  if (deptError) {
    console.error("Error fetching departments:", deptError)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{college.name}</h1>
            <p className="text-muted-foreground mt-2">
              {college.description || "Select a department to browse semesters and files"}
            </p>
          </div>
          <Link href="/colleges">
            <Button variant="outline">Back to Colleges</Button>
          </Link>
        </div>

        {departments && departments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((department) => (
              <Card key={department.id} className="hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{department.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {department.description || "Browse semesters and files"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(department.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/colleges/${collegeId}/departments/${department.id}/semesters`} className="flex-1">
                        <Button className="w-full" size="sm">
                          View Semesters
                        </Button>
                      </Link>
                      <FavoriteButton entityType="department" entityId={department.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏗️</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Departments Found</h2>
            <p className="text-muted-foreground mb-6">
              There are no departments available for {college.name} at the moment.
            </p>
            <Link href="/colleges">
              <Button>Back to Colleges</Button>
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
            <span className="text-foreground">{college.name}</span>
          </nav>
        </div>
      </div>
    </div>
  )
}



