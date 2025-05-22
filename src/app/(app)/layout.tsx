
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
  useSidebar, // Import useSidebar
} from "@/components/ui/sidebar";
import AppSidebarContent from '@/components/layout/AppSidebarContent';
import AppFooter from '@/components/layout/AppFooter';
import { Stethoscope, UserCircle, LogOut, Menu, PanelLeftClose } from 'lucide-react'; // Import Menu, PanelLeftClose
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from "@/lib/utils";

const mockUser = {
  name: "Usuario Ejemplo",
  email: "usuario@ejemplo.com",
  role: "Personal",
};

// Sidebar inicia expandido en escritorio por defecto
const defaultOpenDesktop = true;


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={defaultOpenDesktop}>
      <div className="flex flex-row min-h-screen bg-background"> {/* Main flex direction is ROW */}
        <Sidebar
          variant="sidebar"
          collapsible={"icon"}
          className="border-r border-sidebar-border shadow-md"
        >
          <SidebarHeader className={cn(
            "border-b border-sidebar-border h-16 flex items-center px-2",
            "group-data-[state=expanded]:justify-start",
            "group-data-[state=collapsed]:group-hover:justify-start",
            "group-data-[state=collapsed]:not(group-hover):justify-center"
          )}>
            <Link href="/dashboard" className={cn(
              "flex items-center gap-2",
            )}>
              <Stethoscope className="h-7 w-7 text-sidebar-primary shrink-0" />
              <span className={cn(
                "text-xl font-semibold text-sidebar-foreground truncate",
                "group-data-[state=expanded]:inline", // Show if expanded
                "group-data-[state=collapsed]:hidden",   // Hide if collapsed (default for collapsed)
                "group-data-[state=collapsed]:group-hover:inline" // Show if collapsed AND hovered
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
              "group-data-[state=expanded]:justify-start",
              "group-data-[state=collapsed]:group-hover:justify-start",
              "group-data-[state=collapsed]:not(group-hover):justify-center"
            )}>
              <UserCircle className="h-8 w-8 text-sidebar-foreground shrink-0" />
              <div className={cn(
                "truncate",
                "group-data-[state=expanded]:block",
                "group-data-[state=collapsed]:hidden",
                "group-data-[state=collapsed]:group-hover:block"
              )}>
                <p className="text-sm font-medium text-sidebar-foreground">{mockUser.name}</p>
                <p className="text-xs text-sidebar-foreground/80">{mockUser.role}</p>
              </div>
            </div>
            <Link href="/login" className="w-full block">
              <Button variant="ghost" size="sm" className={cn(
                "w-full mt-1 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "group-data-[state=expanded]:justify-start",
                "group-data-[state=collapsed]:group-hover:justify-start",
                "group-data-[state=collapsed]:not(group-hover):justify-center"
              )}>
                <LogOut className="h-4 w-4 shrink-0" />
                <span className={cn(
                  "ml-2 truncate",
                  "group-data-[state=expanded]:inline",
                  "group-data-[state=collapsed]:hidden",
                  "group-data-[state=collapsed]:group-hover:inline"
                )}>Cerrar Sesión</span>
              </Button>
            </Link>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col overflow-y-auto"> {/* Ensures SidebarInset grows and handles overflow */}
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
