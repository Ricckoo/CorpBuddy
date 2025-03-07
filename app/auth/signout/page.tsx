"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign Out</CardTitle>
          <CardDescription>Are you sure you want to sign out?</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full"
          >
            Yes, Sign Out
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="w-full"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 