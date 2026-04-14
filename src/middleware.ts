import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // In dev mode without Supabase configured, skip auth checks
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return NextResponse.next();
  }

  // Production: use Supabase auth
  const { updateSession } = await import("@/lib/supabase/middleware");
  const { user, supabaseResponse } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/auth")
  ) {
    return supabaseResponse;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
