import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Define paths that require authentication
  const protectedPaths = ["/dashboard", "/settings"];
  
  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  );

  // Handle root path - redirect to dashboard if authenticated, otherwise to sign-in
  if (req.nextUrl.pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  // Redirect to sign-in if accessing protected route without auth
  if (isProtectedPath && !token) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect to dashboard if already signed in and trying to access auth pages
  if (token && req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Add paths that should be checked by the middleware
    "/",
    "/dashboard/:path*",
    "/settings/:path*",
    "/auth/:path*",
  ],
}; 