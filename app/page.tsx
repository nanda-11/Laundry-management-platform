"use client"

import { useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push(isAdmin ? "/admin" : "/user")
    }
  }, [user, isAdmin, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to Laundry Management System</h1>
      <p className="text-xl mb-8">Efficient laundry service for students</p>
      <Link href="/login">
        <Button>Get Started</Button>
      </Link>
    </div>
  )
}

