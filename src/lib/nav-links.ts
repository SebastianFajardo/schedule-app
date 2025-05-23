
import type { NavItem } from "@/types";
import {
  LayoutDashboard,
  Settings,
  CalendarDays,
  CalendarPlus,
  ListChecks, // Icon for appointment list
} from "lucide-react";

export const navLinks: NavItem[] = [
  {
    title: "Panel de Control",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Agendar Cita", 
    href: "/appointments/book",
    icon: CalendarPlus,
  },
  {
    title: "Listado de Citas",
    href: "/appointments",
    icon: ListChecks,
  },
  {
    title: "Configuración (Simulado)",
    href: "/settings-placeholder",
    icon: Settings,
    disabled: true,
  },
];
