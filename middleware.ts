import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Protects every /admin route (pages + server actions run behind them).
// Only a signed-in user whose email matches ADMIN_EMAIL may pass.
// Everyone else is redirected to /admin/login.
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login";

  if (isAdminRoute) {
    const isAdmin = !!user && user.email === process.env.ADMIN_EMAIL;
    if (!isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
