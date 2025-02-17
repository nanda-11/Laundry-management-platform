"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { Calendar } from "@/components/ui/calendar"
import { ReportIssueForm } from "@/components/report-issue-form"

export default function UserDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [ironing, setIroning] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [availableSlots, setAvailableSlots] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasBookingThisWeek, setHasBookingThisWeek] = useState(false)

  useEffect(() => {
    const checkAvailableSlots = async () => {
      if (!date || !user) return

      setIsLoading(true)
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      try {
        const [{ count }, userBookings] = await Promise.all([
          supabase
            .from("laundry_orders")
            .select("*", { count: "exact" })
            .gte("requested_service_date", startOfDay.toISOString().split("T")[0])
            .lt("requested_service_date", endOfDay.toISOString().split("T")[0]),
          checkUserBookingsThisWeek(user.id, date),
        ])

        setAvailableSlots(200 - (count ?? 0))
        setHasBookingThisWeek(userBookings > 0)
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
  }, [date, user, toast])

  const checkUserBookingsThisWeek = async (userId: string, selectedDate: Date) => {
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const { count, error } = await supabase
      .from("laundry_orders")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .gte("requested_service_date", startOfWeek.toISOString().split("T")[0])
      .lte("requested_service_date", endOfWeek.toISOString().split("T")[0])

    if (error) {
      console.error("Error checking user bookings:", error)
      throw error
    }

    return count ?? 0
  }

  const bookLaundryService = async () => {
    if (!user || !date) return

    setIsLoading(true)
    try {
      if (hasBookingThisWeek) {
        throw new Error("You can only book one slot per week.")
      }

      const { error } = await supabase.from("laundry_orders").insert({
        user_id: user.id,
        status: "pending",
        ironing: ironing,
        created_at: new Date().toISOString(),
        requested_service_date: date.toISOString().split("T")[0],
      })

      if (error) throw error

      toast({
        title: "Booking successful",
        description: "Your laundry service has been booked successfully.",
      })
      setIroning(false)
      setDate(new Date())
      setHasBookingThisWeek(true)
    } catch (error) {
      console.error("Error booking laundry service:", error)
      toast({
        title: "Booking failed",
        description:
          error instanceof Error ? error.message : "There was an error booking your laundry service. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Book Laundry Service</CardTitle>
            <CardDescription>Choose your service options and requested service date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="ironing" checked={ironing} onCheckedChange={setIroning} />
              <Label htmlFor="ironing">Ironing Service</Label>
            </div>
            <div>
              <Label>Requested Service Date</Label>
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border mt-2" />
            </div>
            {isLoading ? (
              <p>Loading available slots...</p>
            ) : availableSlots !== null ? (
              <p>
                Available slots for {date?.toDateString()}: {availableSlots}
              </p>
            ) : (
              <p className="text-yellow-600">Unable to fetch available slots</p>
            )}
            {hasBookingThisWeek && <p className="text-yellow-600">You already have a booking this week.</p>}
          </CardContent>
          <CardFooter>
            <Button
              onClick={bookLaundryService}
              disabled={isLoading || availableSlots === null || availableSlots === 0 || hasBookingThisWeek}
            >
              {isLoading ? "Processing..." : "Book Laundry Service"}
            </Button>
          </CardFooter>
        </Card>

        <ReportIssueForm />
      </div>
    </div>
  )
}

