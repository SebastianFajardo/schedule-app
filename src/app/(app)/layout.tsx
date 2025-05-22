
"use client";

import React from 'react';
import AppHeader from "@/components/layout/AppHeader";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  useSidebar, // Import useSidebar
} from "@/components/ui/sidebar";
import AppSidebarContent from '@/components/layout/AppSidebarContent';
import AppFooter from '@/components/layout/AppFooter';
import { Stethoscope, UserCircle, LogOut, Menu, PanelLeftClose } from 'lucide-react'; // Import Menu and PanelLeftClose
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobileHook = useIsMobile();
  // Get sidebar state and toggle function for the desktop pin button
  // Note: We call useSidebar() inside a component that is a child of SidebarProvider.
  // To use it here, we'll wrap the part of the layout that needs it in a small sub-component.

  const mockUser = {
    name: "Usuario Ejemplo",
    email: "usuario@ejemplo.com",
    role: "Personal",
  };

  const defaultOpenDesktop = false;

  // Sub-component to access useSidebar context for the pin button
  const DesktopSidebarHeaderContent = () => {
    const { toggleSidebar, state: sidebarPinnedState } = useSidebar();
    return (
      <SidebarHeader className={cn(
        "border-b border-sidebar-border h-16 flex items-center px-2",
        "justify-between"
      )}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Stethoscope className="h-7 w-7 text-sidebar-primary" />
          <span className={cn(
            "text-xl font-semibold text-sidebar-foreground",
            "group-data-[state=expanded]:inline",
            "group-data-[state=collapsed]:group-hover:inline",
            "group-data-[state=collapsed]:not(group-hover):hidden"
          )}>
            MediSchedule
          </span>
        </Link>
        
        {!isMobileHook && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            title={sidebarPinnedState === 'expanded' ? "Colapsar menú" : "Expandir menú"}
          >
            {sidebarPinnedState === 'expanded' ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">{sidebarPinnedState === 'expanded' ? "Colapsar menú" : "Expandir menú"}</span>
          </Button>
        )}
      </SidebarHeader>
    );
  };


  return (
    <SidebarProvider defaultOpen={isMobileHook ? false : defaultOpenDesktop}>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <div className="flex flex-1">
          <Sidebar
            variant="sidebar"
            collapsible={isMobileHook ? "offcanvas" : "icon"}
            className="border-r border-sidebar-border shadow-md"
          >
            <DesktopSidebarHeaderContent /> {/* Use the sub-component here */}
            <SidebarContent>
              <AppSidebarContent />
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border p-2">
              <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent/30 group-data-[collapsible=icon]:group-data-[state=collapsed]:not(group-hover):justify-center group-data-[state=collapsed]:group-hover:flex group-data-[state=collapsed]:hidden">
                <UserCircle className="h-8 w-8 text-sidebar-foreground" />
                <div className="group-data-[state=collapsed]:group-hover:block group-data-[state=collapsed]:hidden">
                  <p className="text-sm font-medium text-sidebar-foreground">{mockUser.name}</p>
                  <p className="text-xs text-sidebar-foreground/80">{mockUser.role}</p>
                </div>
              </div>
              <div className="hidden items-center gap-2 p-2 rounded-md bg-sidebar-accent/30 group-data-[collapsible=icon]:group-data-[state=collapsed]:not(group-hover):flex group-data-[collapsible=icon]:group-data-[state=collapsed]:not(group-hover):justify-center">
                <UserCircle className="h-8 w-8 text-sidebar-foreground" />
              </div>

              <Link href="/login" className="w-full">
                <Button variant="ghost" size="sm" className="w-full justify-start mt-1 group-data-[collapsible=icon]:group-data-[state=collapsed]:not(group-hover):justify-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2 group-data-[state=collapsed]:group-hover:inline group-data-[state=collapsed]:hidden">Cerrar Sesión</span>
                </Button>
              </Link>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex-1 flex flex-col">
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {children}
            </main>
            <AppFooter />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
