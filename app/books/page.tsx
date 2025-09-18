import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const SEMESTERS = [
  "SEM-1","SEM-2","SEM-3","SEM-4","SEM-5","SEM-6","SEM-7","SEM-8"
]

export default function BooksHome() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">BOOKs</h1>
          <p className="text-muted-foreground mt-2">Choose a semester</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SEMESTERS.map((s) => (
            <Card key={s} className="hover:shadow-lg">
              <CardHeader>
                <CardTitle>{s}</CardTitle>
                <CardDescription>Select a subject</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/books/${encodeURIComponent(s)}`} className="text-blue-600 underline">
                  Open {s}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}


