"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase, type LaundryBag } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

export default function ManageRequests() {
  const [laundryBags, setLaundryBags] = useState<LaundryBag[]>([])
  const { isAdmin } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchLaundryBags = async () => {
      if (!isAdmin) return

      const { data, error } = await supabase.from("laundry_bags").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching laundry bags:", error)
        return
      }

      setLaundryBags(data as LaundryBag[])
    }

    fetchLaundryBags()
  }, [isAdmin])

  const updateBagStatus = async (bagId: string, newStatus: "washed" | "ready") => {
    const { error } = await supabase.from("laundry_bags").update({ status: newStatus }).eq("id", bagId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update laundry bag status. Please try again.",
        variant: "destructive",
      })
    } else {
      setLaundryBags((bags) => bags.map((bag) => (bag.id === bagId ? { ...bag, status: newStatus } : bag)))
      toast({
        title: "Status updated",
        description: `Laundry bag status updated to ${newStatus}.`,
      })
    }
  }

  if (!isAdmin) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Laundry Requests</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {laundryBags.map((bag) => (
            <TableRow key={bag.id}>
              <TableCell>{bag.user_id}</TableCell>
              <TableCell>{bag.status}</TableCell>
              <TableCell>{new Date(bag.created_at).toLocaleString()}</TableCell>
              <TableCell>
                {bag.status === "pending" && (
                  <Button onClick={() => updateBagStatus(bag.id, "washed")}>Mark as Washed</Button>
                )}
                {bag.status === "washed" && (
                  <Button onClick={() => updateBagStatus(bag.id, "ready")}>Mark as Ready</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

