"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

export function SchedulePickup() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [availableSlots, setAvailableSlots] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const checkAvailableSlots = async () => {
      if (!date) return

      setIsLoading(true)
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      try {
        const { count, error } = await supabase
          .from("pickups")
          .select("*", { count: "exact" })
          .gte("date", startOfDay.toISOString())
          .lte("date", endOfDay.toISOString())

        if (error) throw error

        setAvailableSlots(10 - (count ?? 0)) // Assuming 10 slots per day
      } catch (error) {
        console.error("Error checking available slots:", error)
        setAvailableSlots(null)
        toast({
          title: "Error",
          description: "Unable to check available slots. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAvailableSlots()
  }, [date, toast])

  const handleSchedule = async () => {
    if (!user || !date) return

    setIsLoading(true)
    try {
      // Check if user has already scheduled a pickup this week
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      const { data: existingPickups, error: checkError } = await supabase
        .from("pickups")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startOfWeek.toISOString())
        .lte("date", endOfWeek.toISOString())

      if (checkError) throw checkError

      if (existingPickups && existingPickups.length > 0) {
        toast({
          title: "Pickup already scheduled",
          description: "You can only schedule one pickup per week.",
          variant: "destructive",
        })
        return
      }

      // Schedule the pickup
      const { error: insertError } = await supabase
        .from("pickups")
        .insert({ user_id: user.id, date: date.toISOString(), status: "scheduled" })

      if (insertError) throw insertError

      toast({
        title: "Pickup scheduled",
        description: "Your laundry pickup has been scheduled successfully.",
      })

      // Refresh available slots
      setDate(new Date(date))
    } catch (error) {
      console.error("Error scheduling pickup:", error)
      toast({
        title: "Error",
        description: "Failed to schedule pickup. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
        {isLoading ? (
          <p className="mt-2">Loading available slots...</p>
        ) : availableSlots !== null ? (
          <p className="mt-2">Available slots: {availableSlots}</p>
        ) : (
          <p className="mt-2 text-yellow-600">Unable to fetch available slots</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSchedule} disabled={isLoading || availableSlots === null || availableSlots === 0}>
          {isLoading ? "Processing..." : "Schedule Pickup"}
        </Button>
      </CardFooter>
    </Card>
  )
}

