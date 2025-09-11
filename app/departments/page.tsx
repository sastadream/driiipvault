import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DepartmentsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch all departments
  const { data: departments, error: deptError } = await supabase.from("departments").select("*").order("name")

  if (deptError) {
    console.error("Error fetching departments:", deptError)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Select Department</h1>
            <p className="text-muted-foreground mt-2">Choose a department to browse files and resources</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {departments && departments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((department) => (
              <Card key={department.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">{department.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {department.description || "No description available"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(department.created_at).toLocaleDateString()}
                    </div>
                    <Link href={`/departments/${department.id}/semesters`}>
                      <Button className="w-full">Browse Semesters</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Departments Found</h2>
            <p className="text-muted-foreground mb-6">There are no departments available at the moment.</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📤</div>
                  <div>
                    <div className="font-medium">Upload Files</div>
                    <div className="text-sm text-muted-foreground">Add new resources</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🔍</div>
                  <div>
                    <div className="font-medium">Search Files</div>
                    <div className="text-sm text-muted-foreground">Find specific content</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">👤</div>
                  <div>
                    <div className="font-medium">My Uploads</div>
                    <div className="text-sm text-muted-foreground">View your files</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
