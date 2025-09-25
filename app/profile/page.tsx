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
      ? supabase.from("departments").select("id,name,description,college_id").in("id", idsByType("department"))
      : Promise.resolve({ data: [] as any }),
    idsByType("subject").length
      ? supabase
          .from("subjects")
          .select("id,name,description, semester:semesters(id,name, department:departments(id, college_id))")
          .in("id", idsByType("subject"))
      : Promise.resolve({ data: [] as any }),
    idsByType("file").length
      ? supabase
          .from("files")
          .select("id,name,description, subject:subjects(id,name, semester:semesters(id, department:departments(id, college_id)))")
          .in("id", idsByType("file"))
      : Promise.resolve({ data: [] as any }),
  ])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your account, username and favorites</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Username</CardTitle>
              <CardDescription>Set the name shown with your reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileUsernameForm />
              <p className="text-xs text-muted-foreground mt-2">This name will be visible on your reviews.</p>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:col-span-2 md:grid-cols-2">
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
                    <li key={d.id}>
                      <Link href={`/colleges/${d.college_id}/departments/${d.id}/semesters`} className="text-blue-600 hover:underline">
                        {d.name}
                      </Link>
                    </li>
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
                    <li key={s.id}>
                      <Link
                        href={`/colleges/${s.semester?.department?.college_id}/departments/${s.semester?.department?.id}/semesters/${s.semester?.id}/subjects/${s.id}/files`}
                        className="text-blue-600 hover:underline"
                      >
                        {s.name}
                      </Link>
                    </li>
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
                    <li key={f.id}>
                      <Link
                        href={`/colleges/${f.subject?.semester?.department?.college_id}/departments/${f.subject?.semester?.department?.id}/semesters/${f.subject?.semester?.id}/subjects/${f.subject?.id}/files`}
                        className="text-blue-600 hover:underline"
                      >
                        {f.name}
                      </Link>
                    </li>
                  )) || <li className="text-muted-foreground">No favorites yet</li>}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}





