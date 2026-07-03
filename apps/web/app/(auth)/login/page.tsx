"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { login as loginAction } from "@/store/slices/auth.slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

// Isolated in its own component so useSearchParams can be wrapped in Suspense
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const result = await dispatch(
        loginAction({
          email: data.email,
          password: data.password,
        }),
      );

      if (loginAction.fulfilled.match(result)) {
        document.cookie = `taskflow-token=${result.payload.accessToken}; path=/; max-age=86400; SameSite=Lax`;
        console.log(document.cookie);

        router.push(searchParams.get("from") ?? "/dashboard");
      }

      if (loginAction.rejected.match(result)) {
        setAuthError(
          typeof result.payload === "string"
            ? result.payload
            : "Invalid email or password.",
        );
      }
    } catch (error) {
      console.error(error);
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface-0 p-6 shadow-xs">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <FormField
          label="Email"
          htmlFor="email"
          error={errors.email?.message}
          required
        >
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            state={errors.email ? "error" : "default"}
            autoComplete="email"
            autoFocus
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          required
        >
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              state={errors.password ? "error" : "default"}
              autoComplete="current-password"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="size-3.5 rounded border-border accent-primary"
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {authError && (
          <p
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {authError}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-md">
          <span className="text-lg font-bold text-primary-foreground">T</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in to your TaskFlow account
        </p>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
