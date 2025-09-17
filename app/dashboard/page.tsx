import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Chatbot } from "@/components/chatbot"
import { LogoutButton } from "@/components/logout-button"
import { createClient as createBrowser } from "@/lib/supabase/server"

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
          <LogoutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🏫 Browse Colleges</CardTitle>
              <CardDescription>Access files organized by college, department, semester, and subject</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/colleges">
                <Button className="w-full">Browse Colleges</Button>
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

        {/* Favorites section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Your Favorites</h2>
          {/* Lightweight server fetch for top favorites (departments/subjects/files) */}
          {/* In a full implementation, we would fetch and render cards linking to each entity */}
          <p className="text-muted-foreground text-sm">Star departments, subjects, or files to see them here.</p>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">11</div>
                <div className="text-sm text-muted-foreground">Colleges</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">110</div>
                <div className="text-sm text-muted-foreground">Departments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">880</div>
                <div className="text-sm text-muted-foreground">Semesters</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">1,650</div>
                <div className="text-sm text-muted-foreground">Subjects</div>
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
