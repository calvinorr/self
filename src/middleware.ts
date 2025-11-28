import { auth } from "@/auth";

export default auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icons, images
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|icon|apple-icon|manifest).*)",
  ],
};
