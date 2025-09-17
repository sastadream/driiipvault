"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

type EntityType = "college" | "department" | "semester" | "subject" | "file"

interface FavoriteButtonProps {
  entityType: EntityType
  entityId: string
  size?: "sm" | "default"
}

export function FavoriteButton({ entityType, entityId, size = "sm" }: FavoriteButtonProps) {
  const supabase = createClient()
  const [isFav, setIsFav] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        if (mounted) setLoading(false)
        return
      }
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .maybeSingle()
      if (mounted) {
        setIsFav(Boolean(data))
        setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [entityType, entityId, supabase])

  const toggle = async () => {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }
    if (isFav) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, entity_type: entityType, entity_id: entityId })
    }
    setIsFav(!isFav)
    setLoading(false)
  }

  return (
    <Button variant={isFav ? "default" : "outline"} size={size} onClick={toggle} disabled={loading}>
      {isFav ? "★ Favorited" : "☆ Favorite"}
    </Button>
  )
}


