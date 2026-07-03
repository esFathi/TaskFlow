"use client";

import { Search, Bell, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-dispatch";
import { setTheme } from "@/store/slices/ui.slice";
import { getInitials } from "@/store/slices/auth.slice";
import { Breadcrumbs } from "./breadcrumbs";

const THEME_ICONS = {
  light: <Sun className="size-3.5" />,
  dark: <Moon className="size-3.5" />,
  system: <Monitor className="size-3.5" />,
} as const;

type Theme = keyof typeof THEME_ICONS;

export function Header() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const user = useAppSelector((s) => s.auth.user);

  const cycleTheme = () => {
    const order: Theme[] = ["light", "dark", "system"];
    const next = order[(order.indexOf(theme as Theme) + 1) % order.length];
    dispatch(setTheme(next));
  };

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <Breadcrumbs />

      <div className="ml-auto flex items-center gap-1">
        {/* Search */}
        <button
          className={cn(
            "flex h-8 items-center gap-2 rounded-lg border border-border bg-muted/50",
            "px-3 text-sm text-muted-foreground transition-colors hover:bg-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          aria-label="Search"
        >
          <Search className="size-3.5 shrink-0" />
          <span className="hidden sm:block">Search</span>
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-background px-1 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={cycleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Current theme: ${theme}`}
          title={`Theme: ${theme}`}
        >
          {THEME_ICONS[theme as Theme]}
        </button>

        {/* User avatar */}
        <button
          className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors hover:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="User menu"
          title={user?.name}
        >
          <span className="text-[11px] font-semibold">
            {user ? getInitials(user.fullName) : "?"}
          </span>
        </button>
      </div>
    </header>
  );
}
