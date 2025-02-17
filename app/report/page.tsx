"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

export default function ReportIssue() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const { error } = await supabase.from("issues").insert({
      user_id: user.id,
      title,
      description,
      status: "open",
      created_at: new Date().toISOString(),
    })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to report issue. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Issue reported",
        description: "Your issue has been reported successfully.",
      })
      setTitle("")
      setDescription("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Issue</CardTitle>
        <CardDescription>Report any issues with your laundry</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide more details about the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Submit Report</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

