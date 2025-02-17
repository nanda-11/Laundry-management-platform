import { Home, Calendar, MessageSquare, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth-provider"

const userMenuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Schedule Pickup", icon: Calendar, url: "/schedule" },
  { title: "Report Issue", icon: MessageSquare, url: "/report" },
  { title: "Settings", icon: Settings, url: "/settings" },
]

const adminMenuItems = [
  { title: "Dashboard", icon: Home, url: "/admin" },
  { title: "Manage Requests", icon: Calendar, url: "/admin/requests" },
  { title: "View Reports", icon: MessageSquare, url: "/admin/reports" },
  { title: "Settings", icon: Settings, url: "/admin/settings" },
]

export function AppSidebar() {
  const { user, logout, isAdmin } = useAuth()
  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Laundry Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

