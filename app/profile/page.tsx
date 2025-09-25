import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import ProfileUsernameForm from "@/components/profile-username-form"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: userRes } = await supabase.auth.getUser()
  const user = userRes?.user
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch favorites grouped by entity type
  const { data: favs } = await supabase
    .from("favorites")
    .select("entity_type, entity_id, created_at")
    .eq("user_id", user.id)

  const idsByType = (type: string) => favs?.filter((f) => f.entity_type === type).map((f) => f.entity_id) || []

  const [colleges, departments, subjects, files] = await Promise.all([
    idsByType("college").length
      ? supabase.from("colleges").select("id,name,description").in("id", idsByType("college"))
      : Promise.resolve({ data: [] as any }),
    idsByType("department").length
      ? supabase.from("departments").select("id,name,description").in("id", idsByType("department"))
      : Promise.resolve({ data: [] as any }),
    idsByType("subject").length
      ? supabase.from("subjects").select("id,name,description").in("id", idsByType("subject"))
      : Promise.resolve({ data: [] as any }),
    idsByType("file").length
      ? supabase.from("files").select("id,name,description,subject_id").in("id", idsByType("file"))
      : Promise.resolve({ data: [] as any }),
  ])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
          <p className="text-muted-foreground mt-2">Favorites at a glance</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Username</CardTitle>
              <CardDescription>Set the name that will be shown with your reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileUsernameForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⭐ Favorite Colleges</CardTitle>
              <CardDescription>Your starred colleges</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {(colleges as any).data?.map((c: any) => (
                  <li key={c.id}>
                    <Link href={`/colleges/${c.id}/departments`} className="text-blue-600 hover:underline">
                      {c.name}
                    </Link>
                  </li>
                )) || <li className="text-muted-foreground">No favorites yet</li>}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⭐ Favorite Departments</CardTitle>
              <CardDescription>Your starred departments</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {(departments as any).data?.map((d: any) => (
                  <li key={d.id}>{d.name}</li>
                )) || <li className="text-muted-foreground">No favorites yet</li>}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⭐ Favorite Subjects</CardTitle>
              <CardDescription>Your starred subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {(subjects as any).data?.map((s: any) => (
                  <li key={s.id}>{s.name}</li>
                )) || <li className="text-muted-foreground">No favorites yet</li>}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⭐ Favorite Files</CardTitle>
              <CardDescription>Your starred files</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {(files as any).data?.map((f: any) => (
                  <li key={f.id}>{f.name}</li>
                )) || <li className="text-muted-foreground">No favorites yet</li>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}





