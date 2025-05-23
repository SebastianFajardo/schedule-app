
"use client";

import Link from "next/link";
import { Stethoscope, User, LogOut, Settings, Menu, PanelLeftClose } from "lucide-react";
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
import { SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const mockUser = {
  name: "Usuario Ejemplo",
  email: "usuario@ejemplo.com",
};

// Componente para el botón de control del sidebar en escritorio
const DesktopSidebarToggleButton = () => {
  const { toggleSidebar, state: sidebarPinnedState, isMobile: isSidebarContextMobile } = useSidebar();

  if (isSidebarContextMobile) return null; // No renderizar en móvil

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="text-foreground hover:bg-accent hover:text-accent-foreground h-9 w-9"
      title={sidebarPinnedState === 'expanded' ? "Colapsar menú" : "Expandir menú"}
    >
      {sidebarPinnedState === 'expanded' ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      <span className="sr-only">{sidebarPinnedState === 'expanded' ? "Colapsar menú" : "Expandir menú"}</span>
    </Button>
  );
};


export default function AppHeader() {
  const isMobileHook = useIsMobile();

  return (
    <header className="sticky top-0 z-30 flex h-24 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 shadow-sm"> {/* Altura aumentada a h-24 */}
      <div className="flex items-center gap-2">
        {/* Botón de control del Sidebar para escritorio */}
        <DesktopSidebarToggleButton />

        {/* Botón de trigger del Sidebar para móvil */}
        {isMobileHook && (
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9"> {/* Mantenemos tamaño de botón móvil */}
              <Menu className="h-5 w-5" />
              <span className="sr-only">Alternar menú de navegación</span>
            </Button>
          </SidebarTrigger>
        )}
         <Link href="/" className="flex items-center gap-1 sm:gap-2">
           <Stethoscope className="h-8 w-8 sm:h-9 sm:w-9 text-primary" /> {/* Icono ligeramente más grande */}
           <span className="text-2xl sm:text-3xl font-semibold text-primary hidden sm:inline">MediSchedule</span> {/* Texto ligeramente más grande */}
         </Link>
      </div>

      {mockUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full h-9 w-9 p-0"> {/* Mantenemos tamaño de botón de usuario */}
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
          <Link href="/login">
            <Button>Acceder</Button>
          </Link>
      )}
    </header>
  );
}
