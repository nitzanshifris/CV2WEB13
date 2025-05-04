"use client"

import type React from "react"

import { useState } from "react"
import { useSupabase } from "@/components/session-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NeomorphButton } from "@/components/neomorphism/button"
import { Upload, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

interface ProfileImageUploaderProps {
  avatarUrl: string | null
  name: string | null
  onUploadComplete: (url: string) => void
}

export function ProfileImageUploader({ avatarUrl, name, onUploadComplete }: ProfileImageUploaderProps) {
  const { user } = useSupabase()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadProfileImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true)
      setError(null)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("יש לבחור קובץ")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const filePath = `${user?.id}/${uuidv4()}.${fileExt}`

      // העלאת הקובץ ל-Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("profile_images")
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      // קבלת URL ציבורי לקובץ
      const { data } = supabase.storage.from("profile_images").getPublicUrl(filePath)

      // עדכון טבלת המשתמשים עם ה-URL החדש
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user?.id)

      if (updateError) {
        throw updateError
      }

      onUploadComplete(data.publicUrl)
    } catch (error) {
      console.error("Error uploading profile image:", error)
      setError("העלאת התמונה נכשלה. אנא נסה שוב.")
    } finally {
      setIsUploading(false)
    }
  }

  const removeProfileImage = async () => {
    try {
      setIsUploading(true)
      setError(null)

      if (!avatarUrl) return

      // קבלת שם הקובץ מה-URL
      const filePathMatch = avatarUrl.match(/profile_images\/(.+)/)
      if (!filePathMatch) return

      const filePath = filePathMatch[1]

      // מחיקת הקובץ מ-Storage
      const { error: deleteError } = await supabase.storage.from("profile_images").remove([filePath])

      if (deleteError) {
        throw deleteError
      }

      // עדכון טבלת המשתמשים
      const { error: updateError } = await supabase.from("users").update({ avatar_url: null }).eq("id", user?.id)

      if (updateError) {
        throw updateError
      }

      onUploadComplete("")
    } catch (error) {
      console.error("Error removing profile image:", error)
      setError("הסרת התמונה נכשלה. אנא נסה שוב.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="neomorphism-icon h-24 w-24 p-1">
          <Avatar className="h-full w-full">
            <AvatarImage src={avatarUrl || ""} alt={name || "משתמש"} />
            <AvatarFallback className="bg-primary/10">{name?.charAt(0) || "מ"}</AvatarFallback>
          </Avatar>
        </div>
        {avatarUrl && (
          <button
            onClick={removeProfileImage}
            className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="profile-image-upload">
          <NeomorphButton
            type="button"
            variant="secondary"
            size="sm"
            className="cursor-pointer"
            isLoading={isUploading}
            loadingText="מעלה..."
            disabled={isUploading}
          >
            {!isUploading && <Upload className="mr-2 h-4 w-4" />}
            {avatarUrl ? "החלף תמונה" : "העלה תמונה"}
          </NeomorphButton>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            onChange={uploadProfileImage}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
