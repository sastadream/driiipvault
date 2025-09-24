"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

interface Props {
  table: "files" | "books_files"
  id: string
  filePath: string
}

export default function DeleteFileButton({ table, id, filePath }: Props) {
  const [loading, setLoading] = useState(false)
  const [canDelete, setCanDelete] = useState<boolean | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          if (!cancelled) setCanDelete(false)
          return
        }
        const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle()
        if (!cancelled) setCanDelete(!!data)
      } catch {
        if (!cancelled) setCanDelete(false)
      }
    })()
    return () => { cancelled = true }
  }, [supabase])

  const onDelete = async () => {
    if (!confirm("Delete this file? This cannot be undone.")) return
    setLoading(true)
    try {
      const { error: sErr } = await supabase.storage.from("files").remove([filePath])
      if (sErr) throw sErr

      const { error: dErr } = await supabase.from(table).delete().eq("id", id)
      if (dErr) throw dErr

      alert("File deleted.")
      if (typeof window !== "undefined") {
        window.location.reload()
      }
    } catch (e: any) {
      alert(e?.message || "Delete failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    canDelete ? (
      <Button variant="destructive" size="sm" onClick={onDelete} disabled={loading}>
      {loading ? "Deleting..." : "Delete"}
      </Button>
    ) : null
  )
}


