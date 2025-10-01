"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const search = useSearchParams()
  const router = useRouter()
  const next = search.get("next") || "/dashboard"

  useEffect(() => {
    if (!loading && user) {
      router.replace(next)
    }
  }, [loading, user, next, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return <LoginForm />
}