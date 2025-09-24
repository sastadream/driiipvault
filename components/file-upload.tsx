"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

interface FileUploadProps {
  subjectId: string
}

export function FileUpload({ subjectId }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB")
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    const supabase = createClient()

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Generate unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${subjectId}/${fileName}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage.from("files").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) throw uploadError

      setUploadProgress(50)

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage.from("files").getPublicUrl(uploadData.path)

      // Save file metadata to database
      const { error: dbError } = await supabase.from("files").insert({
        subject_id: subjectId,
        name: file.name.split(".").slice(0, -1).join(".") || file.name,
        original_name: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        mime_type: file.type,
        url: urlData.publicUrl,
        description: description.trim() || null,
        uploaded_by: user.id,
      })

      if (dbError) throw dbError

      setUploadProgress(100)

      // Show success popup
      alert("Thank you for uploading the file!")

      // Reset form
      setFile(null)
      setDescription("")
      setUploadProgress(0)

      // Refresh the page to show new file
      router.refresh()
    } catch (error) {
      console.error("Upload error:", error)
      setError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="file">Select File</Label>
        <Input id="file" type="file" onChange={handleFileChange} disabled={uploading} className="cursor-pointer" />
        {file && (
          <div className="text-sm text-muted-foreground">
            Selected: {file.name} ({formatFileSize(file.size)})
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add a description for this file..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={uploading}
          rows={3}
        />
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}

      <Button type="submit" disabled={!file || uploading} className="w-full">
        {uploading ? "Uploading..." : "Upload File"}
      </Button>
    </form>
  )
}
