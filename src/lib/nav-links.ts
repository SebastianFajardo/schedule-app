import type { NavItem } from "@/types";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  BellRing,
  History,
  Clock,
  Settings,
  Users,
  BriefcaseMedical
} from "lucide-react";

export const navLinks: NavItem[] = [
  {
    title: "Panel de Control",
    href: "/dashboard",
    icon: LayoutDashboard,
    role: 'staff', 
  },
  {
    title: "Mis Citas",
    href: "/appointments",
    icon: CalendarDays,
    role: 'patient',
  },
  {
    title: "Citas",
    href: "/appointments",
    icon: CalendarDays,
    label: "Gestionar",
    role: 'staff',
  },
  {
    title: "Agendar Cita",
    href: "/appointments/book", 
    icon: CalendarPlus,
    role: 'patient',
  },
  {
    title: "Nueva Cita",
    href: "/appointments/new", 
    icon: CalendarPlus,
    role: 'staff',
  },
  {
    title: "Calendario Disponibilidad",
    href: "/appointments/calendar",
    icon: CalendarDays, 
    role: 'staff',
  },
  {
    title: "Recordatorios IA",
    href: "/reminders",
    icon: BellRing,
    role: 'staff',
  },
  {
    title: "Historial de Citas",
    href: "/history",
    icon: History,
    role: 'patient',
  },
  {
    title: "Historial Paciente", 
    href: "/patients/history", 
    icon: Users,
    role: 'staff',
  },
  {
    title: "Gestionar Disponibilidad",
    href: "/availability",
    icon: Clock,
    role: 'staff',
  },
  {
    title: "Configuración",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Gestión Usuarios",
    href: "/admin/users",
    icon: Users,
    role: 'admin',
    disabled: true,
  },
  {
    title: "Especialidades",
    href: "/admin/specialties",
    icon: BriefcaseMedical,
    role: 'admin',
    disabled: true,
  },
];
