import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const SEM1_2_SUBJECTS = [
  "BME","BEE","BASIC-CIVIL","BE","BIOLOGY","CHEMISTRY","DT","EGD","ENGLISH-COMMU","IPDC","MATHS-1","ORGANIS-BEHAVIOUR","PHYSICS","PPS","UHV"
]

interface Props { params: Promise<{ semester: string }> }

export default async function BooksSemesterPage({ params }: Props) {
  const { semester } = await params
  const subjects = ["SEM-1","SEM-2"].includes(semester) ? SEM1_2_SUBJECTS : []

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{semester} BOOKs</h1>
          <p className="text-muted-foreground mt-2">Select a subject to view and upload files</p>
        </div>

        {subjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((name) => (
              <Card key={name} className="hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{name}</CardTitle>
                  <CardDescription>Browse and upload resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/books/${encodeURIComponent(semester)}/${encodeURIComponent(name)}`} className="text-blue-600 underline">
                    Open {name}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Subjects for {semester} will be added soon.</p>
        )}
      </div>
    </div>
  )
}


