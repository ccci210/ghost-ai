import { clerkMiddleware } from "@clerk/nextjs/server";

const signInPath = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";
const signUpPath = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";

function matchesRoute(pathname: string, route: string) {
  const normalizedRoute = route.replace(/\/$/, "");
  return pathname === normalizedRoute || pathname.startsWith(`${normalizedRoute}/`);
}

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  const isPublicAuthPage =
    matchesRoute(pathname, signInPath) || matchesRoute(pathname, signUpPath);

  if (!isPublicAuthPage) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
