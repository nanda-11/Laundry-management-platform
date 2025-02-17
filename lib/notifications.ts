export async function subscribeToNotifications() {
  if (!("Notification" in window)) {
    console.error("This browser does not support notifications")
    return
  }

  const permission = await Notification.requestPermission()

  if (permission !== "granted") {
    console.error("Notification permission not granted")
    return
  }

  const registration = await navigator.serviceWorker.ready

  // You would typically send this subscription to your server
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
  })

  console.log("Subscribed to push notifications:", subscription)

  // Here you would send the subscription to your server
  // await sendSubscriptionToServer(subscription);
}

export function showNotification(title: string, options?: NotificationOptions) {
  if (!("Notification" in window)) {
    console.error("This browser does not support notifications")
    return
  }

  if (Notification.permission === "granted") {
    new Notification(title, options)
  } else {
    console.error("Notification permission not granted")
  }
}

