import React, { useEffect } from 'react';
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
  Chrome,
  ChevronsLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AppSidebar() {
  const { state, isMobile, setOpen } = useSidebar();
  const isExpanded = state === "expanded";

  // Debug logging for sidebar state changes
  useEffect(() => {
    console.log("Sidebar state in AppSidebar:", state, "isMobile:", isMobile);
  }, [state, isMobile]);
  
  // For mobile devices, we use a different approach (Sheet/Drawer)
  if (isMobile) {
    return (
      <Sidebar 
        variant="sidebar" 
        collapsible="offcanvas"
        className="bg-[#222222] border-r border-white/20"
      >
        <SidebarHeader className="bg-[#222222] border-b border-white/20">
          <div className="flex items-center justify-between h-16 px-4">
            {isExpanded && <Logo className="h-10 w-auto" textColor="text-white" />}
            
            {isExpanded && (
              <Button
                onClick={() => {
                  console.log("Closing sidebar from button, current state:", state);
                  setOpen(false);
                }}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                aria-label="Collapse sidebar"
              >
                <ChevronsLeft size={20} />
                <span className="sr-only">Collapse sidebar</span>
              </Button>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-[#222222]">
          <SidebarGroup>
            <div className="px-2">
              <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary-light text-white">
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

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="offcanvas"
      className="bg-[#222222] border-r border-white/20 transition-all duration-300"
    >
      <SidebarHeader className="bg-[#222222] border-b border-white/20">
        <div className="flex items-center justify-between h-16 px-4">
          {isExpanded && <Logo className="h-10 w-auto" textColor="text-white" />}
          
          {isExpanded && (
            <Button
              onClick={() => {
                console.log("Closing sidebar from button, current state:", state);
                setOpen(false);
              }}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
              aria-label="Collapse sidebar"
            >
              <ChevronsLeft size={20} />
              <span className="sr-only">Collapse sidebar</span>
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#222222]">
        <SidebarGroup>
          <div className="px-2">
            <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary-light text-white">
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
