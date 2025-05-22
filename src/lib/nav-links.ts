
import type { NavItem } from "@/types";
import {
  LayoutDashboard,
  Settings,
  CalendarDays
} from "lucide-react";

export const navLinks: NavItem[] = [
  {
    title: "Panel de Control",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Citas (Simulado)",
    href: "/appointments-placeholder", // Placeholder, no page created for this yet
    icon: CalendarDays,
    disabled: true,
  },
  {
    title: "Configuración (Simulado)",
    href: "/settings-placeholder", // Placeholder, no page created for this yet
    icon: Settings,
    disabled: true,
  },
];
