"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"

export function Navigation() {
  const { user, isAdmin, logout } = useAuth()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Laundry Management
        </Link>
        <div>
          {user ? (
            <>
              <Link href={isAdmin ? "/admin" : "/user"} className="mr-4">
                Dashboard
              </Link>
              <Button onClick={logout} variant="ghost">
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

