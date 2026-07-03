"use client";

import { useAppSelector } from "@/hooks/use-app-dispatch";

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardGreeting() {
  const user = useAppSelector((s) => s.auth.user);
  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {getTimeOfDayGreeting()}, {firstName} 👋
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here&apos;s what&apos;s happening with your projects today.
      </p>
    </div>
  );
}
