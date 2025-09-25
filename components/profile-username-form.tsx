"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProfileUsernameForm() {
  const supabase = createClient()
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
        if (mounted && profile?.full_name) setName(profile.full_name)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [supabase])

  const onSave = async () => {
    if (!name.trim()) { alert("Please enter a username"); return }
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { alert("Not signed in"); return }
      const { error } = await supabase.from("profiles").update({ full_name: name.trim() }).eq("id", user.id)
      if (error) throw error
      alert("Username saved")
    } catch (e: any) {
      alert(e?.message || "Failed to save username")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return null

  return (
    <div className="flex gap-2 items-center">
      <Input
        placeholder="Set your username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="max-w-xs"
      />
      <Button onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
    </div>
  )
}


