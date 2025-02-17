"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const handleTestLogin = (type: "admin1" | "admin2" | "user1" | "user2" | "user3" | "user4") => {
    const credentials = {
      admin1: { email: "admin1@example.com", password: "Admin1@123" },
      admin2: { email: "admin2@example.com", password: "Admin2@123" },
      user1: { email: "user1@example.com", password: "User1@123" },
      user2: { email: "user2@example.com", password: "User2@123" },
      user3: { email: "user3@example.com", password: "User3@123" },
      user4: { email: "user4@example.com", password: "User4@123" },
    }

    setEmail(credentials[type].email)
    setPassword(credentials[type].password)
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access the laundry service.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Test Accounts Section */}
              <div className="mt-4">
                <Tabs defaultValue="admin">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="admin">Admin Test</TabsTrigger>
                    <TabsTrigger value="user">User Test</TabsTrigger>
                  </TabsList>
                  <TabsContent value="admin">
                    <div className="p-4 border rounded-lg mt-2 space-y-2">
                      <h3 className="font-semibold mb-2">Admin Test Accounts</h3>
                      <div>
                        <p className="text-sm text-muted-foreground">Email: admin1@example.com</p>
                        <p className="text-sm text-muted-foreground mb-2">Password: Admin1@123</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTestLogin("admin1")}
                          className="w-full"
                        >
                          Fill Admin 1 Credentials
                        </Button>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email: admin2@example.com</p>
                        <p className="text-sm text-muted-foreground mb-2">Password: Admin2@123</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTestLogin("admin2")}
                          className="w-full"
                        >
                          Fill Admin 2 Credentials
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="user">
                    <div className="p-4 border rounded-lg mt-2 space-y-2">
                      <h3 className="font-semibold mb-2">User Test Accounts</h3>
                      <div>
                        <p className="text-sm text-muted-foreground">Email: user1@example.com</p>
                        <p className="text-sm text-muted-foreground mb-2">Password: User1@123</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTestLogin("user1")}
                          className="w-full"
                        >
                          Fill User 1 Credentials
                        </Button>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email: user2@example.com</p>
                        <p className="text-sm text-muted-foreground mb-2">Password: User2@123</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTestLogin("user2")}
                          className="w-full"
                        >
                          Fill User 2 Credentials
                        </Button>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email: user3@example.com</p>
                        <p className="text-sm text-muted-foreground mb-2">Password: User3@123</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTestLogin("user3")}
                          className="w-full"
                        >
                          Fill User 3 Credentials
                        </Button>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email: user4@example.com</p>
                        <p className="text-sm text-muted-foreground mb-2">Password: User4@123</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTestLogin("user4")}
                          className="w-full"
                        >
                          Fill User 4 Credentials
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

