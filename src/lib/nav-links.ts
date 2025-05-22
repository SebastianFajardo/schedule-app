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
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    role: 'staff', // Staff and Admin
  },
  {
    title: "My Appointments",
    href: "/appointments",
    icon: CalendarDays,
    role: 'patient',
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: CalendarDays,
    label: "Manage",
    role: 'staff',
  },
  {
    title: "Book Appointment",
    href: "/appointments/book", // Patient view for booking
    icon: CalendarPlus,
    role: 'patient',
  },
  {
    title: "New Appointment",
    href: "/appointments/new", // Staff view for registering
    icon: CalendarPlus,
    role: 'staff',
  },
  {
    title: "Availability Calendar",
    href: "/appointments/calendar",
    icon: CalendarDays, // Could be a specific availability icon too
    role: 'staff',
  },
  {
    title: "AI Reminders",
    href: "/reminders",
    icon: BellRing,
    role: 'staff',
  },
  {
    title: "Appointment History",
    href: "/history",
    icon: History,
    role: 'patient',
  },
  {
    title: "Patient History", // For staff
    href: "/patients/history", // Example path
    icon: Users,
    role: 'staff',
  },
  {
    title: "Manage Availability",
    href: "/availability",
    icon: Clock,
    role: 'staff',
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  // Admin specific links (conceptual, UI might not be fully built)
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
    role: 'admin',
  },
  {
    title: "Specialties",
    href: "/admin/specialties",
    icon: BriefcaseMedical,
    role: 'admin',
  },
];
