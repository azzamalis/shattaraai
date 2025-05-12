
import React from 'react';
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
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { 
  BookOpen, 
  Clock, 
  FolderOpen, 
  HelpCircle, 
  Home, 
  Plus, 
  Search, 
  Settings, 
  User 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {isExpanded && <Logo className="h-8" textColor="text-white" />}
        </div>
        {!isMobile && <SidebarTrigger />}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="px-2">
            <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary-light text-white">
              <Plus size={18} />
              {isExpanded && <span>Add Content</span>}
            </Button>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link to="/dashboard">
                    <Home size={18} />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="History">
                  <Link to="/history">
                    <Clock size={18} />
                    <span>History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Spaces">
                  <Link to="/spaces">
                    <FolderOpen size={18} />
                    <span>Spaces</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Help & Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Help">
                  <Link to="/help">
                    <HelpCircle size={18} />
                    <span>Help Center</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link to="/settings">
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
            <User size={16} />
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium">Account</p>
              <p className="truncate text-xs text-gray-400">user@shattara.ai</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
