
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
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
// SheetTitle is not needed here, it's handled by Sidebar component for mobile sheet

const mockUser = {
  name: "Dra. Ana Pérez",
  email: "ana.perez@medischedule.com",
  role: "Personal", 
};

export default function AppHeader() {
  const pathname = usePathname();
  const isMobile = useIsMobile(); 
  const { isMobile: isMobileContext } = useSidebar(); 

  const showSidebarToggle = !pathname.startsWith("/login") && !pathname.startsWith("/register") && pathname !== "/" && mockUser;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        {isMobileContext && showSidebarToggle && (
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Alternar menú de navegación</span>
            </Button>
          </SidebarTrigger>
        )}
         <Link href={mockUser ? "/dashboard" : "/"} className="flex items-center gap-1 sm:gap-2">
           <Stethoscope className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
           <span className="text-lg sm:text-xl font-semibold text-primary">MediSchedule</span>
         </Link>
      </div>

      {mockUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full h-8 w-8 p-0"> {/* Adjusted size */}
              <User className="h-5 w-5" /> {/* Adjusted icon size */}
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
