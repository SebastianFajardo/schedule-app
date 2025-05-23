
import type { NavItem } from "@/types";
import {
  LayoutDashboard,
  Settings,
  CalendarDays,
  CalendarPlus, // Added for booking
} from "lucide-react";

export const navLinks: NavItem[] = [
  {
    title: "Panel de Control",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Agendar Cita", // New link
    href: "/appointments/book",
    icon: CalendarPlus,
  },
  {
    title: "Mis Citas (Simulado)", // Placeholder, no page created for this yet
    href: "/appointments-placeholder",
    icon: CalendarDays,
    disabled: true,
  },
  {
    title: "Configuración (Simulado)", // Placeholder, no page created for this yet
    href: "/settings-placeholder",
    icon: Settings,
    disabled: true,
  },
];
