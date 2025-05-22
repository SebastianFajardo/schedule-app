
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
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { SheetTitle } from "@/components/ui/sheet"; // Import SheetTitle

const mockUser = {
  name: "Usuario Ejemplo",
  email: "usuario@example.com",
};

export default function AppHeader() {
  const { isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        {isMobile && (
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9"> {/* Consistent size */}
              <Menu className="h-5 w-5" />
              <span className="sr-only">Alternar menú de navegación</span>
            </Button>
          </SidebarTrigger>
        )}
         <Link href="/" className="flex items-center gap-1 sm:gap-2">
           <Stethoscope className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
           <span className="text-lg sm:text-xl font-semibold text-primary">MediSchedule</span>
         </Link>
      </div>

      {mockUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full h-9 w-9 p-0"> {/* Consistent size */}
              <User className="h-5 w-5" />
              <span className="sr-only">Alternar menú de usuario</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-medium">{mockUser.name}</div>
              <div className="text-xs text-muted-foreground">{mockUser.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración (Simulado)</span>
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
          <Link href="/login">
            <Button>Acceder</Button>
          </Link>
      )}
    </header>
  );
}
