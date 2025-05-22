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
} from "@/components/ui/sidebar";
import AppSidebarContent from '@/components/layout/AppSidebarContent';
import { Stethoscope, UserCircle } from 'lucide-react'; // UserCircle for footer
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  // Mock user data for sidebar footer example
  const mockUser = {
    name: "Dr. Emily Carter",
    role: "Staff",
  };

  return (
    <SidebarProvider defaultOpen={!isMobile} open={!isMobile}>
      <AppHeader />
      <div className="flex min-h-[calc(100vh-4rem)]"> {/* Adjust for header height */}
        <Sidebar
          variant="sidebar" // "sidebar", "floating", "inset"
          collapsible={isMobile ? "offcanvas" : "icon"} // "offcanvas", "icon", "none"
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
               {/* LogOut Icon */}
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              <span className="ml-2 group-data-[collapsible=icon]:hidden">Logout</span>
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
