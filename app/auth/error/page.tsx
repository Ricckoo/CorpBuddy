"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const error = searchParams.get("error");
  
  let errorMessage = "An unknown error occurred during authentication.";
  
  if (error === "Configuration") {
    errorMessage = "There is a problem with the server configuration.";
  } else if (error === "AccessDenied") {
    errorMessage = "You do not have access to this resource.";
  } else if (error === "Verification") {
    errorMessage = "The verification link may have been used or is invalid.";
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-red-600">Authentication Error</CardTitle>
          <CardDescription className="text-base mt-2">
            {errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button 
            onClick={() => router.push("/auth/signin")}
            className="w-full"
          >
            Try Again
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          If the problem persists, please contact support.
        </CardFooter>
      </Card>
    </div>
  );
} 