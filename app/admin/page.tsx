"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface LaundryOrder {
  id: string
  user_id: string
  status: "pending" | "in_progress" | "completed"
  ironing: boolean
  created_at: string
  requested_service_date: string
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<LaundryOrder[]>([])
  const { isAdmin } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAdmin) return

      const { data, error } = await supabase
        .from("laundry_orders")
        .select("*")
        .order("requested_service_date", { ascending: false })

      if (error) {
        console.error("Error fetching laundry orders:", error)
        return
      }

      setOrders(data as LaundryOrder[])
    }

    fetchOrders()
  }, [isAdmin])

  const updateOrderStatus = async (orderId: string, newStatus: LaundryOrder["status"]) => {
    try {
      const { error } = await supabase.from("laundry_orders").update({ status: newStatus }).eq("id", orderId)

      if (error) throw error

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
      )

      toast({
        title: "Status updated",
        description: `Order status updated to ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  }

  if (!isAdmin) return null

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ironing</TableHead>
            <TableHead>Requested Service Date</TableHead>
            <TableHead>Week Number</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const serviceDate = new Date(order.requested_service_date)
            const weekNumber = getWeekNumber(serviceDate)
            return (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user_id}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.ironing ? "Yes" : "No"}</TableCell>
                <TableCell>{order.requested_service_date}</TableCell>
                <TableCell>{weekNumber}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  {order.status === "pending" && (
                    <Button onClick={() => updateOrderStatus(order.id, "in_progress")}>Start Processing</Button>
                  )}
                  {order.status === "in_progress" && (
                    <Button onClick={() => updateOrderStatus(order.id, "completed")}>Mark as Completed</Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

