"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface SignInButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export function SignInButton({ variant = "default", size = "default" }: SignInButtonProps) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <Button variant={variant} size={size} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading
      </Button>
    );
  }

  if (session) {
    return (
      <Button variant="outline" size={size} onClick={() => signOut()}>
        Sign Out
      </Button>
    );
  }

  return (
    <Button variant={variant} size={size} onClick={() => signIn("google")}>
      Sign In with Google
    </Button>
  );
} 