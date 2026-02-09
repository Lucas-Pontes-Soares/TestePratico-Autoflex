"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Box,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Stone,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useLocation } from "react-router"

const data = {
  user: {
    name: "lucas",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "AutoFlex",
      logo: Box,
      plan: "Empresa",
    }
  ],
  navMain: [
    {
      title: "Produtos",
      url: "/products",
      icon: Box,
    },
    {
      title: "Materias Primas",
      url: "/raw-materials",
      icon: Stone,
    },
    {
      title: "Dashboard Produção",
      url: "/production-dashboard",
      icon: PieChart,
    }
  ]
}

export function AppSidebar({ ...props}: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
