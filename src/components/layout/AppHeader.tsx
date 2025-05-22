"use client";

import Link from "next/link";
import { Stethoscope, User, LogOut, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AppSidebarContent from "./AppSidebarContent"; // Import sidebar content for mobile sheet
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock user data - replace with actual auth context
const mockUser = {
  name: "Dr. Emily Carter",
  email: "emily.carter@medischedule.com",
  role: "staff", // 'patient' or 'staff'
};
// const mockUser = null; // Test logged out state

export default function AppHeader() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // A simple way to determine if the sidebar should be available
  const showSidebarToggle = !pathname.startsWith("/login") && !pathname.startsWith("/register") && pathname !== "/";


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        {isMobile && showSidebarToggle && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-72 bg-sidebar text-sidebar-foreground">
              {/* Sidebar content for mobile */}
              <div className="flex items-center gap-2 border-b border-sidebar-border p-4">
                <Stethoscope className="h-7 w-7 text-sidebar-primary" />
                <span className="text-xl font-semibold text-sidebar-foreground">MediSchedule</span>
              </div>
              <AppSidebarContent />
            </SheetContent>
          </Sheet>
        )}
         {!isMobile && (
            <Link href={mockUser ? "/dashboard" : "/"} className="flex items-center gap-2">
              <Stethoscope className="h-7 w-7 text-primary" />
              <span className="text-xl font-semibold text-primary">MediSchedule</span>
            </Link>
         )}
      </div>

      {mockUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-6 w-6" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-medium">{mockUser.name}</div>
              <div className="text-xs text-muted-foreground">{mockUser.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login"> {/* Replace with actual logout logic */}
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        pathname !== "/login" && pathname !== "/register" && (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )
      )}
    </header>
  );
}
