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
  MessageCircle,
  Book,
  Box,
  History,
  User,
  Chrome
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const isExpanded = state === "expanded";
  const navigate = useNavigate();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="bg-[#222222] border-r border-white/20">
      <SidebarHeader className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center gap-2">
          {isExpanded && <Logo className="h-10 w-auto" textColor="text-white" />}
        </div>
        {!isMobile && <SidebarTrigger />}
      </SidebarHeader>

      <SidebarContent className="bg-[#222222]">
        <SidebarGroup>
          <div className="px-2">
            <Button 
              className="w-full justify-start gap-2 bg-primary hover:bg-primary-light text-white"
              onClick={() => navigate('/dashboard')}
            >
              <Plus size={18} />
              {isExpanded && <span>Add Content</span>}
            </Button>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="History" className="text-white hover:bg-primary/10 hover:text-white">
                  <Link to="/history">
                    <History size={18} />
                    <span>My History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Recent Documents" className="text-white hover:bg-primary/10 hover:text-white">
                  <Link to="/recent">
                    <Clock size={18} />
                    <span>Recent Documents</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">Spaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Azzam's Space" className="text-white hover:bg-primary/10 hover:text-white">
                  <Link to="/spaces/1">
                    <Box size={18} />
                    <span>Azzam's Space</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Untitled Space" className="text-white hover:bg-primary/10 hover:text-white">
                  <Link to="/spaces/2">
                    <Box size={18} />
                    <span>Untitled Space</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Add Space" className="text-white hover:bg-primary/10 hover:text-white border border-dashed border-white/20 rounded-md mt-2">
                  <Link to="/spaces/new">
                    <Plus size={18} />
                    <span>Add Space</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">Help & Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Feedback" className="text-white hover:bg-primary/10 hover:text-white">
                  <Link to="/feedback">
                    <MessageCircle size={18} />
                    <span>Feedback</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Quick Guide" className="text-white hover:bg-primary/10 hover:text-white">
                  <Link to="/help">
                    <Book size={18} />
                    <span>Quick Guide</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Chrome Extension" className="text-white hover:bg-primary/10 hover:text-white">
                  <Link to="/extension">
                    <Chrome size={18} />
                    <span>Chrome Extension</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/20 p-4 bg-[#222222]">
        <div className="flex items-center gap-3 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
            <User size={16} />
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-white">Free Plan</p>
              <p className="truncate text-xs text-gray-400">user@shattara.ai</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
