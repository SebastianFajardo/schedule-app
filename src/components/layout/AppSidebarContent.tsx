"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/nav-links";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock current user role - replace with actual auth context
const currentUserRole = "staff"; // 'patient', 'staff', or 'admin'

export default function AppSidebarContent() {
  const pathname = usePathname();

  const filteredNavLinks = navLinks.filter(link => {
    if (!link.role) return true; // No role restriction
    if (currentUserRole === 'admin') return true; // Admin sees all staff/admin links
    if (currentUserRole === 'staff' && (link.role === 'staff' || link.role === 'admin')) return true;
    if (currentUserRole === 'patient' && link.role === 'patient') return true;
    return false;
  });


  return (
    <ScrollArea className="flex-1">
      <nav className="grid items-start gap-1 px-2 py-4 text-sm font-medium">
        {filteredNavLinks.map((item: NavItem) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard" && item.href !== "/");
          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" : "text-sidebar-foreground",
                item.disabled && "cursor-not-allowed opacity-50"
              )}
              aria-disabled={item.disabled}
              tabIndex={item.disabled ? -1 : undefined}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
              {item.label && (
                <span className="ml-auto rounded-md bg-sidebar-accent px-2 py-0.5 text-xs text-sidebar-accent-foreground">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </ScrollArea>
  );
}
