"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

interface Props {
  semester: string
  subject: string
}

export default function BookUpload({ semester, subject }: Props) {
  const supabase = createClient()
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB")
      return
    }
    setFile(f)
    setError(null)
  }

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setUploading(true)
      setUploadProgress(10)
      setError(null)

      const pathPrefix = `books/${encodeURIComponent(semester)}/${encodeURIComponent(subject)}`
      const fileExt = file.name.split('.').pop()
      const storageName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
      const filePath = `${pathPrefix}/${storageName}`

      const { data: up, error: upErr } = await supabase.storage.from("files").upload(filePath, file, { upsert: false })
      if (upErr) throw upErr

      setUploadProgress(60)

      const { data: pub } = await supabase.storage.from("files").getPublicUrl(filePath)

      const { error: dbErr } = await supabase.from("books_files").insert({
        semester,
        subject,
        name: file.name.split('.').slice(0, -1).join('.') || file.name,
        original_name: file.name,
        file_path: up.path,
        file_size: file.size,
        mime_type: file.type,
        description: description.trim() || null,
      })
      if (dbErr) throw dbErr

      setUploadProgress(100)
      setFile(null)
      setDescription("")
      setUploadProgress(0)
      window.location.reload()
    } catch (err: any) {
      setError(err?.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={onUpload} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="file">Select File</Label>
        <Input id="file" type="file" onChange={onFileChange} disabled={uploading} className="cursor-pointer" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="desc">Description (optional)</Label>
        <Textarea id="desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={uploading} />
      </div>
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span>Uploading...</span><span>{uploadProgress}%</span></div>
          <Progress value={uploadProgress} />
        </div>
      )}
      {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}
      <Button type="submit" disabled={!file || uploading} className="w-full">{uploading ? "Uploading..." : "Upload File"}</Button>
    </form>
  )
}


