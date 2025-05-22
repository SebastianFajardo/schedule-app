
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
import { Stethoscope, UserCircle, LogOut } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile'; // This hook can be used if needed elsewhere, but SidebarProvider has its own isMobile.

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // useIsMobile hook from use-mobile.tsx might differ from useSidebar's context if breakpoint is different.
  // It's often better to rely on the Sidebar's context for consistency within its components.
  const isMobileHook = useIsMobile(); // Can be used for logic outside sidebar context if needed.

  const mockUser = {
    name: "Dra. Ana Pérez", // Translated
    role: "Personal", // Translated
  };

  return (
    // defaultOpen for desktop, open for controlled state (desktop). Mobile Sheet is handled internally by Sidebar component + AppHeader's trigger
    <SidebarProvider defaultOpen={!isMobileHook} open={!isMobileHook}>
      <AppHeader />
      <div className="flex min-h-[calc(100vh-4rem)]"> {/* Adjust for header height */}
        {/* The Sidebar component itself handles becoming a Sheet on mobile via context */}
        <Sidebar
          variant="sidebar" 
          collapsible={isMobileHook ? "offcanvas" : "icon"} // "offcanvas" makes it a sheet on mobile, "icon" for desktop
          className="border-r border-sidebar-border shadow-md"
        >
          <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center">
             <Link href="/dashboard" className="flex items-center gap-2 w-full px-2">
                <Stethoscope className="h-7 w-7 text-sidebar-primary" />
                <span className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  MediSchedule
                </span>
              </Link>
          </SidebarHeader>
          <SidebarContent>
            <AppSidebarContent />
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-2">
            <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent/30 group-data-[collapsible=icon]:justify-center">
              <UserCircle className="h-8 w-8 text-sidebar-foreground" />
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-sidebar-foreground">{mockUser.name}</p>
                <p className="text-xs text-sidebar-foreground/80">{mockUser.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start mt-1 group-data-[collapsible=icon]:justify-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
               <LogOut className="h-4 w-4" /> {/* Replaced SVG with Lucide icon */}
              <span className="ml-2 group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 overflow-y-auto">
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
