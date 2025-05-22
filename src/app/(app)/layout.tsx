
"use client";

import React from 'react';
import AppHeader from "@/components/layout/AppHeader";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebarContent from '@/components/layout/AppSidebarContent';
import AppFooter from '@/components/layout/AppFooter';
import { Stethoscope, UserCircle, LogOut } from 'lucide-react'; // Removed Menu, PanelLeftClose as they are handled in AppHeader
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";
// Removed useSidebar import here as it's not directly used for toggle in this specific way anymore for DesktopSidebarHeaderContent

const mockUser = {
  name: "Usuario Ejemplo",
  email: "usuario@ejemplo.com",
  role: "Personal",
};

// Sidebar inicia expandido en escritorio por defecto
const defaultOpenDesktop = true; 

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobileHook = useIsMobile();

  return (
    <SidebarProvider defaultOpen={isMobileHook ? false : defaultOpenDesktop}>
      <div className="flex flex-row min-h-screen bg-background"> {/* Main flex direction is ROW */}
        <Sidebar
          variant="sidebar"
          collapsible={"icon"} // Always allow icon collapse for desktop logic
          className="border-r border-sidebar-border shadow-md" 
        >
          <SidebarHeader className={cn(
            "border-b border-sidebar-border h-16 flex items-center px-2",
            "group-data-[state=expanded]:justify-start",
            "group-data-[state=collapsed]:group-hover:justify-start",
            "group-data-[state=collapsed]:not(group-hover):justify-center" 
          )}>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Stethoscope className="h-7 w-7 text-sidebar-primary shrink-0" />
              <span className={cn(
                "text-xl font-semibold text-sidebar-foreground truncate",
                "group-data-[state=expanded]:inline",
                "group-data-[state=collapsed]:group-hover:inline",
                "group-data-[state=collapsed]:not(group-hover):hidden"
              )}>
                MediSchedule
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <AppSidebarContent />
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-2">
            <div className={cn(
              "flex items-center gap-2 p-2 rounded-md bg-sidebar-accent/30",
              "group-data-[state=expanded]:flex",
              "group-data-[state=collapsed]:group-hover:flex",
              "group-data-[state=collapsed]:not(group-hover):justify-center"
            )}>
              <UserCircle className="h-8 w-8 text-sidebar-foreground shrink-0" />
              <div className={cn(
                "truncate",
                "group-data-[state=expanded]:block",
                "group-data-[state=collapsed]:group-hover:block",
                "group-data-[state=collapsed]:not(group-hover):hidden"
              )}>
                <p className="text-sm font-medium text-sidebar-foreground">{mockUser.name}</p>
                <p className="text-xs text-sidebar-foreground/80">{mockUser.role}</p>
              </div>
            </div>
            <Link href="/login" className="w-full">
              <Button variant="ghost" size="sm" className={cn(
                "w-full justify-start mt-1 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "group-data-[state=collapsed]:not(group-hover):justify-center"
              )}>
                <LogOut className="h-4 w-4 shrink-0" />
                <span className={cn(
                  "ml-2 truncate",
                  "group-data-[state=expanded]:inline",
                  "group-data-[state=collapsed]:group-hover:inline",
                  "group-data-[state=collapsed]:not(group-hover):hidden"
                )}>Cerrar Sesión</span>
              </Button>
            </Link>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col overflow-y-auto">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <AppFooter />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
