
import type { NavItem } from "@/types";
import {
  LayoutDashboard,
  Settings,
  ListChecks, // Icon for appointment list
} from "lucide-react";

export const navLinks: NavItem[] = [
  {
    title: "Panel de Control",
    href: "/dashboard",
    icon: LayoutDashboard,
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
