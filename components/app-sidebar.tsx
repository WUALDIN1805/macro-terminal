"use client"

import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  Users,
  Settings,
  HelpCircle
} from "lucide-react"
import { AMTLogo, AMTLogoIcon } from "@/components/amt-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const mainNavItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    sublabel: "Weekly Directional Matrix",
    icon: LayoutDashboard,
  },
  {
    id: "cot",
    label: "Pilar I - COT",
    sublabel: "Smart Money Flow",
    icon: Wallet,
  },
  {
    id: "macro",
    label: "Pilar II - Macro",
    sublabel: "Economic Divergence",
    icon: TrendingUp,
  },
  {
    id: "sentiment",
    label: "Pilar III - Sentiment",
    sublabel: "Retail Contrarian",
    icon: Users,
  },
]

const footerNavItems = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help", icon: HelpCircle },
]

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        {isCollapsed ? (
          <AMTLogoIcon className="mx-auto" />
        ) : (
          <AMTLogo />
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider">
            Analysis
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    tooltip={item.label}
                    className={`
                      transition-colors
                      ${activeTab === item.id 
                        ? "bg-sidebar-accent text-buy" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-[10px] text-muted-foreground">{item.sublabel}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {footerNavItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                tooltip={item.label}
                className="text-muted-foreground hover:text-sidebar-foreground"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {!isCollapsed && (
          <div className="px-4 py-2 text-center">
            <p className="text-[9px] text-muted-foreground">
              Creadores: Wualdin Salas & Alexis Martinez
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
