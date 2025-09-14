"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ImageIcon, Video, Music, Archive, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface FileData {
  id: string
  name: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  description: string | null
  uploaded_by: string
  created_at: string
  profiles: {
    full_name: string | null
    email: string
  } | null
}

interface FileListProps {
  files: FileData[]
  currentUserId: string
}

export function FileList({ files, currentUserId }: FileListProps) {
  const router = useRouter()
  const [viewingId, setViewingId] = useState<string | null>(null)
  const supabase = createClient()

  const handleView = async (file: FileData) => {
    try {
      setViewingId(file.id)

      const { data, error } = await supabase.storage.from("files").getPublicUrl(file.file_path)

      if (error) {
        console.error("View error:", error)
        alert("Failed to open file. Please try again.")
        return
      }

      window.open(data.publicUrl, "_blank")
    } catch (error) {
      console.error("View error:", error)
      alert("Failed to open file. Please try again.")
    } finally {
      setViewingId(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (mimeType.startsWith("video/")) return <Video className="h-5 w-5" />
    if (mimeType.startsWith("audio/")) return <Music className="h-5 w-5" />
    if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar")) {
      return <Archive className="h-5 w-5" />
    }
    return <FileText className="h-5 w-5" />
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Files Yet</h3>
        <p className="text-muted-foreground">Upload the first file to get started sharing resources.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <Card
          key={file.id}
          className="hover:shadow-md transition-shadow cursor-pointer hover:bg-accent/50"
          onClick={() => handleView(file)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-muted-foreground">{getFileIcon(file.mime_type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground break-words">{file.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(file.file_size)} • Uploaded by{" "}
                    {file.profiles?.full_name || file.profiles?.email || "Unknown"} •
                    {new Date(file.created_at).toLocaleDateString()}
                  </div>
                  {file.description && <div className="text-sm text-muted-foreground mt-1">{file.description}</div>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {file.mime_type.split("/")[0]}
                </Badge>
                <Button variant="ghost" size="sm" disabled={viewingId === file.id}>
                  <Eye className="h-4 w-4" />
                  {viewingId === file.id && <span className="ml-1 text-xs">Opening...</span>}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
