"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";

import { SectionCard } from "@/components/settings/section-card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROLE } from "@/lib/design-tokens";
import { getInitials } from "@/store/slices/auth.slice";
import {
  profileSchema,
  type ProfileFormData,
} from "@/lib/validations/settings";
import { useAppSelector, useAppDispatch } from "@/hooks/use-app-dispatch";
import { setUser } from "@/store/slices/auth.slice";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/user";

export function ProfileSection() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.fullName ?? "", bio: "" },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    if (user) {
      dispatch(
        setUser({
          ...user,
          fullName: data.name,
        }),
      );
    }

    setIsLoading(false);

    setSaved(true);

    setTimeout(() => setSaved(false), 3000);
  };

  const role: UserRole = (user?.role as UserRole) ?? "USER";
  return (
    <SectionCard
      title="Profile"
      description="Your personal information visible to team members."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-xl font-bold text-primary">
            {user ? getInitials(user.fullName) : "?"}
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-foreground">
              {user?.fullName ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.email ?? "—"}
            </p>
            <span
              className={cn(
                "mt-1 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                ROLE[role].badge,
              )}
            >
              {ROLE[role].label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Full name"
            htmlFor="name"
            error={errors.name?.message}
            required
          >
            <Input
              id="name"
              type="text"
              state={errors.name ? "error" : "default"}
              {...register("name")}
            />
          </FormField>

          <FormField
            label="Email"
            htmlFor="email"
            hint="Email changes require verification."
          >
            <Input
              id="email"
              type="email"
              value={user?.email ?? ""}
              disabled
              className="opacity-60"
            />
          </FormField>
        </div>

        <FormField
          label="Bio"
          htmlFor="bio"
          error={errors.bio?.message}
          hint="Up to 160 characters."
        >
          <textarea
            id="bio"
            rows={3}
            placeholder="A short introduction about yourself…"
            className="flex w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register("bio")}
          />
        </FormField>

        <div className="flex items-center gap-3">
          <Button type="submit" size="sm" disabled={isLoading || !isDirty}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
          {saved && (
            <span className="flex items-center gap-1 text-xs text-green-500">
              <CheckCircle2 className="size-3.5" />
              Saved
            </span>
          )}
        </div>
      </form>
    </SectionCard>
  );
}
