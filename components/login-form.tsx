"use client"

import { useAuth } from "@/hooks/use-auth"
import { useSearchParams, useRouter } from "next/navigation"
import React, { useState } from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

export function LoginForm() {
  const { login } = useAuth()
  const search = useSearchParams()
  const router = useRouter()
  const next = search.get("next") || "/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      router.replace(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">Farm Management</CardTitle>
                  <CardDescription>Sign in to manage your farms</CardDescription>
              </CardHeader>
              <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              disabled={loading}
                          />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                              id="password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              disabled={loading}
                          />
                      </div>
                      {error && <div className="text-destructive text-sm">{error}</div>}
                      <Button type="submit" className="w-full" disabled={loading}>
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Sign In
                      </Button>
                  </form>
              </CardContent>
          </Card>
      </div>
  )
}
