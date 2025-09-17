import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FavoriteButton } from "@/components/favorite-button"

export default async function CollegesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch all colleges
  const { data: colleges, error: collegesError } = await supabase
    .from("colleges")
    .select("*")
    .order("name")

  if (collegesError) {
    console.error("Error fetching colleges:", collegesError)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Colleges</h1>
            <p className="text-muted-foreground mt-2">
              Select a college to browse departments and files
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

            {colleges && colleges.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {colleges.map((college) => (
              <Card key={college.id} className="hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{college.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {college.description || "Browse departments and files"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                      <div className="flex flex-col gap-3">
                    <div className="text-sm text-muted-foreground">
                      Code: {college.code}
                    </div>
                        <div className="flex gap-2">
                          <Link href={`/colleges/${college.id}/departments`} className="flex-1">
                            <Button className="w-full" size="sm">
                              View Departments
                            </Button>
                          </Link>
                          <FavoriteButton entityType="college" entityId={college.id} />
                        </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏫</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Colleges Found</h2>
            <p className="text-muted-foreground mb-6">
              There are no colleges available at the moment.
            </p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
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
            <span className="text-foreground">Colleges</span>
          </nav>
        </div>
      </div>
    </div>
  )
}


