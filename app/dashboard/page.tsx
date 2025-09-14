import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Chatbot } from "@/components/chatbot"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">File Management System</h1>
            <p className="text-muted-foreground mt-2">Welcome back, {profile?.full_name || data.user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <Button variant="outline" type="submit">
              Sign Out
            </Button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📚 Browse Files</CardTitle>
              <CardDescription>Access files organized by department, semester, and subject</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/departments">
                <Button className="w-full">Browse Departments</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📤 Upload Files</CardTitle>
              <CardDescription>Upload new files to share with others</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/upload">
                <Button className="w-full" variant="secondary">
                  Upload Files
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">👤 My Profile</CardTitle>
              <CardDescription>Manage your account settings and uploaded files</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button className="w-full bg-transparent" variant="outline">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">10</div>
                <div className="text-sm text-muted-foreground">Departments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">80</div>
                <div className="text-sm text-muted-foreground">Semesters</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">Subjects</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Files Uploaded</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 border-t pt-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Developed & Designed by</p>
            <p className="text-lg font-semibold text-foreground">Samir Desai</p>
            <p className="text-xs text-muted-foreground mt-1">Full Stack Developer & UI/UX Designer</p>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  )
}
