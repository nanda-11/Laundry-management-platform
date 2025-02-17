"use client"

import { Button } from "@/components/ui/button"
import { subscribeToNotifications } from "@/lib/notifications"

export function NotificationButton() {
  return <Button onClick={subscribeToNotifications}>Subscribe to Notifications</Button>
}

