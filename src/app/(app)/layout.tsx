
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
import AppFooter from '@/components/layout/AppFooter';
import { Stethoscope, UserCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobileHook = useIsMobile();

  const mockUser = {
    name: "Usuario Ejemplo",
    role: "Personal",
  };

  // Determine if sidebar should be open by default on desktop
  // For mobile, SidebarProvider's internal logic for Sheet handles it.
  const defaultOpenDesktop = !isMobileHook;

  return (
    <SidebarProvider defaultOpen={defaultOpenDesktop} open={defaultOpenDesktop}>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <div className="flex flex-1">
          <Sidebar
            variant="sidebar"
            collapsible={isMobileHook ? "offcanvas" : "icon"}
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
              <Link href="/login" className="w-full">
                <Button variant="ghost" size="sm" className="w-full justify-start mt-1 group-data-[collapsible=icon]:justify-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2 group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
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
