
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
    <Sidebar variant="sidebar" collapsible="icon" className="bg-card border-r border-border">
      <SidebarHeader className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          {isExpanded && <Logo className="h-10 w-auto" textColor="text-foreground" />}
        </div>
        {!isMobile && <SidebarTrigger />}
      </SidebarHeader>

      <SidebarContent className="bg-card">
        <SidebarGroup>
          <div className="px-2">
            <Button 
              className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => navigate('/dashboard')}
            >
              <Plus size={18} />
              {isExpanded && <span>Add Content</span>}
            </Button>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="History" className="text-foreground hover:bg-accent hover:text-accent-foreground">
                  <Link to="/history">
                    <History size={18} />
                    <span>My History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Recent Documents" className="text-foreground hover:bg-accent hover:text-accent-foreground">
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
          <SidebarGroupLabel className="text-muted-foreground">Rooms</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Azzam's Room" className="text-foreground hover:bg-accent hover:text-accent-foreground">
                  <Link to="/rooms/1">
                    <Box size={18} />
                    <span>Azzam's Room</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Untitled Room" className="text-foreground hover:bg-accent hover:text-accent-foreground">
                  <Link to="/rooms/2">
                    <Box size={18} />
                    <span>Untitled Room</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Add Room" className="text-foreground hover:bg-accent hover:text-accent-foreground border border-dashed border-border rounded-md mt-2">
                  <Link to="/rooms/new">
                    <Plus size={18} />
                    <span>Add Room</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Help & Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Feedback" className="text-foreground hover:bg-accent hover:text-accent-foreground">
                  <Link to="/feedback">
                    <MessageCircle size={18} />
                    <span>Feedback</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Quick Guide" className="text-foreground hover:bg-accent hover:text-accent-foreground">
                  <Link to="/help">
                    <Book size={18} />
                    <span>Quick Guide</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Chrome Extension" className="text-foreground hover:bg-accent hover:text-accent-foreground">
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

      <SidebarFooter className="border-t border-border p-4 bg-card">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User size={16} />
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">Free Plan</p>
              <p className="truncate text-xs text-muted-foreground">user@shattara.ai</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
