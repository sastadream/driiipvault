"use client"

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  fileId: string
}

export default function FileActionsMenu({ fileId }: Props) {
  const supabase = createClient()
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [rating, setRating] = useState<number>(5)
  const [text, setText] = useState<string>("")
  const [reviewsOpen, setReviewsOpen] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])

  const onReview = async () => {
    if (busy) return
    try {
      setBusy(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { alert("Please log in to review."); return }
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
      if (!profile?.full_name) { alert("Please set your username in your Profile before reviewing."); return }
      const { error } = await supabase.from("file_reviews").insert({
        file_id: fileId,
        rating,
        review_text: text || null,
        user_id: user.id,
      })
      if (error) throw error
      alert("Thank you for your review!")
    } catch (e: any) {
      alert(e?.message || "Failed to submit review")
    } finally {
      setBusy(false)
      setReviewOpen(false)
      setOpen(false)
      setText("")
    }
  }

  const onReport = async () => {
    if (busy) return
    try {
      setBusy(true)
      const { data: { user } } = await supabase.auth.getUser()
      const reason = prompt("Describe the issue with this file:", "Wrong/Incomplete/Corrupt file")
      if (!reason) return
      const { error } = await supabase.from("file_reports").insert({
        file_id: fileId,
        reason,
        user_id: user?.id || null,
      })
      if (error) throw error
      alert("Thanks for the report. We'll review and fix it soon!")
    } catch (e: any) {
      alert(e?.message || "Failed to submit report")
    } finally {
      setBusy(false)
      setOpen(false)
    }
  }

  return (
    <div className="relative inline-block">
      <Button variant="outline" size="sm" disabled={busy} onClick={() => setOpen((v) => !v)}>
        More
      </Button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-56 rounded border bg-white p-1 shadow">
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => { setReviewOpen(true) }}>Write a review</button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={onReport}>Report file</button>
          <button
            className="w-full text-left px-3 py-2 hover:bg-gray-100"
            onClick={async () => {
              setReviewsOpen((v) => !v)
              if (!reviewsOpen && reviews.length === 0) {
                setReviewsLoading(true)
                try {
                  const { data: revs } = await supabase
                    .from("file_reviews")
                    .select("rating, review_text, user_id, created_at")
                    .eq("file_id", fileId)
                    .order("created_at", { ascending: false })
                  let rows = revs || []
                  const ids = Array.from(new Set(rows.map((r:any)=>r.user_id).filter(Boolean)))
                  let nameMap: Record<string,string> = {}
                  if (ids.length > 0) {
                    const { data: profs } = await supabase
                      .from("profiles")
                      .select("id, full_name")
                      .in("id", ids)
                    ;(profs||[]).forEach((p:any)=>{ nameMap[p.id]=p.full_name })
                  }
                  rows = rows.map((r:any)=>({ ...r, profile_name: nameMap[r.user_id] || "Anonymous" }))
                  setReviews(rows)
                } finally {
                  setReviewsLoading(false)
                }
              }
            }}
          >
            Reviews
          </button>
        </div>
      )}
      {reviewOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded border bg-white p-3 shadow space-y-2">
          <div className="text-sm font-medium">Rate this file</div>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={"text-xl " + (n <= rating ? "text-yellow-600" : "text-gray-300")}
                aria-label={`Set rating ${n}`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">{rating} star{rating>1?"s":""}</span>
          </div>
          <div className="text-sm font-medium">Write a review (optional)</div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full border rounded p-2 text-sm"
            placeholder="Your thoughts about this file"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => { setReviewOpen(false); setText("") }}>Cancel</Button>
            <Button size="sm" onClick={onReview} disabled={busy}>Submit</Button>
          </div>
        </div>
      )}
      {reviewsOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-h-80 overflow-auto rounded border bg-white p-3 shadow space-y-2">
          <div className="text-sm font-medium">Reviews</div>
          {reviewsLoading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : reviews.length === 0 ? (
            <div className="text-sm text-gray-600">No reviews yet.</div>
          ) : (
            <div className="space-y-2">
              {reviews.map((r, idx) => (
                <div key={idx} className="text-sm">
                  <span className="text-yellow-600">{"★".repeat(r.rating)}</span>
                  <span className="ml-2 font-medium">{r.profile_name || "Anonymous"}</span>
                  {r.review_text && <div className="text-gray-700 mt-1">{r.review_text}</div>}
                  <div className="text-xs text-gray-500 mt-0.5">{new Date(r.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


