
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
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"; // Import useSidebar and SidebarTrigger

const mockUser = {
  name: "Dra. Ana Pérez",
  email: "ana.perez@medischedule.com",
  role: "Personal", 
};

export default function AppHeader() {
  const pathname = usePathname();
  const isMobile = useIsMobile(); // From use-mobile hook
  const { isMobile: isMobileContext } = useSidebar(); // From SidebarContext, preferred for sidebar interactions

  const showSidebarToggle = !pathname.startsWith("/login") && !pathname.startsWith("/register") && pathname !== "/";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        {isMobileContext && showSidebarToggle && ( // Use isMobile from context for consistency
          <SidebarTrigger variant="ghost" size="icon" className="shrink-0 h-8 w-8 md:h-7 md:w-7">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Alternar menú de navegación</span>
          </SidebarTrigger>
        )}
         {/* Logo/Title part for desktop, or for mobile when sidebar toggle isn't shown */}
         {(!isMobileContext || !showSidebarToggle) && (
            <Link href={mockUser ? "/dashboard" : "/"} className="flex items-center gap-2">
              <Stethoscope className="h-7 w-7 text-primary" />
              <span className="text-xl font-semibold text-primary">MediSchedule</span>
            </Link>
         )}
         {/* On mobile, when sidebar toggle is shown, title might be redundant if sidebar itself shows it */}
         {isMobileContext && showSidebarToggle && (
           <Link href={mockUser ? "/dashboard" : "/"} className="flex items-center gap-1 sm:gap-2">
             <Stethoscope className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
             <span className="text-lg sm:text-xl font-semibold text-primary">MediSchedule</span>
           </Link>
         )}

      </div>

      {mockUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-6 w-6" />
              <span className="sr-only">Alternar menú de usuario</span>
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
                <span>Configuración</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login"> 
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        pathname !== "/login" && pathname !== "/register" && (
          <Link href="/login">
            <Button>Acceder</Button>
          </Link>
        )
      )}
    </header>
  );
}
