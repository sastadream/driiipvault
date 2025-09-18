import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import BookUpload from "@/components/book-upload"

interface Props { params: Promise<{ semester: string; subject: string }> }

export default async function BooksSubjectPage({ params }: Props) {
  const { semester, subject } = await params
  const supabase = await createClient()

  // Use a storage path prefix for books within the existing 'files' bucket
  const prefix = `books/${encodeURIComponent(semester)}/${encodeURIComponent(subject)}`

  // Fetch BOOKs files from dedicated table
  const { data: files } = await supabase
    .from("books_files")
    .select("id,name,description,file_path,file_size,mime_type,created_at")
    .eq("semester", semester)
    .eq("subject", subject)
    .order("created_at", { ascending: false })

  // Build public URLs
  const withUrls = await Promise.all(
    (files || []).map(async (f) => {
      const { data: pub } = await supabase.storage.from("files").getPublicUrl(f.file_path)
      return { ...f, publicUrl: pub.publicUrl }
    })
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">BOOKs • {semester} • {subject}</h1>
            <p className="text-muted-foreground mt-2">View and upload resources</p>
          </div>
          {/* Direct upload in-page for books */}
        </div>

        <div className="mb-8">
          <BookUpload semester={semester} subject={subject} />
        </div>

        {withUrls && withUrls.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {withUrls.map((file) => (
                <Card key={file.id} className="hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">{file.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {file.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      <div className="text-sm text-muted-foreground">
                        <div>Size: {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : 'Unknown'}</div>
                        <div>Type: {file.mime_type || 'Unknown'}</div>
                        <div>Uploaded: {new Date(file.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="flex gap-2">
                        <a href={file.publicUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button variant="outline" size="sm" className="w-full">View</Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-sm text-red-600">
                IF THE FILE YOU WANT IS NOT HERE! JUST CONTACT US — WE WILL ADD THAT FILE WITHIN 2 HOURS. WhatsApp - 6353676040
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Files Found</h2>
            <p className="text-muted-foreground mb-6">
              There are no files available for {subject} at the moment.
            </p>
            <p className="text-sm text-red-600 mb-6">
              IF THE FILE YOU WANT IS NOT HERE! JUST CONTACT US — WE WILL ADD THAT FILE WITHIN 2 HOURS. WhatsApp - 6353676040
            </p>
            <div className="flex gap-4 justify-center">
              <Link href={`/books/${encodeURIComponent(semester)}`}>
                <Button variant="outline">Back to Subjects</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


