"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FileResult {
  id: string
  name: string
  original_name: string
  file_path: string
  url?: string
  mime_type: string
  file_size: number
  created_at: string
  subject: {
    name: string
    semester: {
      name: string
      department: {
        name: string
      }
    }
  }
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<FileResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileResult | null>(null)
  const [selectedFilePublicUrl, setSelectedFilePublicUrl] = useState<string | null>(null)

  const searchFiles = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("files")
        .select(`
          id,
          name,
          original_name,
          file_path,
          url,
          mime_type,
          file_size,
          created_at,
          subject:subjects (
            name,
            semester:semesters (
              name,
              department:departments (
                name
              )
            )
          )
        `)
        .or(`name.ilike.%${searchQuery}%,original_name.ilike.%${searchQuery}%`)
        .order("created_at", { ascending: false })

      if (error) throw error
      setSearchResults(data || [])
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchFiles()
    }
  }

  const openFile = (file: FileResult) => {
    setSelectedFile(file)
    // Prefer stored public URL if present; otherwise compute from storage
    const supabase = createClient()
    const { data } = supabase.storage.from("files").getPublicUrl(file.file_path)
    setSelectedFilePublicUrl(data?.publicUrl ?? file.url ?? null)
  }

  const closeFileViewer = () => {
    setSelectedFile(null)
    setSelectedFilePublicUrl(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          {isOpen ? "✕" : "💬"}
        </Button>
      </div>

      {/* Chatbot Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[500px] bg-white border border-gray-200 rounded-lg shadow-xl">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">🔍 File Search Assistant</CardTitle>
              <p className="text-sm text-gray-600">Search for files across all departments and subjects</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type file name to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={searchFiles} disabled={isSearching || !searchQuery.trim()} size="sm">
                  {isSearching ? "⏳" : "🔍"}
                </Button>
              </div>

              {/* Search Results */}
              <div className="max-h-80 overflow-y-auto space-y-2">
                {searchResults.length > 0 && (
                  <p className="text-sm text-gray-600 font-medium">Found {searchResults.length} file(s)</p>
                )}

                {searchResults.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => openFile(file)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm break-words">{file.original_name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {file.subject.semester.department.name}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {file.subject.semester.name}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {file.subject.name}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" className="ml-2 text-xs">
                        👁️ View
                      </Button>
                    </div>
                  </div>
                ))}

                {searchResults.length === 0 && searchQuery && !isSearching && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No files found matching "{searchQuery}"</p>
                    <p className="text-xs mt-1">Try a different search term</p>
                  </div>
                )}

                {!searchQuery && (
                  <div className="text-center py-8 text-gray-500">
                    <p>💡 Type a file name to start searching</p>
                    <p className="text-xs mt-1">Search across all departments and subjects</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* File Viewer Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="font-semibold break-words">{selectedFile.original_name}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{selectedFile.subject.semester.department.name}</Badge>
                  <Badge variant="outline">{selectedFile.subject.semester.name}</Badge>
                  <Badge variant="outline">{selectedFile.subject.name}</Badge>
                </div>
              </div>
              <Button onClick={closeFileViewer} variant="ghost" size="sm">
                ✕
              </Button>
            </div>
            <div className="p-4 max-h-[calc(90vh-120px)] overflow-auto">
              {selectedFile.mime_type.startsWith("image/") ? (
                <img
                  src={selectedFilePublicUrl || selectedFile.url || "/placeholder.svg"}
                  alt={selectedFile.original_name}
                  className="max-w-full h-auto mx-auto"
                  crossOrigin="anonymous"
                />
              ) : selectedFile.mime_type === "application/pdf" ? (
                <iframe
                  src={selectedFilePublicUrl || selectedFile.url || "about:blank"}
                  className="w-full h-96 border-0"
                  title={selectedFile.original_name}
                />
              ) : selectedFile.mime_type.startsWith("text/") ? (
                <div className="bg-gray-50 p-4 rounded border">
                  <p className="text-sm text-gray-600">Text file preview not available</p>
                  <p className="text-xs text-gray-500 mt-1">File: {selectedFile.original_name}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">📄 {selectedFile.original_name}</p>
                  <p className="text-sm text-gray-500 mt-2">File type: {selectedFile.mime_type}</p>
                  <p className="text-sm text-gray-500">Size: {formatFileSize(selectedFile.file_size)}</p>
                  <p className="text-xs text-gray-400 mt-4">Preview not available for this file type</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
