
/**
 * @license SPDX-FileCopyrightText: Copyright (c) 2024 PyGMI, Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { Menu, PanelLeftClose } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const MOBILE_BREAKPOINT = 768;
const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3.5rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobileHook = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    // Initialize _open state based SOLELY on defaultOpen for SSR consistency
    const [_open, _setOpen] = React.useState(defaultOpen);

    React.useEffect(() => {
      // This effect runs only on the client after mount
      const currentIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (currentIsMobile) {
        _setOpen(false); // Always close on mobile after mount if uncontrolled
        if (setOpenProp && openProp !== false) {
           setOpenProp(false);
        }
      } else {
        // On desktop, check cookie after mount
        const cookieValue = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
          ?.split("=")[1];

        if (cookieValue !== undefined) {
          const cookieOpenState = cookieValue === "true";
          if (!setOpenProp) { // Only set internal state if not controlled
            _setOpen(cookieOpenState);
          }
        }
        // If no cookie, _open remains as per defaultOpen (which was set in useState)
      }
    }, [defaultOpen, setOpenProp, isMobileHook, openProp]); // Dependencies

    const open = openProp ?? _open;

    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const currentIsMobile = typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT;
        const newOpenState = typeof value === "function" ? value(open) : value;

        if (setOpenProp) {
          setOpenProp(newOpenState);
        } else {
          _setOpen(newOpenState);
        }

        if (!currentIsMobile) {
          document.cookie = `${SIDEBAR_COOKIE_NAME}=${newOpenState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        }
      },
      [setOpenProp, open, _setOpen]
    );

    const toggleSidebar = React.useCallback(() => {
      const currentIsMobile = typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT;
      if (currentIsMobile) {
        setOpenMobile((current) => !current);
      } else {
        setOpen((current) => !current);
      }
    }, [setOpen, setOpenMobile]);

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        const currentIsMobile = typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT;
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey) && !currentIsMobile
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    const contextIsMobile = useIsMobile();
    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile: !!contextIsMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, contextIsMobile, openMobile, setOpenMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper", // Removed flex-col here, handled by AppLayout
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "icon",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <aside
          className={cn(
            "flex h-screen flex-col bg-sidebar text-sidebar-foreground",
            "w-[--sidebar-width]",
            variant === 'floating' || variant === 'inset' ? 'm-2 rounded-lg shadow-lg !h-[calc(100vh-1rem)]' : 'border-r border-sidebar-border',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </aside>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground flex flex-col"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <SheetTitle className="sr-only">Menú de Navegación Principal</SheetTitle>
            {children}
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <aside
        ref={ref}
        className={cn(
          "group peer hidden md:flex flex-col text-sidebar-foreground bg-sidebar h-screen",
          "transition-all duration-200 ease-in-out",
          'w-[--sidebar-width-icon]',
          'data-[state=expanded]:w-[--sidebar-width]',
          'data-[state=collapsed]:hover:w-[--sidebar-width]',
          variant === 'floating' || variant === 'inset' ? 'm-2 rounded-lg shadow-lg !h-[calc(100vh-1rem)]' : 'border-r border-sidebar-border',
          className
        )}
        data-state={state}
        data-collapsible={collapsible}
        data-variant={variant}
        data-side={side}
        {...props}
      >
        {children}
      </aside>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { asChild?: boolean }
>(({ className, onClick: propOnClick, children, asChild = false, ...props }, ref) => {
  const { toggleSidebar, isMobile } = useSidebar();

  if (!isMobile) return null;

  const Comp = asChild ? Slot : Button;
  const defaultIcon = <Menu className="h-5 w-5" />;
  const defaultSrText = "Alternar menú de navegación";

  return (
    <Comp
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("shrink-0 h-9 w-9", className)}
      {...props}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        propOnClick?.(event);
        toggleSidebar();
      }}
    >
      {children ? children : (
        <>
          {defaultIcon}
          <span className="sr-only">{defaultSrText}</span>
        </>
      )}
    </Comp>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";


const SidebarInset = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex-1 flex flex-col bg-background", // Removed overflow-y-auto, parent handles it
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-lg",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background text-sm shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        "group-data-[state=collapsed]:not(group-hover):hidden",
        "group-data-[state=expanded]:flex",
        "group-data-[state=collapsed]:group-hover:flex",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2 shrink-0", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2 mt-auto shrink-0", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border",
      "group-data-[state=expanded]:my-1",
      "group-data-[state=collapsed]:group-hover:my-1",
      "group-data-[state=collapsed]:not(group-hover):mx-auto group-data-[state=collapsed]:not(group-hover):my-1 group-data-[state=collapsed]:not(group-hover):h-auto group-data-[state=collapsed]:not(group-hover):w-3/4",
      className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col",
      "group-data-[state=expanded]:p-2",
      "group-data-[state=collapsed]:group-hover:p-2",
      "group-data-[state=collapsed]:not(group-hover):p-0 group-data-[state=collapsed]:not(group-hover):items-center",
      className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[state=collapsed]:not(group-hover):hidden",
        "group-data-[state=expanded]:flex",
        "group-data-[state=collapsed]:group-hover:flex",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[state=collapsed]:not(group-hover):hidden",
        "group-data-[state=expanded]:flex",
        "group-data-[state=collapsed]:group-hover:flex",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm",
    "group-data-[state=expanded]:block",
    "group-data-[state=collapsed]:group-hover:block",
    "group-data-[state=collapsed]:not(group-hover):flex group-data-[state=collapsed]:not(group-hover):flex-col group-data-[state=collapsed]:not(group-hover):items-center",
    className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1",
    "group-data-[state=expanded]:items-start",
    "group-data-[state=collapsed]:group-hover:items-start",
    "group-data-[state=collapsed]:not(group-hover):items-center",
    className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative w-full", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-primary data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
  "group-data-[state=collapsed]:not(group-hover):justify-center group-data-[state=collapsed]:not(group-hover):p-2 group-data-[state=collapsed]:not(group-hover):w-auto group-data-[state=collapsed]:not(group-hover):aspect-square",
  "group-data-[state=expanded]:justify-start group-data-[state=expanded]:p-2 group-data-[state=expanded]:w-full group-data-[state=expanded]:aspect-auto",
  "group-data-[state=collapsed]:group-hover:justify-start group-data-[state=collapsed]:group-hover:p-2 group-data-[state=collapsed]:group-hover:w-full group-data-[state=collapsed]:group-hover:aspect-auto",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-9 text-sm",
        sm: "h-8 text-xs",
        lg: "h-10 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state: sidebarPinnedState } = useSidebar()

    const iconChild = React.Children.toArray(children).find(child =>
      React.isValidElement(child) && typeof child.type !== 'string' && ((child.type as React.FC).displayName?.includes('LucideIcon') || child.props.className?.includes('lucide-'))
    );

    const textChildrenArray: React.ReactNode[] = [];
    React.Children.forEach(children, child => {
        if (typeof child === 'string') {
            textChildrenArray.push(child);
        } else if (React.isValidElement(child) && child.type === React.Fragment) {
            React.Children.forEach(child.props.children, fragmentChild => {
                if (typeof fragmentChild === 'string') {
                    textChildrenArray.push(fragmentChild);
                } else if (React.isValidElement(fragmentChild) && typeof fragmentChild.type === 'string') {
                     textChildrenArray.push(fragmentChild);
                }
            });
        } else if (React.isValidElement(child) && typeof child.type === 'string') {
            textChildrenArray.push(child);
        }
    });


    const buttonContent = (
      <>
        {iconChild && React.cloneElement(iconChild as React.ReactElement, { className: cn((iconChild as React.ReactElement).props.className, "shrink-0") })}
        <span className={cn(
          "truncate",
          "group-data-[state=collapsed]:not(group-hover):hidden", // Oculto si colapsado y SIN hover
          "group-data-[state=expanded]:inline",                  // Visible si expandido
          "group-data-[state=collapsed]:group-hover:inline"     // Visible si colapsado Y CON hover
        )}>
          {textChildrenArray}
        </span>
      </>
    );

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size, className }))}
        {...props}
      >
        {buttonContent}
      </Comp>
    )

    const showTooltip = sidebarPinnedState === "collapsed" && !isMobile;

    if (!tooltip || !showTooltip) {
      return button;
    }

    let tooltipContentNode: React.ReactNode = tooltip;
    if (typeof tooltip === 'string') {
        tooltipContentNode = tooltip;
    } else if (React.isValidElement(tooltip) && tooltip.props.children) {
        tooltipContentNode = tooltip.props.children;
    } else if (textChildrenArray.length > 0) {
        tooltipContentNode = textChildrenArray;
    }

    if (!tooltipContentNode) return button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          alignOffset={4}
          sideOffset={6}
          className={cn(
           "group-data-[state=expanded]:hidden",
           "group-data-[state=collapsed]:group-hover:hidden"
          )}
        >
          {tooltipContentNode}
        </TooltipContent>
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1/2 -translate-y-1/2 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1/2",
        "peer-data-[size=default]/menu-button:top-1/2",
        "peer-data-[size=lg]/menu-button:top-1/2",
        "group-data-[state=collapsed]:not(group-hover):hidden",
        "group-data-[state=expanded]:flex",
        "group-data-[state=collapsed]:group-hover:flex",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 top-1/2 -translate-y-1/2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "group-data-[state=collapsed]:not(group-hover):hidden",
      "group-data-[state=expanded]:flex",
      "group-data-[state=collapsed]:group-hover:flex",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-8 flex gap-2 px-2 items-center",
      "group-data-[state=expanded]:w-full group-data-[state=expanded]:justify-start group-data-[state=expanded]:px-2",
      "group-data-[state=collapsed]:group-hover:w-full group-data-[state=collapsed]:group-hover:justify-start group-data-[state=collapsed]:group-hover:px-2",
      "group-data-[state=collapsed]:not(group-hover):w-8 group-data-[state=collapsed]:not(group-hover):justify-center group-data-[state=collapsed]:not(group-hover):px-0",
      className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md shrink-0"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className={cn("h-4 flex-1 max-w-[--skeleton-width]",
        "group-data-[state=expanded]:inline-block",
        "group-data-[state=collapsed]:group-hover:inline-block",
        "group-data-[state=collapsed]:not(group-hover):hidden"
       )}
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[state=collapsed]:not(group-hover):hidden",
      "group-data-[state=expanded]:flex",
      "group-data-[state=collapsed]:group-hover:flex",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => <li ref={ref} className={cn("w-full", className)} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[state=collapsed]:not(group-hover):hidden", // Hide text part
        "group-data-[state=expanded]:flex",
        "group-data-[state=collapsed]:group-hover:flex",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
