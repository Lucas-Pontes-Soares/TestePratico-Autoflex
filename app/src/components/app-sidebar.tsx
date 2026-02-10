"use client"

import * as React from "react"
import { useEffect, useState } from "react" // Added useEffect, useState
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
  User, // Added User icon for default avatar
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
import { useLocation, useNavigate } from "react-router-dom"
import { getLoggedUserId } from "@/lib/userLogged"
import { api } from "@/lib/axios" 
import { toast } from "sonner"
import { Spinner } from "./ui/spinner"

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const data = {
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
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      const userId = getLoggedUserId();
      if (!userId) {
        navigate("/login");
        setLoadingUser(false);
        return;
      }

      try {
        setLoadingUser(true);
        const response = await api.get(`/user/${userId}`);
        if (response.data.data && response.data.data.length > 0) {
          setCurrentUser(response.data.data[0]);
        } else {
          toast.error("Dados do usuário não encontrados.");
          navigate("/login");
        }
      } catch (error) {
        toast.error("Erro ao carregar dados do usuário.");
        console.error("Failed to fetch user data:", error);
        navigate("/login");
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUserData();
  }, [navigate]);

  const userToDisplay = currentUser || {
    name: "Usuário",
    email: "carregando...",
    avatar: "",
  };

  if (loadingUser) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-center p-4">
            <Spinner className="animate-spin text-muted-foreground" />
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userToDisplay} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
