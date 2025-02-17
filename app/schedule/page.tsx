"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

export default function SchedulePickup() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSchedule = async () => {
    if (!user || !date) return

    // Check if user has already scheduled a pickup this week
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const { data: existingPickups } = await supabase
      .from("pickups")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", startOfWeek.toISOString())
      .lte("date", endOfWeek.toISOString())

    if (existingPickups && existingPickups.length > 0) {
      toast({
        title: "Pickup already scheduled",
        description: "You can only schedule one pickup per week.",
        variant: "destructive",
      })
      return
    }

    // Schedule the pickup
    const { error } = await supabase
      .from("pickups")
      .insert({ user_id: user.id, date: date.toISOString(), status: "scheduled" })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to schedule pickup. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Pickup scheduled",
        description: "Your laundry pickup has been scheduled successfully.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Pickup</CardTitle>
        <CardDescription>Choose a date for your laundry pickup</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSchedule}>Schedule Pickup</Button>
      </CardFooter>
    </Card>
  )
}

